export const EVENT_CONFIG = {
  year: 2026,
  title: "献血ボランティア活動",
  date: "2026年9月15日（火）",
  time: "9:30〜11:30 / 12:30〜16:30",
  location: "ECCコンピュータ専門学校",
  locationDetail: "1号館 1階ラウンジ",
  capacity: 50,
  slotCapacity: 8,
  sponsor: "大阪曾根崎ライオンズクラブ / 大阪西ライオンズクラブ",
  reservationNote: "ご予約をいただくと献血にかかる手続きの時間が短くなります",
  giftNote: "献血にご協力いただいた方に、ライオンズクラブ様よりささやかなプレゼントをご用意しています",
  appLinks: {
    appStore: "https://apps.apple.com/jp/app/%E7%8C%AE%E8%A1%80web%E4%BC%9A%E5%93%A1%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9-%E3%83%A9%E3%83%96%E3%83%A9%E3%83%83%E3%83%89/id1629819569",
    googlePlay: "https://play.google.com/store/apps/details?id=jp.kenketsu.blood_donation_card",
  },
  organizer: "ECC社会貢献センター",
  contact: "ecc-shakai@example.ac.jp",
  targetDate: new Date("2026-09-15T10:00:00+09:00"),
} as const

export const TIME_SLOTS = [
  '9:30-10:00', '10:00-10:30', '10:30-11:00', '11:00-11:30',
  '12:30-13:00', '13:00-13:30', '13:30-14:00', '14:00-14:30',
  '14:30-15:00', '15:00-15:30', '15:30-16:00', '16:00-16:30',
] as const

export type EventConfig = typeof EVENT_CONFIG
