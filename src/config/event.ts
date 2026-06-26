export const EVENT_CONFIG = {
  year: 2026,
  title: "献血ボランティア活動",
  date: "2026年9月15日（月）",
  time: "10:00 〜 16:00",
  location: "山口学園 ECC専門学校",
  locationDetail: "1号館 1Fロビー",
  capacity: 50,
  organizer: "ECC社会貢献センター",
  contact: "ecc-shakai@example.ac.jp",
  targetDate: new Date("2026-09-15T10:00:00+09:00"),
} as const

export type EventConfig = typeof EVENT_CONFIG
