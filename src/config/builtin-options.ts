// Lua chon co dinh cua cac cau hoi co san. `code` la gia tri luu vao DB va dung
// de thong ke nen khong bao gio doi; admin chi sua duoc chu hien thi.
export interface BuiltinOptionDef {
  code: string
  i18nKey: string
}

const fromKeys = (prefix: string, codes: string[]): BuiltinOptionDef[] =>
  codes.map((code) => ({ code, i18nKey: `${prefix}${code}` }))

export const BUILTIN_OPTIONS: Record<string, BuiltinOptionDef[]> = {
  donationExperience: [
    { code: 'yes', i18nKey: 'register.donationExperienceYes' },
    { code: 'no', i18nKey: 'register.donationExperienceNo' },
  ],
  gender: [
    { code: 'male', i18nKey: 'register.genderMale' },
    { code: 'female', i18nKey: 'register.genderFemale' },
    { code: 'other', i18nKey: 'register.genderOther' },
    { code: 'no_answer', i18nKey: 'register.genderNoAnswer' },
  ],
  donationCount: [
    { code: 'once', i18nKey: 'survey.q1Once' },
    { code: 'few', i18nKey: 'survey.q1Few' },
    { code: 'many', i18nKey: 'survey.q1Many' },
    { code: 'none', i18nKey: 'survey.q1None' },
  ],
  impressions: fromKeys('survey.q2_', ['help_others', 'social_contribution', 'health_check', 'scary', 'time_consuming', 'dont_understand', 'not_interested', 'other']),
  reasons: fromKeys('survey.q3_', ['no_opportunity', 'afraid_needle', 'anxious', 'no_time', 'dont_know_conditions', 'health_reason', 'not_interested', 'other']),
  knewCampus: [
    { code: 'knew', i18nKey: 'survey.q4Knew' },
    { code: 'first_time', i18nKey: 'survey.q4FirstTime' },
  ],
  wantParticipate: [
    { code: 'yes', i18nKey: 'survey.q5Yes' },
    { code: 'maybe', i18nKey: 'survey.q5Maybe' },
    { code: 'unsure', i18nKey: 'survey.q5Unsure' },
    { code: 'no', i18nKey: 'survey.q5No' },
  ],
  conditions: fromKeys('survey.q6_', ['easy_reservation', 'flexible_time', 'short_duration', 'clear_process', 'with_friend', 'detailed_explanation', 'other']),
  reservation: [
    { code: 'now', i18nKey: 'survey.q7Now' },
    { code: 'later', i18nKey: 'survey.q7Later' },
    { code: 'no', i18nKey: 'survey.q7No' },
  ],
}
