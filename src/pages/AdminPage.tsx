import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, LANGS, SiteHeader, usePageMotion } from '../lib/shared'
import { EVENT_CONFIG, TIME_SLOTS } from '../config/event'
import {
  createOrUpdateEvent,
  deleteEvent,
  deleteEventMemory,
  fetchAllEvents,
  fetchAllMemories,
  fetchFormFieldSettings,
  fetchOfficialSlotCapacities,
  fetchRegistrations,
  fetchSurveys,
  getSession,
  parseStructuredComment,
  registrationsToRows,
  saveEventMemory,
  saveFormFieldSetting,
  setActiveEventYear,
  signInAdmin,
  signOutAdmin,
  surveysToRows,
  updateOfficialSlotCapacities,
  uploadEventPhoto,
} from '../lib/supabase'
import type { EventItem, EventMemory, FormFieldSetting, FormType, Registration, SurveyResponse } from '../types'
import { downloadXLSX } from '../lib/utils'
import { resolveLegacyPhotoUrl } from '../lib/legacyPhotos'

interface ChartDatum {
  label: string
  count: number
}

type Msg = { type: 'ok' | 'error'; text: string } | null

function countBy(values: string[]): ChartDatum[] {
  const counts = new Map<string, number>()
  for (const v of values) {
    if (!v || v === '—') continue
    counts.set(v, (counts.get(v) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
}

function BarChart({ title, data }: { title: string; data: ChartDatum[] }) {
  const max = Math.max(1, ...data.map((d) => d.count))
  return (
    <div className="chart-block">
      <h3>{title}</h3>
      {data.length === 0 ? (
        <p className="chart-empty">データがありません</p>
      ) : (
        <div className="chart-bars">
          {data.map(({ label, count }) => (
            <div className="chart-bar-row" key={label}>
              <span className="chart-bar-label">{label}</span>
              <div className="chart-bar-track">
                <div className="chart-bar-fill" style={{ width: `${(count / max) * 100}%` }} />
              </div>
              <span className="chart-bar-value">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Banner({ msg }: { msg: Msg }) {
  if (!msg) return null
  return <div className={`admin-banner ${msg.type}`}>{msg.text}</div>
}

function FieldSettingsEditor({
  title,
  hint,
  drafts,
  onMove,
  onUpdate,
  onSave,
  saving,
}: {
  title: string
  hint: string
  drafts: FieldDraft[]
  onMove: (index: number, dir: -1 | 1) => void
  onUpdate: (key: string, patch: Partial<FieldDraft>) => void
  onSave: () => void
  saving: boolean
}) {
  return (
    <div className="admin-card-panel">
      <h3>{title}</h3>
      <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginTop: '-0.5rem' }}>{hint}</p>
      <div className="admin-field-settings-list">
        {drafts.map((d, i) => (
          <div key={d.key} className="admin-field-settings-row">
            <div className="admin-field-settings-order">
              <button type="button" onClick={() => onMove(i, -1)} disabled={i === 0} aria-label="上へ">▲</button>
              <button type="button" onClick={() => onMove(i, 1)} disabled={i === drafts.length - 1} aria-label="下へ">▼</button>
            </div>
            <div className="admin-field-settings-main">
              <div className="admin-field-settings-default">{d.defaultLabel}</div>
              <input
                type="text"
                placeholder="表示ラベルを変更する場合はここに入力（空欄でデフォルト表示）"
                value={d.label_override}
                onChange={(e) => onUpdate(d.key, { label_override: e.target.value })}
              />
            </div>
            <label className="admin-field-settings-toggle">
              <input
                type="checkbox"
                checked={d.is_visible}
                disabled={d.locked}
                onChange={(e) => onUpdate(d.key, { is_visible: e.target.checked })}
              />
              表示する
            </label>
            <label className="admin-field-settings-toggle">
              <input
                type="checkbox"
                checked={d.is_required}
                disabled={d.locked}
                onChange={(e) => onUpdate(d.key, { is_required: e.target.checked })}
              />
              必須
            </label>
            {d.locked && <span className="admin-field-settings-locked">必須項目のため変更不可</span>}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '1.25rem' }}>
        <button type="button" className="button primary" onClick={onSave} disabled={saving}>
          {saving ? '保存中...' : '設定を保存'}
        </button>
      </div>
    </div>
  )
}

// Admin la giao dien tieng Nhat 100% (theo quy uoc du an) — khong dung
// nhan ban ngu tu `LANGS` (danh cho nguoi dung cuoi chon ngon ngu) vi
// giao vien khong doc duoc chu Myanmar/Nepal/Uzbek/Bengal/Thai/Sinhala.
const ADMIN_LANG_LABELS: Record<string, string> = {
  ja: '日本語',
  vi: 'ベトナム語',
  en: '英語',
  my: 'ミャンマー語',
  ne: 'ネパール語',
  zh: '中国語',
  uz: 'ウズベク語',
  bn: 'ベンガル語',
  id: 'インドネシア語',
  ko: '韓国語',
  th: 'タイ語',
  si: 'シンハラ語',
}

interface ConfirmDialogState {
  title: string
  message: string
  requireText?: string
  danger?: boolean
  confirmLabel?: string
  onConfirm: () => void
}

interface FieldDef {
  key: string
  defaultLabel: string
  locked?: boolean
  defaultRequired: boolean
}

interface FieldDraft extends FieldDef {
  label_override: string
  is_visible: boolean
  is_required: boolean
  sort_order: number
}

const REGISTRATION_FIELD_DEFS: FieldDef[] = [
  { key: 'name', defaultLabel: '氏名（フルネーム）', locked: true, defaultRequired: true },
  { key: 'furigana', defaultLabel: 'フリガナ', defaultRequired: true },
  { key: 'email', defaultLabel: 'メールアドレス', defaultRequired: true },
  { key: 'studentId', defaultLabel: '学生番号 / 教職員番号', locked: true, defaultRequired: true },
  { key: 'phone', defaultLabel: '電話番号', defaultRequired: true },
  { key: 'school', defaultLabel: '学校名', defaultRequired: true },
  { key: 'department', defaultLabel: 'コース名（クラス）', locked: true, defaultRequired: true },
  { key: 'birthDate', defaultLabel: '生年月日', defaultRequired: true },
  { key: 'timeSlot', defaultLabel: '受付希望時間', defaultRequired: true },
  { key: 'donationExperience', defaultLabel: '献血経験', defaultRequired: true },
  { key: 'gender', defaultLabel: '性別', defaultRequired: false },
]

const SURVEY_FIELD_DEFS: FieldDef[] = [
  { key: 'donationCount', defaultLabel: 'Q1. 献血経験（回数）', locked: true, defaultRequired: true },
  { key: 'impressions', defaultLabel: 'Q2. 印象について（複数回答）', defaultRequired: false },
  { key: 'reasons', defaultLabel: 'Q3. 未経験の理由（献血未経験者のみ表示・複数回答）', defaultRequired: false },
  { key: 'knewCampus', defaultLabel: 'Q4. 学内献血を知っていたか', defaultRequired: false },
  { key: 'wantParticipate', defaultLabel: 'Q5. 参加意向', defaultRequired: false },
  { key: 'conditions', defaultLabel: 'Q6. 参加しやすくなる条件（複数回答）', defaultRequired: false },
  { key: 'reservation', defaultLabel: 'Q7. 事前予約について', defaultRequired: false },
]

function buildFieldDrafts(defs: FieldDef[], settings: FormFieldSetting[]): FieldDraft[] {
  const map = new Map(settings.map((s) => [s.field_key, s]))
  return defs
    .map((def, i) => {
      const s = map.get(def.key)
      return {
        ...def,
        label_override: s?.label_override ?? '',
        is_visible: s?.is_visible ?? true,
        is_required: def.locked ? true : s?.is_required ?? def.defaultRequired,
        sort_order: s?.sort_order ?? i,
      }
    })
    .sort((a, b) => a.sort_order - b.sort_order)
}

const DEFAULT_EVENT_DRAFT = {
  title: '献血ボランティア活動',
  time_display: '9:30〜11:30 / 12:30〜16:30',
  location: 'ECCコンピュータ専門学校',
  location_detail: '1号館 1階ラウンジ',
  capacity: 50,
  slot_capacity: 8,
  sponsor: '大阪曾根崎ライオンズクラブ / 大阪西ライオンズクラブ',
  reservation_note: 'ご予約をいただくと献血にかかる手続きの時間が短くなります',
  gift_note: '献血にご協力いただいた方に、ライオンズクラブ様よりささやかなプレゼントをご用意しています',
  show_pending_notice: false,
}

export default function AdminPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<'registrations' | 'events' | 'memories' | 'formFields'>('registrations')

  // Data
  const [events, setEvents] = useState<EventItem[]>([])
  const [selectedYear, setSelectedYear] = useState<number>(EVENT_CONFIG.year)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [surveys, setSurveys] = useState<SurveyResponse[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [officialCapacities, setOfficialCapacities] = useState<Record<string, number>>({})
  const [capacitySaving, setCapacitySaving] = useState(false)
  const [capacityMsg, setCapacityMsgRaw] = useState<Msg>(null)

  // Event Settings Tab State
  const [newEventYear, setNewEventYear] = useState<number>(new Date().getFullYear() + 1)
  const [creatingBatch, setCreatingBatch] = useState(false)
  const [savingEvent, setSavingEvent] = useState(false)
  const [activatingYear, setActivatingYear] = useState<number | null>(null)
  const [deletingYear, setDeletingYear] = useState<number | null>(null)
  const [eventForm, setEventForm] = useState<Partial<EventItem>>({
    year: EVENT_CONFIG.year,
    ...DEFAULT_EVENT_DRAFT,
    date_display: '2026年9月15日（火）',
  })
  const [eventSaveMsg, setEventSaveMsgRaw] = useState<Msg>(null)
  const eventFormRef = useRef<HTMLFormElement>(null)
  const [eventFormFlash, setEventFormFlash] = useState(false)

  // Memories Tab State
  const [memories, setMemories] = useState<EventMemory[]>([])
  const [selectedMemoryYear, setSelectedMemoryYear] = useState<number>(2025)
  const [addMemoryYearInput, setAddMemoryYearInput] = useState<number>(new Date().getFullYear() + 1)
  const [memoryForm, setMemoryForm] = useState<Partial<EventMemory>>({
    event_year: 2025,
    badge: '昨年の記録',
    title: '学内献血の様子',
    summary: '',
    photos: [],
    source_label: 'ECC社会貢献センター 活動報告',
    source_link: '',
    translations: {},
    is_published: true,
  })
  const [activeMemoryLang, setActiveMemoryLang] = useState('ja')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [savingMemory, setSavingMemory] = useState(false)
  const [deletingMemoryYear, setDeletingMemoryYear] = useState<number | null>(null)
  const memoryFormRef = useRef<HTMLFormElement>(null)
  const [memoryFormFlash, setMemoryFormFlash] = useState(false)

  // Form Field Settings Tab State
  const [regFieldDrafts, setRegFieldDrafts] = useState<FieldDraft[]>(buildFieldDrafts(REGISTRATION_FIELD_DEFS, []))
  const [surveyFieldDrafts, setSurveyFieldDrafts] = useState<FieldDraft[]>(buildFieldDrafts(SURVEY_FIELD_DEFS, []))
  const [savingFieldsFor, setSavingFieldsFor] = useState<FormType | null>(null)
  const [fieldSaveMsg, setFieldSaveMsgRaw] = useState<Msg>(null)

  // Custom confirm/delete dialog (thay cho window.confirm/prompt mặc định)
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null)
  const [confirmInput, setConfirmInput] = useState('')
  const closeConfirmDialog = () => {
    setConfirmDialog(null)
    setConfirmInput('')
  }
  const [memorySaveMsg, setMemorySaveMsgRaw] = useState<Msg>(null)

  // Toast noi (fixed, luon nhin thay du dang cuon o dau trang) — bao boc
  // lai cac setter *Msg de moi noi goi setXxxMsg(...) nhu cu deu tu dong
  // hien toast, khong can sua tung noi goi.
  const [toast, setToast] = useState<{ id: number; type: 'ok' | 'error'; text: string } | null>(null)
  const toastIdRef = useRef(0)
  const showToast = (msg: Msg) => {
    if (!msg) return
    const id = ++toastIdRef.current
    setToast({ id, type: msg.type, text: msg.text })
    window.setTimeout(() => setToast((curr) => (curr?.id === id ? null : curr)), 3500)
  }
  const setCapacityMsg = (msg: Msg) => { setCapacityMsgRaw(msg); showToast(msg) }
  const setEventSaveMsg = (msg: Msg) => { setEventSaveMsgRaw(msg); showToast(msg) }
  const setMemorySaveMsg = (msg: Msg) => { setMemorySaveMsgRaw(msg); showToast(msg) }
  const setFieldSaveMsg = (msg: Msg) => { setFieldSaveMsgRaw(msg); showToast(msg) }

  // Chuyen sang chinh sua mot event khac: cuon toi form + nhap nhay de
  // nguoi dung thay ro noi dung vua doi (truoc day doi form am tham).
  const handleEditEvent = (ev: EventItem) => {
    setEventForm(ev)
    setEventFormFlash(true)
    window.setTimeout(() => setEventFormFlash(false), 900)
    eventFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Login
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginSubmitting, setLoginSubmitting] = useState(false)
  usePageMotion(rootRef)

  // Load all dashboard data
  const loadDashboardData = async (targetYear: number) => {
    try {
      const [eventsList, memoriesList, regData, surveyData, capData, regFieldSettings, surveyFieldSettings] = await Promise.all([
        fetchAllEvents(),
        fetchAllMemories(),
        fetchRegistrations(targetYear),
        fetchSurveys(targetYear),
        fetchOfficialSlotCapacities(targetYear),
        fetchFormFieldSettings('registration'),
        fetchFormFieldSettings('survey'),
      ])
      setEvents(eventsList)
      setMemories(memoriesList)
      setRegistrations(regData)
      setSurveys(surveyData)
      setOfficialCapacities(capData)
      setRegFieldDrafts(buildFieldDrafts(REGISTRATION_FIELD_DEFS, regFieldSettings))
      setSurveyFieldDrafts(buildFieldDrafts(SURVEY_FIELD_DEFS, surveyFieldSettings))

      // Setup event form if event exists
      const currEvent = eventsList.find(e => e.year === targetYear)
      if (currEvent) {
        setEventForm(currEvent)
      }

      // Setup memory form
      if (memoriesList.length > 0) {
        const mem = memoriesList.find(m => m.event_year === selectedMemoryYear) || memoriesList[0]
        setSelectedMemoryYear(mem.event_year)
        setMemoryForm(mem)
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
    }
  }

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        setIsAuthenticated(true)
        loadDashboardData(selectedYear).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Switch year for registrations
  const handleYearChange = async (year: number) => {
    setSelectedYear(year)
    setSelectedSlot(null)
    const [regData, surveyData, capData] = await Promise.all([
      fetchRegistrations(year),
      fetchSurveys(year),
      fetchOfficialSlotCapacities(year),
    ])
    setRegistrations(regData)
    setSurveys(surveyData)
    setOfficialCapacities(capData)

    const currEvent = events.find(e => e.year === year)
    if (currEvent) setEventForm(currEvent)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginSubmitting(true)
    setLoginError(null)
    try {
      await signInAdmin(loginEmail, loginPassword)
      setIsAuthenticated(true)
      await loadDashboardData(selectedYear)
    } catch {
      setLoginError('メールアドレスまたはパスワードが正しくありません。')
    } finally {
      setLoginSubmitting(false)
    }
  }

  const handleLogout = async () => {
    await signOutAdmin()
    setIsAuthenticated(false)
    setRegistrations([])
    setSurveys([])
  }

  const handleCapacitySave = async () => {
    setCapacitySaving(true)
    setCapacityMsg(null)
    try {
      await updateOfficialSlotCapacities(selectedYear, officialCapacities)
      setCapacityMsg({ type: 'ok', text: '日本赤十字社の空き枠数を正常に更新しました！' })
    } catch {
      setCapacityMsg({ type: 'error', text: '枠数の保存に失敗しました。もう一度お試しください。' })
    } finally {
      setCapacitySaving(false)
    }
  }

  // ── Event Management Actions ──
  const handleSaveEventSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setEventSaveMsg(null)
    setSavingEvent(true)
    try {
      await createOrUpdateEvent({
        ...eventForm,
        year: eventForm.year || selectedYear,
      } as EventItem)
      const list = await fetchAllEvents()
      setEvents(list)
      setEventSaveMsg({ type: 'ok', text: `${eventForm.year}年のイベント情報を保存しました！` })
    } catch (err) {
      console.error('handleSaveEventSettings failed:', err)
      setEventSaveMsg({ type: 'error', text: '保存に失敗しました。' })
    } finally {
      setSavingEvent(false)
    }
  }

  const performActivateEvent = async (year: number) => {
    setActivatingYear(year)
    try {
      await setActiveEventYear(year)
      const list = await fetchAllEvents()
      setEvents(list)
      setEventSaveMsg({ type: 'ok', text: `${year}年を現在進行中のイベントに設定しました！` })
    } catch {
      setEventSaveMsg({ type: 'error', text: '変更に失敗しました。' })
    } finally {
      setActivatingYear(null)
    }
  }

  const handleActivateEvent = (year: number) => {
    setConfirmDialog({
      title: '公開イベントの切り替え',
      message: `${year}年のイベントを【現在進行中（Active）】に設定しますか？\nWebサイト上の参加者の木と申込フォームがこの年に切り替わります。`,
      confirmLabel: '切り替える',
      onConfirm: () => void performActivateEvent(year),
    })
  }

  const performDeleteEvent = async (year: number) => {
    setDeletingYear(year)
    try {
      await deleteEvent(year)
      const list = await fetchAllEvents()
      setEvents(list)
      if (eventForm.year === year) {
        setEventForm(list.find((e) => e.is_active) || list[0] || { year: EVENT_CONFIG.year, ...DEFAULT_EVENT_DRAFT })
      }
      setEventSaveMsg({ type: 'ok', text: `${year}年度のイベント設定を削除しました。` })
    } catch {
      setEventSaveMsg({ type: 'error', text: '削除に失敗しました。' })
    } finally {
      setDeletingYear(null)
    }
  }

  const handleDeleteEvent = (year: number) => {
    const ev = events.find((e) => e.year === year)
    if (ev?.is_active) {
      setEventSaveMsg({ type: 'error', text: '現在公開中のイベントは削除できません。先に別の年度を「公開中にする」に切り替えてから削除してください。' })
      return
    }
    setConfirmDialog({
      title: `${year}年度のイベントを削除`,
      message: '削除すると元に戻せません。\n（申込・アンケートの回答データ自体は削除されません）',
      requireText: String(year),
      danger: true,
      confirmLabel: '削除する',
      onConfirm: () => void performDeleteEvent(year),
    })
  }

  const performSwitchToExisting = async (year: number) => {
    setCreatingBatch(true)
    try {
      await setActiveEventYear(year)
      const list = await fetchAllEvents()
      setEvents(list)
      setSelectedYear(year)
      await handleYearChange(year)
      setEventSaveMsg({ type: 'ok', text: `${year}年を公開中のイベントに切り替えました！` })
    } catch {
      setEventSaveMsg({ type: 'error', text: '切り替えに失敗しました。' })
    } finally {
      setCreatingBatch(false)
    }
  }

  const handleCreateNewBatch = () => {
    if (!newEventYear) return
    const alreadyExists = events.some((e) => e.year === newEventYear)
    if (alreadyExists) {
      setConfirmDialog({
        title: '既存年度の公開切り替え',
        message: `${newEventYear}年のイベントは既に登録されています。設定を上書きせず、この年を公開中に切り替えますか？`,
        confirmLabel: '切り替える',
        onConfirm: () => void performSwitchToExisting(newEventYear),
      })
      return
    }
    void performCreateDraft(newEventYear)
  }

  const performCreateDraft = async (newEventYear: number) => {
    setCreatingBatch(true)
    try {
      await createOrUpdateEvent({
        year: newEventYear,
        ...DEFAULT_EVENT_DRAFT,
        date_display: `${newEventYear}年9月15日（火）`,
        is_active: false,
      })
      const list = await fetchAllEvents()
      setEvents(list)
      const draft = list.find((e) => e.year === newEventYear)
      if (draft) setEventForm(draft)
      setEventSaveMsg({
        type: 'ok',
        text: `📝 ${newEventYear}年度の下書きを作成しました。まだ公開されていません。下の「イベント設定の編集」で内容（開催日・場所・定員など）を確認・修正してから、「登録済みイベント一覧」の「この年を公開中にする」を押して公開してください。`,
      })
    } catch {
      setEventSaveMsg({ type: 'error', text: '新年度の下書き作成に失敗しました。' })
    } finally {
      setCreatingBatch(false)
    }
  }

  // ── Memories Management Actions ──
  const memoryYearOptions = useMemo(() => {
    const years = new Set<number>()
    events.forEach((e) => years.add(e.year))
    memories.forEach((m) => years.add(m.event_year))
    years.add(selectedMemoryYear)
    return [...years].sort((a, b) => b - a)
  }, [events, memories, selectedMemoryYear])

  const handleSelectMemoryYear = (year: number) => {
    setSelectedMemoryYear(year)
    const mem = memories.find(m => m.event_year === year)
    if (mem) {
      setMemoryForm({ ...mem, translations: mem.translations ?? {} })
    } else {
      setMemoryForm({
        event_year: year,
        badge: '昨年の記録',
        title: `${year}年の学内献血の様子`,
        summary: '',
        photos: [],
        source_label: 'ECC社会貢献センター 活動報告',
        source_link: '',
        translations: {},
        is_published: false,
      })
    }
    setActiveMemoryLang('ja')
    setMemoryFormFlash(true)
    window.setTimeout(() => setMemoryFormFlash(false), 900)
    memoryFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleAddMemoryYear = () => {
    if (!addMemoryYearInput) return
    handleSelectMemoryYear(addMemoryYearInput)
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploadingPhoto(true)
    try {
      const file = files[0]
      const url = await uploadEventPhoto(file)
      const currentPhotos = memoryForm.photos || []
      setMemoryForm({
        ...memoryForm,
        photos: [...currentPhotos, { url, caption: '' }],
      })
    } catch (err) {
      console.error(err)
      setMemorySaveMsg({ type: 'error', text: '写真のアップロードに失敗しました。' })
    } finally {
      setUploadingPhoto(false)
      e.target.value = ''
    }
  }

  const handleUpdateCaption = (index: number, caption: string) => {
    const photos = [...(memoryForm.photos || [])]
    photos[index] = { ...photos[index], caption }
    setMemoryForm({ ...memoryForm, photos })
  }

  // ── Ho tro nhap noi dung theo tung ngon ngu (badge/title/summary/
  // source_label/caption anh) — ban tieng Nhat van luu o cot chinh nhu cu,
  // cac ngon ngu khac luu trong memoryForm.translations[lang].
  type MemoryTextKey = 'badge' | 'title' | 'summary' | 'source_label'
  const getMemoryField = (key: MemoryTextKey): string => {
    if (activeMemoryLang === 'ja') return memoryForm[key] ?? ''
    return memoryForm.translations?.[activeMemoryLang]?.[key] ?? ''
  }
  const setMemoryField = (key: MemoryTextKey, value: string) => {
    if (activeMemoryLang === 'ja') {
      setMemoryForm({ ...memoryForm, [key]: value })
      return
    }
    const translations = { ...(memoryForm.translations ?? {}) }
    translations[activeMemoryLang] = { ...(translations[activeMemoryLang] ?? {}), [key]: value }
    setMemoryForm({ ...memoryForm, translations })
  }
  const getPhotoCaption = (photoUrl: string, jaCaption: string): string => {
    if (activeMemoryLang === 'ja') return jaCaption
    return memoryForm.translations?.[activeMemoryLang]?.photoCaptions?.[photoUrl] ?? ''
  }
  const setPhotoCaption = (index: number, photoUrl: string, value: string) => {
    if (activeMemoryLang === 'ja') {
      handleUpdateCaption(index, value)
      return
    }
    const translations = { ...(memoryForm.translations ?? {}) }
    const langEntry = { ...(translations[activeMemoryLang] ?? {}) }
    langEntry.photoCaptions = { ...(langEntry.photoCaptions ?? {}), [photoUrl]: value }
    translations[activeMemoryLang] = langEntry
    setMemoryForm({ ...memoryForm, translations })
  }
  const isMemoryLangFilled = (lang: string): boolean => {
    if (lang === 'ja') return !!(memoryForm.title || memoryForm.summary)
    const t = memoryForm.translations?.[lang]
    return !!(t?.title || t?.summary)
  }

  const handleDeletePhoto = (index: number) => {
    const photos = (memoryForm.photos || []).filter((_, i) => i !== index)
    setMemoryForm({ ...memoryForm, photos })
  }

  const handleSaveMemory = async (e: React.FormEvent) => {
    e.preventDefault()
    setMemorySaveMsg(null)
    setSavingMemory(true)
    try {
      await saveEventMemory({
        ...memoryForm,
        event_year: selectedMemoryYear,
      })
      const list = await fetchAllMemories()
      setMemories(list)
      setMemorySaveMsg({
        type: 'ok',
        text: memoryForm.is_published
          ? `${selectedMemoryYear}年の記録・写真を保存し、ユーザーサイトに公開しました！`
          : `${selectedMemoryYear}年の記録・写真を下書き保存しました（まだ非公開です）。`,
      })
    } catch (err) {
      console.error('handleSaveMemory failed:', err)
      setMemorySaveMsg({ type: 'error', text: '保存に失敗しました。（詳細はブラウザのコンソールを確認してください）' })
    } finally {
      setSavingMemory(false)
    }
  }

  const performDeleteMemory = async (year: number) => {
    setDeletingMemoryYear(year)
    try {
      await deleteEventMemory(year)
      const list = await fetchAllMemories()
      setMemories(list)
      handleSelectMemoryYear(year)
      setMemorySaveMsg({ type: 'ok', text: `${year}年度の記録を削除しました。` })
    } catch {
      setMemorySaveMsg({ type: 'error', text: '削除に失敗しました。' })
    } finally {
      setDeletingMemoryYear(null)
    }
  }

  const handleDeleteMemory = () => {
    const exists = memories.some((m) => m.event_year === selectedMemoryYear)
    if (!exists) {
      // Chưa lưu lần nào — chỉ cần bỏ form về mặc định, không cần gọi API
      handleSelectMemoryYear(selectedMemoryYear)
      return
    }
    setConfirmDialog({
      title: `${selectedMemoryYear}年度の記録を削除`,
      message: '削除すると元に戻せません。\n（アップロード済みの画像ファイル自体はストレージに残ります）',
      requireText: String(selectedMemoryYear),
      danger: true,
      confirmLabel: '削除する',
      onConfirm: () => void performDeleteMemory(selectedMemoryYear),
    })
  }

  // ── Form Field Settings Actions ──
  const getFieldDrafts = (formType: FormType) => (formType === 'registration' ? regFieldDrafts : surveyFieldDrafts)
  const setFieldDrafts = (formType: FormType, drafts: FieldDraft[]) => {
    if (formType === 'registration') setRegFieldDrafts(drafts)
    else setSurveyFieldDrafts(drafts)
  }

  const handleMoveField = (formType: FormType, index: number, dir: -1 | 1) => {
    const drafts = [...getFieldDrafts(formType)]
    const target = index + dir
    if (target < 0 || target >= drafts.length) return
    ;[drafts[index], drafts[target]] = [drafts[target], drafts[index]]
    setFieldDrafts(formType, drafts)
  }

  const handleUpdateField = (formType: FormType, key: string, patch: Partial<FieldDraft>) => {
    const drafts = getFieldDrafts(formType).map((d) => (d.key === key ? { ...d, ...patch } : d))
    setFieldDrafts(formType, drafts)
  }

  const handleSaveFieldSettings = async (formType: FormType) => {
    setFieldSaveMsg(null)
    setSavingFieldsFor(formType)
    try {
      const drafts = getFieldDrafts(formType)
      await Promise.all(
        drafts.map((d, i) =>
          saveFormFieldSetting({
            form_type: formType,
            field_key: d.key,
            label_override: d.label_override.trim() || null,
            is_visible: d.is_visible,
            is_required: d.is_required,
            sort_order: i,
          }),
        ),
      )
      setFieldSaveMsg({ type: 'ok', text: `${formType === 'registration' ? '申込フォーム' : 'アンケート'}の項目設定を保存しました！` })
    } catch {
      setFieldSaveMsg({ type: 'error', text: '保存に失敗しました。' })
    } finally {
      setSavingFieldsFor(null)
    }
  }

  // ── Exports ──
  const handleRegistrationsExport = () => {
    const data = registrationsToRows(registrations)
    downloadXLSX(data, `registrations_${selectedYear}.xlsx`, '申込データ')
  }

  const handleSurveyExport = () => {
    const data = surveysToRows(surveys)
    downloadXLSX(data, `surveys_${selectedYear}.xlsx`, 'アンケート')
  }

  // ── Aggregates for Charts & Slots ──
  const surveyCharts = useMemo(() => {
    const q1Counts = countBy(
      surveys.map((s) =>
        s.donation_count === 'once' ? 'ある（1回）' :
        s.donation_count === 'few' ? 'ある（2〜4回）' :
        s.donation_count === 'many' ? 'ある（5回以上）' :
        s.donation_count === 'none' ? 'ない' : '—',
      ),
    )
    const q2List: string[] = []
    const q3List: string[] = []
    const q4List: string[] = []
    const q5List: string[] = []
    const q6List: string[] = []
    const q7List: string[] = []

    for (const s of surveys) {
      const p = parseStructuredComment(s.comment)
      q2List.push(...p.impressionsList)
      q3List.push(...p.reasonsList)
      q4List.push(p.knewCampus)
      q5List.push(p.wantParticipate)
      q6List.push(...p.conditionsList)
      q7List.push(p.reservation)
    }

    return {
      q1: q1Counts,
      q2: countBy(q2List),
      q3: countBy(q3List),
      q4: countBy(q4List),
      q5: countBy(q5List),
      q6: countBy(q6List),
      q7: countBy(q7List),
    }
  }, [surveys])

  const slotBreakdown = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const r of registrations) {
      if (r.time_slot) counts[r.time_slot] = (counts[r.time_slot] ?? 0) + 1
    }
    return TIME_SLOTS.map((slot) => ({
      slot,
      registered: counts[slot] ?? 0,
      remaining: officialCapacities[slot] ?? Math.max(0, (eventForm.slot_capacity || 8) - (counts[slot] ?? 0)),
    }))
  }, [registrations, officialCapacities, eventForm.slot_capacity])

  const selectedSlotRegistrants = useMemo(
    () => (selectedSlot ? registrations.filter((r) => r.time_slot === selectedSlot) : []),
    [registrations, selectedSlot],
  )

  if (loading) {
    return (
      <div className="app-shell">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          読み込み中...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="app-shell admin-shell" ref={rootRef}>
        <SiteHeader isAdmin />
        <main className="admin-page">
          <section className="admin-login-section">
            <form className="admin-login-form panel motion-card" onSubmit={handleLogin}>
              <Icon type="monitor" />
              <h1>管理者ログイン</h1>
              <p>先生専用の管理画面です。</p>
              <label>
                メールアドレス
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </label>
              <label>
                パスワード
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </label>
              {loginError && <p className="error-message">{loginError}</p>}
              <button className="button primary wide" type="submit" disabled={loginSubmitting}>
                {loginSubmitting ? 'ログイン中...' : 'ログイン'}
              </button>
            </form>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="app-shell admin-shell" ref={rootRef}>
      <SiteHeader isAdmin />
      {toast && (
        <div className={`admin-toast ${toast.type}`} role="status">
          {toast.text}
        </div>
      )}
      <main className="admin-page">
        <section className="admin-hero">
          <div>
            <Icon type="monitor" />
            <h1>管理ダッシュボード</h1>
            <p>卒業後も先生だけで運用継続できるよう、イベント設定・写真更新・データ出力がここで行えます。</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link className="button secondary" to="/">ユーザーサイトへ戻る</Link>
            <button className="button outline" type="button" onClick={handleLogout}>ログアウト</button>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="admin-tabs" role="tablist" aria-label="管理メニュー">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'registrations'}
            className={`admin-tab ${activeTab === 'registrations' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('registrations')}
          >
            <Icon type="chart" />
            申込・アンケート管理
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'events'}
            className={`admin-tab ${activeTab === 'events' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <Icon type="calendar" />
            新年度・イベント設定
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'memories'}
            className={`admin-tab ${activeTab === 'memories' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('memories')}
          >
            <Icon type="book" />
            活動記録・アルバム（写真・記事編集）
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'formFields'}
            className={`admin-tab ${activeTab === 'formFields' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('formFields')}
          >
            <Icon type="alert" />
            申込・アンケート項目設定
          </button>
        </div>

        {/* TAB 1: REGISTRATIONS & SURVEYS */}
        {activeTab === 'registrations' && (
          <>
            {/* Year Selector for historical data */}
            <div className="admin-year-bar">
              <span className="admin-year-bar-label">表示年度を選択:</span>
              <div className="admin-year-pills">
                {(events.length > 0 ? events.map(e => e.year) : [EVENT_CONFIG.year]).map((yr) => {
                  const isAct = events.find(e => e.year === yr)?.is_active
                  return (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => handleYearChange(yr)}
                      className={`admin-year-pill ${yr === selectedYear ? 'is-active' : ''}`}
                    >
                      {yr}年度 {isAct ? '★現在開催中' : ''}
                    </button>
                  )
                })}
              </div>
            </div>

            <section className="admin-metrics reveal">
              <article className="motion-card">
                <span>申込数（{selectedYear}年）</span>
                <strong>{registrations.length}</strong>
                <small>定員{eventForm.capacity || 50}名まであと{Math.max(0, (eventForm.capacity || 50) - registrations.length)}名</small>
              </article>
              <article className="motion-card">
                <span>アンケート回答数</span>
                <strong>{surveys.length}</strong>
                <small>申込者のうち回答した人数</small>
              </article>
              <article className="motion-card">
                <span>選択中年度</span>
                <strong>{selectedYear}</strong>
                <small>{events.find(e => e.year === selectedYear)?.is_active ? '進行中イベント' : '過去のアーカイブ'}</small>
              </article>
            </section>

            {/* Official Slot Capacity Editor */}
            <section className="admin-page-panel reveal" style={{ marginTop: '2rem' }}>
              <div className="admin-panel-header">
                <div className="section-title">
                  <Icon type="shield" />
                  <h2>赤十字社 空き枠数の調整（{selectedYear}年）</h2>
                </div>
                <button
                  className="button primary"
                  type="button"
                  onClick={handleCapacitySave}
                  disabled={capacitySaving}
                >
                  {capacitySaving ? '保存中...' : '空き枠数を保存'}
                </button>
              </div>
              <p style={{ margin: '0 0 1rem', color: 'var(--muted)', fontSize: '0.875rem' }}>
                日本赤十字社から通知された空き枠数を入力すると、ユーザー画面の「残り○名」に即時反映されます。
              </p>
              <Banner msg={capacityMsg} />
              <div className="slot-capacity-grid">
                {TIME_SLOTS.map((slot) => (
                  <div key={slot} className="slot-capacity-card">
                    <div className="slot-capacity-card-label">{slot.replace('-', '～')}</div>
                    <div className="slot-capacity-card-row">
                      <span>空き:</span>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={officialCapacities[slot] ?? ''}
                        placeholder="自動"
                        onChange={(e) => {
                          const val = e.target.value === '' ? undefined : parseInt(e.target.value, 10)
                          setOfficialCapacities(prev => {
                            const next = { ...prev }
                            if (val === undefined || isNaN(val)) delete next[slot]
                            else next[slot] = val
                            return next
                          })
                        }}
                        className="slot-capacity-input"
                      />
                      <span>名</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Registrations table */}
            <section className="admin-preview admin-page-panel reveal" style={{ marginTop: '2rem' }}>
              <div className="admin-panel-header">
                <div className="section-title">
                  <Icon type="book" />
                  <h2>参加申込一覧（{selectedYear}年 / {registrations.length}名）</h2>
                </div>
                <button
                  className="button outline"
                  type="button"
                  onClick={handleRegistrationsExport}
                  disabled={registrations.length === 0}
                >
                  Excelエクスポート
                </button>
              </div>

              {/* Slot Filter Buttons */}
              <div className="admin-slot-filters">
                <button
                  type="button"
                  onClick={() => setSelectedSlot(null)}
                  className={`admin-slot-filter-btn ${selectedSlot === null ? 'is-active' : ''}`}
                >
                  すべて ({registrations.length})
                </button>
                {slotBreakdown.map(b => (
                  <button
                    key={b.slot}
                    type="button"
                    onClick={() => setSelectedSlot(b.slot)}
                    className={`admin-slot-filter-btn ${selectedSlot === b.slot ? 'is-active' : ''}`}
                  >
                    {b.slot.replace('-', '～')} ({b.registered})
                  </button>
                ))}
              </div>

              <div className="admin-content">
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>学生番号</th>
                        <th>名前</th>
                        <th>フリガナ</th>
                        <th>学校</th>
                        <th>クラス</th>
                        <th>メール</th>
                        <th>電話</th>
                        <th>生年月日</th>
                        <th>性別</th>
                        <th>希望時間</th>
                        <th>献血経験</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedSlot ? selectedSlotRegistrants : registrations).length === 0 ? (
                        <tr>
                          <td colSpan={11} style={{ textAlign: 'center', padding: '2rem' }}>
                            申込データがありません
                          </td>
                        </tr>
                      ) : (
                        (selectedSlot ? selectedSlotRegistrants : registrations).map((row) => (
                          <tr key={row.id}>
                            <td>{row.student_id}</td>
                            <td>{row.name}</td>
                            <td>{row.furigana ?? '—'}</td>
                            <td>{row.school ?? '—'}</td>
                            <td>{row.class}</td>
                            <td>{row.email ?? '—'}</td>
                            <td>{row.phone ?? '—'}</td>
                            <td>{row.birth_date ?? '—'}</td>
                            <td>{row.gender ?? '—'}</td>
                            <td>{row.time_slot?.replace('-', '～') ?? '—'}</td>
                            <td>{row.donation_experience === 'yes' ? 'ある' : row.donation_experience === 'no' ? 'ない' : '—'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Surveys */}
            <section className="admin-preview admin-page-panel reveal" style={{ marginTop: '2rem' }}>
              <div className="admin-panel-header">
                <div className="section-title">
                  <Icon type="book" />
                  <h2>アンケート回答データ（{selectedYear}年 / {surveys.length}件）</h2>
                </div>
                <button
                  className="button outline"
                  type="button"
                  onClick={handleSurveyExport}
                  disabled={surveys.length === 0}
                >
                  Excelエクスポート
                </button>
              </div>
              <div className="chart-grid">
                <BarChart title="Q1. 献血経験" data={surveyCharts.q1} />
                <BarChart title="Q2. 印象（複数回答）" data={surveyCharts.q2} />
                {surveyCharts.q3.length > 0 && <BarChart title="Q3. 未経験の理由（複数回答）" data={surveyCharts.q3} />}
                <BarChart title="Q4. 学内献血を知っていたか" data={surveyCharts.q4} />
                <BarChart title="Q5. 参加意向" data={surveyCharts.q5} />
                <BarChart title="Q6. 参加しやすくなる条件（複数回答）" data={surveyCharts.q6} />
                <BarChart title="Q7. 事前予約について" data={surveyCharts.q7} />
              </div>
              <div className="admin-content" style={{ marginTop: '1.5rem' }}>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>回答日時</th>
                        <th>献血経験</th>
                        <th>印象</th>
                        <th>印象その他</th>
                        <th>未経験の理由</th>
                        <th>未経験理由その他</th>
                        <th>学内献血を知っていたか</th>
                        <th>参加意向</th>
                        <th>参加しやすくなる条件</th>
                        <th>条件その他</th>
                        <th>事前予約</th>
                      </tr>
                    </thead>
                    <tbody>
                      {surveys.length === 0 ? (
                        <tr>
                          <td colSpan={11} style={{ textAlign: 'center', padding: '2rem' }}>
                            アンケート回答データがありません
                          </td>
                        </tr>
                      ) : (
                        surveys.map((row) => {
                          const parsed = parseStructuredComment(row.comment)
                          const countLabel = row.donation_count === 'once' ? 'ある（1回）' :
                                             row.donation_count === 'few' ? 'ある（2〜4回）' :
                                             row.donation_count === 'many' ? 'ある（5回以上）' :
                                             row.donation_count === 'none' ? 'ない' : row.donation_count ?? '—';
                          return (
                            <tr key={row.id}>
                              <td>{new Date(row.created_at).toLocaleString('ja-JP')}</td>
                              <td>{countLabel}</td>
                              <td>{parsed.impressions}</td>
                              <td>{parsed.impressionsOther}</td>
                              <td>{parsed.reasons}</td>
                              <td>{parsed.reasonsOther}</td>
                              <td>{parsed.knewCampus}</td>
                              <td>{parsed.wantParticipate}</td>
                              <td>{parsed.conditions}</td>
                              <td>{parsed.conditionsOther}</td>
                              <td>{parsed.reservation}</td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        )}

        {/* TAB 2: EVENT SETTINGS & NEW BATCH */}
        {activeTab === 'events' && (
          <div className="reveal">
            <Banner msg={eventSaveMsg} />

            {/* Quick action: Khởi tạo đợt mới */}
            <div className="admin-quick-create">
              <h3>✨ 新年度イベントの下書き作成</h3>
              <p>
                新しい年度の献血イベントを開催する準備として、ここで下書きを作成できます。<strong>作成しただけではまだ公開されません。</strong>下の「イベント設定の編集」で開催日・場所・定員などの内容を確認・修正してから、「登録済みイベント一覧」の「この年を公開中にする」を押すと初めて公開され、参加者の木が0からリセットされます（前年度までのデータはアーカイブとして自動保存されます）。
              </p>
              <div className="admin-quick-create-controls">
                <input
                  type="number"
                  value={newEventYear}
                  onChange={(e) => setNewEventYear(e.target.value === '' ? 0 : parseInt(e.target.value, 10))}
                  className="admin-quick-create-input"
                />
                <span style={{ fontWeight: 600 }}>年度</span>
                <button
                  type="button"
                  className="button primary"
                  onClick={handleCreateNewBatch}
                  disabled={creatingBatch}
                >
                  {creatingBatch ? '処理中...' : 'この年度の下書きを作成する'}
                </button>
              </div>
            </div>

            {/* Existing Events List */}
            <div className="admin-card-panel">
              <h3>登録済みイベント一覧</h3>
              <div className="admin-event-list">
                {events.map((ev) => (
                  <div key={ev.year} className="admin-event-row">
                    <div className="admin-event-row-info">
                      <strong>{ev.year}年度</strong> — {ev.title} ({ev.date_display})
                      {ev.is_active && (
                        <span className="admin-active-badge">現在公開中（Active）</span>
                      )}
                      {ev.is_active && ev.show_pending_notice && (
                        <span className="admin-active-badge" style={{ background: '#b45309' }}>準備中バナー表示中</span>
                      )}
                    </div>
                    <div className="admin-event-row-actions">
                      {!ev.is_active && (
                        <button
                          type="button"
                          className="button outline"
                          onClick={() => handleActivateEvent(ev.year)}
                          disabled={activatingYear === ev.year}
                        >
                          {activatingYear === ev.year ? '切替中...' : 'この年を公開中にする'}
                        </button>
                      )}
                      <button
                        type="button"
                        className="button secondary"
                        onClick={() => handleEditEvent(ev)}
                      >
                        編集
                      </button>
                      <button
                        type="button"
                        className="button outline admin-danger-btn"
                        onClick={() => handleDeleteEvent(ev.year)}
                        disabled={ev.is_active || deletingYear === ev.year}
                        title={ev.is_active ? '公開中のイベントは削除できません' : '削除'}
                      >
                        {deletingYear === ev.year ? '削除中...' : '削除'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Form Editor */}
            <form
              onSubmit={handleSaveEventSettings}
              ref={eventFormRef}
              className={`admin-card-panel ${eventFormFlash ? 'is-flash' : ''}`}
            >
              <h3>イベント設定の編集（{eventForm.year}年度）</h3>
              <div className="admin-form-grid">
                <label>
                  開催日表示
                  <input
                    type="text"
                    value={eventForm.date_display || ''}
                    onChange={(e) => setEventForm({ ...eventForm, date_display: e.target.value })}
                    required
                  />
                </label>
                <label>
                  開催時間表示
                  <input
                    type="text"
                    value={eventForm.time_display || ''}
                    onChange={(e) => setEventForm({ ...eventForm, time_display: e.target.value })}
                    required
                  />
                </label>
                <label>
                  開催場所
                  <input
                    type="text"
                    value={eventForm.location || ''}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    required
                  />
                </label>
                <label>
                  場所の詳細
                  <input
                    type="text"
                    value={eventForm.location_detail || ''}
                    onChange={(e) => setEventForm({ ...eventForm, location_detail: e.target.value })}
                    required
                  />
                </label>
                <label>
                  全体の目標定員（人）
                  <input
                    type="number"
                    value={eventForm.capacity || 50}
                    onChange={(e) => setEventForm({ ...eventForm, capacity: parseInt(e.target.value, 10) })}
                    required
                  />
                </label>
                <label>
                  1枠あたりの定員（人）
                  <input
                    type="number"
                    value={eventForm.slot_capacity || 8}
                    onChange={(e) => setEventForm({ ...eventForm, slot_capacity: parseInt(e.target.value, 10) })}
                    required
                  />
                </label>
                <label className="span-2">
                  協賛・主催団体
                  <input
                    type="text"
                    value={eventForm.sponsor || ''}
                    onChange={(e) => setEventForm({ ...eventForm, sponsor: e.target.value })}
                    required
                  />
                </label>
                <label className="span-2">
                  ご予約についての案内文
                  <textarea
                    rows={2}
                    value={eventForm.reservation_note || ''}
                    onChange={(e) => setEventForm({ ...eventForm, reservation_note: e.target.value })}
                  />
                </label>
                <label className="span-2">
                  プレゼント・記念品の案内文
                  <textarea
                    rows={2}
                    value={eventForm.gift_note || ''}
                    onChange={(e) => setEventForm({ ...eventForm, gift_note: e.target.value })}
                  />
                </label>
              </div>

              <label className="admin-publish-toggle">
                <input
                  type="checkbox"
                  checked={eventForm.show_pending_notice ?? false}
                  onChange={(e) => setEventForm({ ...eventForm, show_pending_notice: e.target.checked })}
                />
                この年の情報はまだ確定していません（ユーザーサイトに「準備中」バナーを表示し、上記の詳細は一時的に隠します）
              </label>

              <div style={{ marginTop: '1.5rem' }}>
                <button type="submit" className="button primary" disabled={savingEvent}>
                  {savingEvent ? '保存中...' : `${eventForm.year}年度の設定を保存`}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: MEMORIES & PHOTO UPLOAD */}
        {activeTab === 'memories' && (
          <div className="reveal">
            <Banner msg={memorySaveMsg} />

            {/* Year selector for memories */}
            <div className="admin-year-bar">
              <span className="admin-year-bar-label">編集する年度:</span>
              <div className="admin-year-pills">
                {memoryYearOptions.map((yr) => {
                  const isPublished = memories.find((m) => m.event_year === yr)?.is_published
                  return (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => handleSelectMemoryYear(yr)}
                      className={`admin-year-pill ${yr === selectedMemoryYear ? 'is-active' : ''}`}
                    >
                      {yr}年 {isPublished ? '' : '（非公開）'}
                    </button>
                  )
                })}
              </div>
              <div className="admin-quick-create-controls" style={{ marginLeft: 'auto' }}>
                <input
                  type="number"
                  value={addMemoryYearInput}
                  onChange={(e) => setAddMemoryYearInput(e.target.value === '' ? 0 : parseInt(e.target.value, 10))}
                  className="admin-quick-create-input"
                  style={{ width: '100px' }}
                />
                <button type="button" className="button outline" onClick={handleAddMemoryYear}>
                  ＋ この年を追加
                </button>
              </div>
            </div>

            <form
              onSubmit={handleSaveMemory}
              ref={memoryFormRef}
              className={`admin-card-panel ${memoryFormFlash ? 'is-flash' : ''}`}
            >
              <h3>活動記録・アルバムの編集（{selectedMemoryYear}年度）</h3>

              <div className="admin-lang-tabs" role="tablist" aria-label="編集する言語">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    role="tab"
                    aria-selected={activeMemoryLang === l.code}
                    className={`admin-lang-tab ${activeMemoryLang === l.code ? 'is-active' : ''}`}
                    onClick={() => setActiveMemoryLang(l.code)}
                  >
                    {ADMIN_LANG_LABELS[l.code] ?? l.label}
                    {isMemoryLangFilled(l.code) && <span className="admin-lang-tab-dot" aria-hidden="true" />}
                  </button>
                ))}
              </div>

              {activeMemoryLang !== 'ja' && (
                <p className="admin-lang-hint">
                  💡 上の「日本語」タブの内容を Gemini・Claude・ChatGPT などのAIツールに貼り付けて翻訳してもらい、その結果をこのタブの各欄に貼り付けてください。空欄のままの場合、ユーザーサイトには日本語の内容がそのまま表示されます。
                </p>
              )}

              <div className="admin-form-grid">
                <label>
                  バッジテキスト
                  <input
                    type="text"
                    value={getMemoryField('badge')}
                    onChange={(e) => setMemoryField('badge', e.target.value)}
                  />
                </label>
                <label className="span-2">
                  見出しタイトル
                  <input
                    type="text"
                    value={getMemoryField('title')}
                    onChange={(e) => setMemoryField('title', e.target.value)}
                    title={getMemoryField('title')}
                  />
                </label>
                <label className="span-2">
                  概要・説明文
                  <textarea
                    rows={3}
                    value={getMemoryField('summary')}
                    onChange={(e) => setMemoryField('summary', e.target.value)}
                    placeholder={activeMemoryLang === 'ja' ? `例: ${selectedMemoryYear}年9月、ECCコンピュータ専門学校にて開催された学内献血の様子です。学生・教職員の皆さんにご協力いただきました。` : ''}
                  />
                </label>
                <label className="span-2">
                  出典リンクの表示テキスト
                  <input
                    type="text"
                    value={getMemoryField('source_label')}
                    onChange={(e) => setMemoryField('source_label', e.target.value)}
                    title={getMemoryField('source_label')}
                  />
                </label>
                {activeMemoryLang === 'ja' ? (
                  <label>
                    出典リンク（URL）
                    <input
                      type="url"
                      value={memoryForm.source_link || ''}
                      onChange={(e) => setMemoryForm({ ...memoryForm, source_link: e.target.value })}
                    />
                  </label>
                ) : (
                  <p className="admin-lang-note">
                    ※ 出典リンクのURLは全言語共通のため、「日本語」タブでのみ編集できます。
                  </p>
                )}
              </div>

              <label className="admin-publish-toggle">
                <input
                  type="checkbox"
                  checked={memoryForm.is_published ?? false}
                  onChange={(e) => setMemoryForm({ ...memoryForm, is_published: e.target.checked })}
                />
                この年の記録をユーザーサイトに公開する（チェックを外すと下書きのまま非公開になります）
              </label>

              {/* Photo Upload Section */}
              <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                <div className="admin-photo-toolbar">
                  <h4 style={{ margin: 0 }}>写真ギャラリー（現在 {(memoryForm.photos || []).length} 枚）</h4>
                  <label className="button primary" style={{ cursor: 'pointer', margin: 0 }}>
                    {uploadingPhoto ? 'アップロード中...' : '＋ 写真を追加する'}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                    />
                  </label>
                </div>

                {(memoryForm.photos || []).length === 0 && (
                  <div className="admin-photo-empty">
                    <Icon type="camera" />
                    <p>写真がまだ登録されていません。上の「＋ 写真を追加する」ボタンから追加してください。</p>
                  </div>
                )}

                <div className="admin-photo-grid">
                  {(memoryForm.photos || []).map((p, idx) => (
                    <div key={idx} className="admin-photo-card">
                      <img src={resolveLegacyPhotoUrl(p.url)} alt="memory" />
                      <input
                        type="text"
                        placeholder={activeMemoryLang === 'ja' ? 'キャプション（説明）' : `キャプション（${ADMIN_LANG_LABELS[activeMemoryLang] ?? activeMemoryLang}）`}
                        value={getPhotoCaption(p.url, p.caption)}
                        onChange={(e) => setPhotoCaption(idx, p.url, e.target.value)}
                        title={getPhotoCaption(p.url, p.caption)}
                        className="admin-photo-caption-input"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(idx)}
                        className="admin-photo-delete-btn"
                      >
                        削除
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button type="submit" className="button primary" disabled={savingMemory}>
                  {savingMemory
                    ? '保存中...'
                    : memoryForm.is_published
                      ? `${selectedMemoryYear}年の記録を保存・公開`
                      : `${selectedMemoryYear}年の記録を下書き保存`}
                </button>
                <button
                  type="button"
                  className="button outline admin-danger-btn"
                  onClick={handleDeleteMemory}
                  disabled={deletingMemoryYear === selectedMemoryYear}
                >
                  {deletingMemoryYear === selectedMemoryYear ? '削除中...' : `${selectedMemoryYear}年の記録を削除`}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: FORM FIELD SETTINGS */}
        {activeTab === 'formFields' && (
          <div className="reveal">
            <Banner msg={fieldSaveMsg} />
            <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
              申込フォーム・アンケートの各項目を表示／非表示、表示ラベル、必須／任意、並び順を自由に調整できます（項目の種類自体は追加できません）。ロックされた項目はデータ保存に必須のため変更できません。
            </p>
            <FieldSettingsEditor
              title="📋 参加申込フォームの項目"
              hint="ユーザーサイトの「献血申し込」フォームに表示される項目です。"
              drafts={regFieldDrafts}
              onMove={(i, dir) => handleMoveField('registration', i, dir)}
              onUpdate={(key, patch) => handleUpdateField('registration', key, patch)}
              onSave={() => handleSaveFieldSettings('registration')}
              saving={savingFieldsFor === 'registration'}
            />
            <FieldSettingsEditor
              title="💬 アンケートフォームの項目"
              hint="ユーザーサイトの「学内献血アンケート」に表示される質問です。"
              drafts={surveyFieldDrafts}
              onMove={(i, dir) => handleMoveField('survey', i, dir)}
              onUpdate={(key, patch) => handleUpdateField('survey', key, patch)}
              onSave={() => handleSaveFieldSettings('survey')}
              saving={savingFieldsFor === 'survey'}
            />
          </div>
        )}
      </main>

      {confirmDialog && (
        <div className="admin-modal-overlay" onClick={closeConfirmDialog}>
          <div
            className="admin-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="admin-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="admin-modal-title" className={confirmDialog.danger ? 'is-danger' : ''}>
              {confirmDialog.danger && <Icon type="alert" />}
              {confirmDialog.title}
            </h3>
            <p>{confirmDialog.message}</p>
            {confirmDialog.requireText && (
              <input
                type="text"
                autoFocus
                className="admin-modal-input"
                placeholder={`半角数字で「${confirmDialog.requireText}」と入力`}
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
              />
            )}
            <div className="admin-modal-actions">
              <button type="button" className="button outline" onClick={closeConfirmDialog}>
                キャンセル
              </button>
              <button
                type="button"
                className={`button ${confirmDialog.danger ? 'admin-modal-danger-btn' : 'primary'}`}
                disabled={!!confirmDialog.requireText && confirmInput.trim() !== confirmDialog.requireText}
                onClick={() => {
                  const fn = confirmDialog.onConfirm
                  closeConfirmDialog()
                  fn()
                }}
              >
                {confirmDialog.confirmLabel ?? 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
