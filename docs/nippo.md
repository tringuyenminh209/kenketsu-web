# NIPPO

## Ngay: 2026-06-27

## Noi dung da hoan thanh

- Thay the giao dien Vite template bang trang web su kien hien mau mot trang.
- Thiet ke cac phan chinh: hero, thong tin su kien, ly do hien mau, quy trinh an toan, form dang ky, luu y, khao sat va khu vuc quan ly preview.
- Doi ten website tu ten truong chua duoc phep su dung sang `Campus Care`.
- Xoa cac chu `ECC/ecc` trong source va cap nhat lai `src/config/event.ts`.
- Cai thien UI chon ngon ngu thanh select hien dai co icon.
- Them anh hero dung chu de hien mau vao `src/assets/blood-donation-hero.png`.
- Cai thien giao dien mobile rieng: header gon hon, navigation dang chip scroll ngang, hero ngan hon, form de doc hon.
- Doi bang quan ly tren mobile thanh dang card de khong bi ep ngang.
- Them GSAP va `@gsap/react` de tao animation nhe: hero entrance, scroll reveal, hover polish va parallax nhe cho anh.
- Them xu ly `prefers-reduced-motion` de giam animation khi nguoi dung can.
- Tach rieng trang user `/` va trang admin `/admin`.
- Them noi dung giao duc ve hien mau: ly do can hien mau, vai tro cua mau trong y te, y nghia cua the he tre va cong dong truong hoc.
- Cai thien cac card loi ich de nguoi dung co the bam vao xem chi tiet kem hinh anh minh hoa.
- Cai thien section "vi sao can hien mau / an toan / cong dong" thanh dang ke chuyen co hinh anh, checklist va CTA ro hon.
- Cai thien section kien thuc de co the bam tung noi dung va xem giai thich sau hon bang panel chi tiet kem hinh anh.
- Lam lai phan `注意事項・献血の基準` theo tone nhe nhang hon: doi icon, doi title, them intro than thien va checklist mem hon.

## Kiem tra

- `npm run lint`: pass
- `npm run build`: pass
- Playwright mobile QA: pass
- Khong co horizontal overflow tren mobile
- Form dang ky co local submit state
- Route `/` va `/admin` hoat dong rieng
- Cac card chi tiet trong phan kien thuc va loi ich bam duoc, noi dung detail thay doi dung
- Console khong co warning/error lien quan den GSAP sau khi tach trang

## File da thay doi chinh

- `src/App.tsx`
- `src/App.css`
- `src/index.css`
- `src/config/event.ts`
- `src/assets/blood-donation-hero.png`
- `package.json`
- `package-lock.json`

## Viec con lai

- Noi form dang ky va khao sat voi backend/Supabase khi BE san sang.
- Hoan thien logic doi ngon ngu thuc te.
- Dich noi dung `zh.json` sang tieng Trung that, hien tai moi la fallback.
- Kiem tra lai tren dien thoai that truoc khi nop/deploy.
- Ket noi admin auth, CSV export va print preview voi backend.

---

## Ngay: 2026-06-27 (session 2)

## Noi dung da hoan thanh

- Hoan thien da ngon ngu (i18n): noi `useTranslation()` cho tat ca section — nav, hero, info-strip, form dang ky, precautions, survey — tren ca 4 ngon ngu (ja/my/ne/zh).
- Sua loi build Vercel lan 1: `package.json` chua duoc commit sau khi `npm install`, khien tsc bao loi TS2307 cho gsap, i18next, clsx, tailwind-merge.
- Sua loi build Vercel lan 2: `src/assets/blood-donation-hero.png` chua duoc track boi git, khien Vite bao module not found.
- Them tinh nang cay tien trinh dang ky realtime (`BloodTreeProgress`) tren trang public:
  - SVG cay trui voi 50 la phan bo tren 5 cum canh.
  - La mo len co animation `leafPop` (scale 0 → 1.3 → 1) khi so luong dang ky tang.
  - Supabase Realtime: subscribe `postgres_changes` tren bang `registration_counts` — update real-time khong can reload.
  - Progress bar + hien thi so nguoi / 50 + phan tram.
  - Bang `registration_counts` co RLS public SELECT (chi co event_year va count, khong co data ca nhan); trigger tu dong tang count khi co INSERT vao `registrations`.
  - Da dich sang 4 ngon ngu (tree.title/subtitle/unit/goalReached/remaining).
- Luu memory: MCP Supabase lien ket sai account, khong dung duoc cho project nay — khi can migration thi viet SQL file va huong dan paste thu cong vao Dashboard.

## Kiem tra

- `npm run build`: pass (0 TypeScript error)
- Vercel deploy: pass (commit push thanh cong)

## File da thay doi chinh

- `src/components/BloodTreeProgress.tsx` (moi)
- `supabase/migrations/003_registration_counter.sql` (moi — cho paste thu cong)
- `src/App.tsx`
- `src/App.css`
- `src/locales/ja.json`, `my.json`, `ne.json`, `zh.json`
- `package.json`, `package-lock.json`

## Viec con lai

- Paste `supabase/migrations/003_registration_counter.sql` vao Supabase Dashboard SQL Editor de kich hoat realtime tree.
- Tao Supabase Auth user cho giao vien dang nhap admin.
- Cap nhat ten nhom va catchphrase khi nhom quyet dinh xong → sua hero tagline va brand name trong App.tsx.
