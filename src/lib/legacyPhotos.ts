import img101 from '../assets/last-year/lastyear-101.webp'
import img102 from '../assets/last-year/lastyear-102.webp'
import img201 from '../assets/last-year/lastyear-201.webp'
import img202 from '../assets/last-year/lastyear-202.webp'
import img203 from '../assets/last-year/lastyear-203.webp'
import img204 from '../assets/last-year/lastyear-204.webp'

// Anh ky niem nam 2025 duoc seed san trong DB (migration 010) tro toi duong dan
// tinh "/assets/last-year/lastyear-10x.webp" — duong dan nay khong ton tai thuc
// su tren server (khong co public/assets/), vi anh duoc Vite build thanh file
// hash rieng. Ham nay map nguoc ve dung asset da build de tranh anh vo.
export const LEGACY_LAST_YEAR_PHOTOS = [
  { url: img101, caption: '会場となった1号館1階ラウンジの様子。' },
  { url: img102, caption: '献血バスは1号館のお隣、4号館前に停車。' },
  { url: img201, caption: '献血バスでは同時に3名の採血。車内ではラジオが流れ、ゆったりした雰囲気。' },
  { url: img202, caption: '採血中は注意事項を読んだり、看護師から血の巡りを良くするアドバイスを受けたり。' },
  { url: img203, caption: '事前予約の受付・会場誘導は学生ボランティアが担当。' },
  { url: img204, caption: 'ライオンズクラブの方々と学生ボランティアが献血の呼びかけを行いました。' },
]

export function resolveLegacyPhotoUrl(url: string): string {
  if (url.includes('lastyear-101')) return img101
  if (url.includes('lastyear-102')) return img102
  if (url.includes('lastyear-201')) return img201
  if (url.includes('lastyear-202')) return img202
  if (url.includes('lastyear-203')) return img203
  if (url.includes('lastyear-204')) return img204
  return url
}
