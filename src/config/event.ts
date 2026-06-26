export const EVENT_CONFIG = {
  year: 2026,
  title: '献血ボランティアイベント',
  date: '2026年9月5日（土）',
  time: '10:00 - 16:00',
  location: 'Campus Care Hall',
  locationDetail: '1号館 1F 学生ホール',
  capacity: 50,
  organizer: 'Campus Care Project',
  contact: 'campus-care@example.ac.jp',
  targetDate: new Date('2026-09-05T10:00:00+09:00'),
} as const

export type EventConfig = typeof EVENT_CONFIG
