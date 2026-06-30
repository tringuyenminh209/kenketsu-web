import { useEffect, useRef, useState, type RefObject } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import logoMark from '../assets/campus-care-mark.svg'
import i18n from './i18n'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export const LANGS = [
  { code: 'ja', label: '日本語' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'en', label: 'English' },
  { code: 'my', label: 'မြန်မာ' },
  { code: 'ne', label: 'नेपाली' },
  { code: 'zh', label: '中文' },
]

export function LanguageSelect() {
  const [open, setOpen] = useState(false)
  const [lang, setLang] = useState(i18n.language?.slice(0, 2) || 'ja')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onMouse = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onMouse)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onMouse)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const select = (code: string) => {
    setLang(code)
    void i18n.changeLanguage(code)
    setOpen(false)
  }

  const currentLabel = LANGS.find((l) => l.code === lang)?.label ?? '日本語'

  return (
    <div className="lang-select" ref={ref}>
      <button
        className="lang-select-btn"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        type="button"
      >
        <svg className="lang-globe" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3.6 9h16.8M3.6 15h16.8M12 3c2.2 2.3 3.4 5.3 3.4 9s-1.2 6.7-3.4 9M12 3C9.8 5.3 8.6 8.3 8.6 12s1.2 6.7 3.4 9" />
        </svg>
        <span className="lang-label">{currentLabel}</span>
        <svg
          className="lang-chevron"
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{ transform: open ? 'rotate(180deg)' : undefined }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul className="lang-panel" role="listbox" aria-label="言語選択">
          {LANGS.map((l) => (
            <li
              key={l.code}
              role="option"
              aria-selected={l.code === lang}
              className={`lang-opt${l.code === lang ? ' is-active' : ''}`}
              onClick={() => select(l.code)}
            >
              {l.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export type IconType =
  | 'heart'
  | 'shield'
  | 'users'
  | 'calendar'
  | 'alert'
  | 'monitor'
  | 'book'
  | 'spark'
  | 'chart'
  | 'globe'

export function Icon({ type }: { type: IconType }) {
  const paths: Record<IconType, string> = {
    heart: 'M20.8 4.6c-1.9-1.9-5-1.8-6.8.3L12 7.1 10 4.9C8.2 2.8 5.1 2.7 3.2 4.6c-2.1 2.1-2.1 5.5 0 7.6L12 21l8.8-8.8c2.1-2.1 2.1-5.5 0-7.6Z',
    shield: 'M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Zm-3 9 2 2 4-5',
    users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
    calendar: 'M7 2v4M17 2v4M3 9h18M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
    alert: 'M12 3 22 20H2L12 3Zm0 6v5m0 3h.01',
    monitor: 'M3 4h18v12H3V4Zm7 17h4m-6 0h8',
    book: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Zm0 0V21m4-14h8m-8 4h8',
    spark: 'M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Zm7 13 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z',
    chart: 'M4 19V5m0 14h16M8 16v-5m4 5V8m4 8v-7',
    globe: 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2ZM2 12h20M12 2c-2.76 0-5 4.48-5 10s2.24 10 5 10 5-4.48 5-10S14.76 2 12 2Z',
  }
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[type]} />
    </svg>
  )
}

export function SiteHeader({ isAdmin = false }: { isAdmin?: boolean }) {
  const { t } = useTranslation()
  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Campus Care top">
        <img className="brand-mark" src={logoMark} alt="" />
        <span>
          <strong>Campus Care</strong>
          <small>{t('hero.eventLabel')}</small>
        </span>
      </Link>
      <nav className="nav-links" aria-label={t('nav.ariaLabel')}>
        {isAdmin ? (
          <>
            <NavLink to="/">{t('nav.userSite')}</NavLink>
            <NavLink to="/admin">{t('nav.admin')}</NavLink>
          </>
        ) : (
          <>
            <a href="#knowledge">{t('nav.know')}</a>
            <a href="#benefits">{t('nav.benefits')}</a>
            <a href="#info">{t('nav.info')}</a>
            <a href="#register">{t('nav.register')}</a>
            <a href="#survey">{t('nav.survey')}</a>
          </>
        )}
      </nav>
      <LanguageSelect />
    </header>
  )
}

export function usePageMotion(rootRef: RefObject<HTMLDivElement | null>) {
  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reduceMotion) {
        gsap.set('.reveal, .motion-card, .hero-copy > *, .hero-media', { clearProps: 'all' })
        return
      }

      gsap.from('.site-header', { y: -24, autoAlpha: 0, duration: 0.7, ease: 'power3.out' })

      if (document.querySelector('.hero-copy')) {
        gsap.from('.hero-copy > *', { y: 34, autoAlpha: 0, duration: 0.9, stagger: 0.09, ease: 'power3.out' })
      }

      if (document.querySelector('.hero-media img')) {
        gsap.fromTo(
          '.hero-media img',
          { scale: 1.06, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 1.15, ease: 'power3.out' },
        )
        gsap.to('.hero-media img', {
          scale: 1.035,
          yPercent: -3,
          ease: 'none',
          scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 0.6 },
        })
      }

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => {
        gsap.from(element, {
          y: 42, autoAlpha: 0, duration: 0.75, ease: 'power3.out', immediateRender: false,
          scrollTrigger: { trigger: element, start: 'top 82%', toggleActions: 'play none none none', once: true },
        })
      })

      gsap.utils.toArray<HTMLElement>('.motion-card').forEach((card) => {
        gsap.from(card, {
          y: 24, autoAlpha: 0, scale: 0.98, duration: 0.65, ease: 'power2.out', immediateRender: false,
          scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none', once: true },
        })
      })
    },
    { scope: rootRef },
  )
}
