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

---

## Ngay: 2026-06-29

## Noi dung da hoan thanh

- Hoan thanh refactor `App.tsx`: xoa ~480 dong code trung lap (Icon, SiteHeader, usePageMotion, AdminPage, LanguageSelect da bi duplicate), tach ra `src/lib/shared.tsx` va `src/pages/AdminPage.tsx`.
- Code-split route `/admin` bang `React.lazy()` + `Suspense`: AdminPage thanh chunk rieng ~4.79 kB, giam bundle chinh.
- Them inline form validation cho truong `studentId` va `birthDate`: chi hien thi chi bao sau lan nhap dau tien (pattern `fieldTouched`), icon check/cross va mau vien xanh/do.
- Them accessibility cho cay la `BloodTreeProgress`: them `tabIndex`, `role="button"`, `aria-label` (dung i18n key `tree.leafAriaLabel`), `onKeyDown` (Enter/Space) cho cac la active.
- Them key `tree.leafAriaLabel` vao 6 file locale: ja, vi, en, my, ne, zh.
- Fix loi encoding trong `vi.json` va `zh.json`: mang `steps[]` (3 phan tu) va mot so key trong `reason` bi thay ky tu dau bang `?` do loi UTF-8 khi tao ban dich.
- Da push 3 commits len GitHub, Vercel tu dong deploy.

## Kiem tra

- `npm run build`: pass, AdminPage la chunk rieng
- Validation chi hien thi sau keystroke dau tien, khong hien khi load trang
- Leaf a11y: co the Tab den tung la, Enter/Space bam duoc
- Locale: khong con ky tu `?` trong vi.json va zh.json

## File da thay doi chinh

- `src/App.tsx`
- `src/App.css`
- `src/lib/shared.tsx` (file moi)
- `src/pages/AdminPage.tsx` (file moi)
- `src/components/BloodTreeProgress.tsx`
- `src/locales/ja.json`, `vi.json`, `en.json`, `my.json`, `ne.json`, `zh.json`
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

---

## Ngay: 2026-06-28

## Noi dung da hoan thanh

- Cai thien `BloodTreeProgress` thanh diem tuong tac chinh cua trang web:
  - **GSAP sway animation**: moi la xanh dao dong lien tuc theo gio voi pha lech ngau nhien (staggered), trong sinh dong nhu GIF thuc su.
  - **Hover tooltip**: hover vao la → la phong to 1.65x + tooltip glassmorphism hien emoji doc nhat + "参加者 #N" (50 emoji khac nhau, privacy-safe vi khong can data that).
  - **Click sparkle**: click vao la → animation bounce (scale 1.9 → 0.82 → 1.18 → 1) + 10 hat mau bắn ra tu vi tri la.
  - **Realtime pop-in**: khi co nguoi dang ky moi qua Supabase Realtime → GSAP `back.out(2.2)` pop-in + particle burst tu vi tri la moi.
  - Su dung `useGSAP` voi `revertOnUpdate: true` va `contextSafe` cho hover/click handlers de dam bao cleanup dung quy tac gsap-react skill.
  - `transformBox: fill-box` + `transformOrigin: 50% 50%` de scale/rotation dung tam la SVG.
- Them i18n key `tree.clickHint` vao 4 ngon ngu (ja/my/ne/zh).
- Them CSS: `.leaf-tooltip` (glassmorphism, fixed position), `.tree-click-hint` (hint text nho duoi cay), `@keyframes tooltipIn`.
- Luu memory: quy tac viet nippo vao `docs/nippo.md`.

## Kiem tra

- `npm run build`: pass (0 TypeScript error)
- Vercel deploy: push thanh cong len origin/main

## File da thay doi chinh

- `src/components/BloodTreeProgress.tsx` (viet lai hoan toan)
- `src/App.css` (them leaf-tooltip, tree-svg-wrap, tree-click-hint styles)
- `src/locales/ja.json`, `my.json`, `ne.json`, `zh.json` (them tree.clickHint)
- `.claude/memory/MEMORY.md`, `feedback_nippo.md` (them rule nippo)

## Viec con lai

- Paste `supabase/migrations/003_registration_counter.sql` vao Supabase Dashboard SQL Editor de kich hoat realtime tree va particle burst khi co nguoi dang ky moi.
- Tao Supabase Auth user cho giao vien dang nhap admin.
- Cap nhat ten nhom va catchphrase → sua hero tagline va brand name.

---

## Ngay: 2026-06-28 (logo va rule nippo)

## Noi dung da hoan thanh

- Thiet ke logo `Campus Care` dang SVG, gom ban full lockup va compact mark.
- Dong bo compact mark vao header website va thay favicon mac dinh cua Vite.
- Commit va push thay doi logo len `main` voi commit `9475075 Add Campus Care logo assets`.
- Them rule vao `AGENTS.md`: sau khi hoan thanh cong viec co y nghia, can cap nhat mot file nippo duy nhat tai `docs/nippo.md`.

## Kiem tra

- `npm run lint`: pass
- `npm run build`: pass
- Kiem tra logo header render thanh cong voi kich thuoc 42x42.

## File da thay doi chinh

- `src/assets/campus-care-logo.svg`
- `src/assets/campus-care-mark.svg`
- `public/favicon.svg`
- `src/App.tsx`
- `src/App.css`
- `AGENTS.md`
- `docs/nippo.md`

## Viec con lai

- Neu can, tao them bien the logo ngang/doc cho poster, slide hoac man hinh admin.

---

## Ngay: 2026-06-28 (form dang ky va survey)

## Noi dung da hoan thanh

- Doi truong `所属` trong form dang ky thanh `クラス` va cho nguoi dung tu nhap class cua minh.
- Doi `生年月日` tu date picker sang input text nhanh, chap nhan `YYYY/MM/DD`, `YYYY-MM-DD`, hoac `YYYYMMDD`, sau do chuan hoa ve `YYYY-MM-DD` khi gui backend.
- Bo dong helper text duoi o `生年月日` de form gon hon theo feedback moi.
- Them validate loi ngay sinh khong hop le truoc khi gui dang ky.
- Mo rong phan `アンケート` tu 3 cau hoi thanh 7 cau hoi, gom ly do tham gia, noi lo truoc khi tham gia, ho tro mong muon, kha nang gioi thieu cho ban be va ghi chu tu do.
- Do backend survey hien chi co 3 cot, cac cau hoi moi duoc dong goi vao `comment` dang key-value de khong can migration ngay.
- Cap nhat i18n cho `ja`, `en`, `vi`, `my`, `ne`, `zh`; sua loi chu moi bi bien thanh `???` khi ghi locale qua PowerShell.

## Kiem tra

- `npm run lint`: pass
- `npm run build`: pass
- Browser QA desktop: class la input, ngay sinh la text input, dropdown `所属` cu khong con, survey co 6 select va 1 textarea.
- Browser QA mobile 390x844: khong horizontal overflow, form register rong 375px, class/ngay sinh hien dung.
- Console desktop: khong co app error/warning. Mobile co 1 loi `Browser Use clipboard bridge` tu runtime browser, khong phai app code.

## File da thay doi chinh

- `src/App.tsx`
- `src/App.css`
- `src/locales/ja.json`
- `src/locales/en.json`
- `src/locales/vi.json`
- `src/locales/my.json`
- `src/locales/ne.json`
- `src/locales/zh.json`
- `docs/nippo.md`

## Viec con lai

- Neu BE muon phan tich survey chi tiet, can them cot rieng cho `motivation`, `concern`, `preferred_support`, va `recommend` trong Supabase.

---

## Ngay: 2026-06-29 (sua dia diem su kien)

## Noi dung da hoan thanh

- Sua dia diem su kien theo anh poster: `ECCコンピュータ専門学校 1号館 1階ラウンジ`.
- Sua ngay gio theo anh poster: `2026年9月15日（火）`, `9:30〜11:30 / 12:30〜16:30`.
- Them thong tin `協賛`: `大阪曾根崎ライオンズクラブ / 大阪西ライオンズクラブ`.
- Them ghi chu: dat lich truoc se rut ngan thoi gian thu tuc hien mau.
- Them thong tin `献血記念品`: nguoi hop tac hien mau se nhan qua ky niem tu Lions Club.
- Them link App Store va Google Play cho ung dung Labrad de nguoi dung co the bam truc tiep thay vi quet QR.
- Tao va gan 4 anh minh hoa rieng cho cac card `輸血が必要な人たちの現実`: cap cuu/phau thuat, ung thu/huyet hoc, sinh san/tre so sinh, benh man tinh/dieu tri dai han.
- Cai thien section `安全で安心の献血`: bien 3 buoc `事前チェック`, `問診・検査`, `採血` thanh card co the bam, moi buoc co anh minh hoa, noi dung detail va danh sach cac muc duoc kiem tra.
- Them chu thich o footer de nguoi dung biet mot so hinh anh tren website la hinh minh hoa duoc tao bang AI, co the khac voi dia diem/nhan vat thuc te.
- Cap nhat `src/config/event.ts` de phan event info va flyer/preview dung cung mot nguon du lieu.

## Kiem tra

- `npm run lint`: pass
- `npm run build`: pass

## File da thay doi chinh

- `src/config/event.ts`
- `src/App.tsx`
- `src/App.css`
- `src/components/ImpactSection.tsx`
- `src/assets/impact/impact-emergency-surgery.webp`
- `src/assets/impact/impact-cancer-treatment.webp`
- `src/assets/impact/impact-maternity-newborn.webp`
- `src/assets/impact/impact-long-term-care.webp`
- `src/assets/process/process-precheck.webp`
- `src/assets/process/process-interview-test.webp`
- `src/assets/process/process-donation.webp`
- `src/locales/ja.json`
- `src/locales/en.json`
- `src/locales/vi.json`
- `src/locales/my.json`
- `src/locales/ne.json`
- `src/locales/zh.json`
- `docs/nippo.md`

---

## Ngay: 2026-06-29 (ra soat va hoan thien da ngon ngu)

## Noi dung da hoan thanh

- Them dau tieng Viet day du cho cac nhan bi thieu trong `src/locales/vi.json` (sponsor_label, reservation_label, gift_label, appLinks*).
- Dich cac chuoi appLinks lien quan den ung dung Labrad sang tieng Trung (`zh.json`), tieng Myanmar (`my.json`), va tieng Nepal (`ne.json`).
- Bo sung 3 khoa dich con thieu ve appLinks vao tep tin tieng Nepal (`ne.json`).
- Toi uu hoa mot so tu khoa tieng Viet trong `src/locales/vi.json` sang tong giong hoc duong phu hop va truyen cam hung hon (doi "Cay tham gia" -> "Cay nhan ai", "Tieu chuan..." -> "Mot so luu y...", "Cơ hoi kiem tra..." -> "Cơ hoi lang nghe cơ the", "Cam giac ho tro..." -> "Niem vui se chia su song").
- Dịch toàn bộ giá trị cấu hình sự kiện động (ngày giờ, địa điểm, nhà tài trợ, lưu ý đặt lịch, quà lưu niệm) từ `EVENT_CONFIG` sang cả 6 ngôn ngữ.
- Cập nhật `src/App.tsx` sử dụng hàm dịch `t()` để hiển thị thông tin sự kiện đa ngôn ngữ chuẩn xác.
- Tích hợp đa ngôn ngữ toàn diện vào component `ImpactSection.tsx`: dịch toàn bộ các mảng dữ liệu cứng `WHO_NEEDS` và `JOURNEY` sang cả 6 ngôn ngữ; dịch phần thống kê số liệu (stats), biểu đồ quy trình (journey) và liên kết chính thức (trust) ở cuối trang; tự động định dạng số liệu đếm số theo chuẩn quốc tế (đạt 226/226 khóa dịch đồng bộ).

## Kiem tra

- `npm run lint`: pass (oxlint)
- `npm run build`: pass

## File da thay doi chinh

- `src/App.tsx`
- `src/components/ImpactSection.tsx`
- `src/locales/ja.json`
- `src/locales/en.json`
- `src/locales/vi.json`
- `src/locales/zh.json`
- `src/locales/my.json`
- `src/locales/ne.json`
- `docs/nippo.md`

---

## Ngay: 2026-06-29 (session 2 - sua loi locales va chieu sau kien thuc)

## Noi dung da hoan thanh

- Khắc phục triệt để lỗi cú pháp JSON và các ký tự bị lỗi hiển thị của tệp `my.json` và `ne.json` bằng cách khôi phục bản gốc sạch từ git (`d18a602`) và cập nhật lập trình.
- Đồng bộ hóa các placeholder đăng ký thành dạng chữ Latinh (Romaji) và ECC email `@ecc.ac.jp`, mã số sinh viên ví dụ `2240000` trên tất cả các ngôn ngữ còn thiếu.
- Bổ sung toàn bộ các khóa cấu hình sự kiện, 28 khóa phần `impact` và 7 khóa cấu hình ảnh hoạt động năm ngoái (`lastYear.*`, `tree.leafAriaLabel`) bị thiếu cho cả `my.json` và `ne.json` (đạt 233/233 khóa đồng bộ 100% trên 6 tệp).
- Mở rộng chi tiết nội dung chiều sâu (`detail`) cho cả 3 thẻ trong phần `knowledge.cards` ở toàn bộ 6 tệp locales (ja, en, vi, zh, my, ne). Nội dung mới tập trung cung cấp kiến thức y học thực tế về thời hạn bảo quản máu cực ngắn (hồng cầu 21 ngày, tiểu cầu 4 ngày), quy trình ly tâm tách thành phần máu để cứu tối đa 3 người, và vấn đề già hóa dân số tại Nhật Bản.
- Cải tiến logic hiển thị mô tả chi tiết của phần kiến thức và lợi ích (`knowledge` và `benefits` trong `src/App.tsx` & `src/App.css`): tự động cắt chuỗi `\n` và chuyển dòng bắt đầu bằng `- ` thành danh sách bullet list (`<li>`) vô cùng sinh động, chuyên nghiệp và có chiều sâu cấu trúc.


## Kiem tra

- `npm run lint`: pass (oxlint)
- `npm run build`: pass
- Tập lệnh kiểm tra tự động locales: pass (đồng bộ 100% với 233 khóa)

- `src/locales/my.json`
- `src/locales/ne.json`
- `docs/nippo.md`

---

## Ngay: 2026-06-29 (session 3 - tich hop bang khao sat trong admin va go link admin tren user header)

## Noi dung da hoan thanh

- Gỡ bỏ liên kết truy cập Admin (`t('nav.admin')` / "管理") trên thanh Header dành cho người dùng thông thường để đảm bảo tính bảo mật và tối ưu giao diện. Trong chế độ Admin (`isAdmin = true`), liên kết này vẫn hiển thị đầy đủ để điều hướng bình thường.
- Tích hợp thêm phần hiển thị bảng **Dữ liệu khảo sát (アンケート回答データ)** vào trong `src/pages/AdminPage.tsx` dưới dạng bảng biểu trực quan.
- Thêm tính năng xuất CSV (`surveysToCSV` & `fetchSurveys` trong `src/lib/supabase.ts`) cho dữ liệu khảo sát riêng biệt, giúp các giáo viên dễ dàng theo dõi, thống kê và tải dữ liệu khảo sát trực tiếp từ trang Admin Dashboard.
- **Cải tiến và đồng bộ hóa toàn diện dữ liệu Đăng ký & Khảo sát**:
  - Bổ sung cột **生年月日 (Ngày sinh)** và **性別 (Giới tính)** vào bảng hiển thị và tệp xuất CSV của dữ liệu đăng ký trong Admin Dashboard (do trước đó bị thiếu).
  - Tự động biên dịch mã giới tính (`male` -> `男性`, `female` -> `女性`...) trực quan trên bảng và CSV.
  - Phân tích cú pháp chuỗi cấu trúc của câu hỏi khảo sát (`motivation`, `concern`, `preferred_support`, `recommend`, `comment`) để hiển thị tách biệt rõ ràng từng câu trả lời trong bảng admin, thay vì để chuỗi thô.
  - Thiết lập xuất CSV khảo sát đầy đủ 8 cột riêng biệt cho mỗi câu hỏi khảo sát giúp giáo viên phân tích và vẽ biểu đồ dễ dàng trong Excel.

## Kiem tra

- `npm run lint`: pass (oxlint)
- `npm run build`: pass

## File da thay doi chinh

- `src/lib/shared.tsx`
- `src/lib/supabase.ts`
- `src/pages/AdminPage.tsx`
- `docs/nippo.md`

---

## Ngay: 2026-06-29 (session 4 - bo sung da ngon ngu cho quy trinh hien mau)

## Noi dung da hoan thanh

- Bo sung ban dich day du cho phan `安全で安心の献血` / quy trinh hien mau o cac locale `vi`, `my`, `ne`, `zh`.
- Thay cac fallback tieng Anh trong `stepReadMore`, `processDetailLabel`, `processImageAlt` va 3 buoc `Pre-check`, `Interview & test`, `Blood donation`.
- Chinh tieng Viet co dau cho cac card quy trinh de nguoi dung doc tu nhien hon.

## Kiem tra

- Kiem tra JSON locales parse hop le.
- `npm run lint`: pass.
- `npm run build`: pass.

## File da thay doi chinh

- `src/locales/vi.json`
- `src/locales/my.json`
- `src/locales/ne.json`
- `src/locales/zh.json`
- `docs/nippo.md`

---

## Ngay: 2026-06-29 (session 5 - bo sung tuong tac cho cay nhan ai)

## Noi dung da hoan thanh

- Tích hợp tính năng **Thông điệp yêu thương (Love Messages)** đa ngôn ngữ vào các lá cây trong `BloodTreeProgress.tsx`. Khi di chuột (hover) vào mỗi chiếc lá hoạt động, người dùng sẽ thấy số hiệu người tham gia và một lời nhắn truyền cảm hứng ngẫu nhiên được bản địa hóa tương ứng (ở cả 6 ngôn ngữ).
- Tích hợp hiệu ứng **Âm thanh pha lê (Crystal Sound)** tự tổng hợp thông qua Web Audio API khi nhấp chuột (click) vào các chiếc lá trên Cây Nhân Ái, tạo cảm giác tương tác sinh động, thú vị mà không làm tăng dung lượng tải trang.
- Cập nhật 11 khóa dịch mới liên quan đến thông điệp yêu thương (`loveMessage.*` và `participantNum`) trên toàn bộ 6 tệp ngôn ngữ, đạt trạng thái đồng bộ 100% (248/248 khóa).

## Kiem tra

- Chạy linter (`npm run lint`): pass.
- Chạy build (`npm run build`): pass.

## File da thay doi chinh

- `src/components/BloodTreeProgress.tsx`
- `src/locales/ja.json`
- `src/locales/en.json`
- `src/locales/vi.json`
- `src/locales/zh.json`
- `src/locales/my.json`
- `src/locales/ne.json`
- `docs/nippo.md`

---

## Ngay: 2026-06-30 (session 6 - bo sung da ngon ngu cho FAQ va Quick Access)

## Noi dung da hoan thanh

- **Đa ngôn ngữ hóa phần FAQ (Câu hỏi thường gặp)**: Tích hợp hàm `t()` và chuyển toàn bộ nội dung của 4 câu hỏi & câu trả lời từ tiếng Nhật cứng sang 6 tệp dịch (`ja`, `en`, `vi`, `zh`, `my`, `ne`) đồng bộ 100%.
- **Đa ngôn ngữ hóa phần Quick Access (Thanh truy cập nhanh)**: Chuyển 4 thẻ liên kết nhanh ("参加申込", "イベント情報", "注意事項", "献血とは") và các phụ đề tương ứng sang cơ chế đa ngôn ngữ tương ứng với 6 locales.
- Đồng bộ hóa toàn diện các tệp locales: Số lượng khóa dịch của mỗi tệp ngôn ngữ hiện đã đạt 303 khóa khớp nhau hoàn toàn.

## Kiem tra

- Chạy linter (`npm run lint`): pass.
- Chạy build (`npm run build`): pass.

## File da thay doi chinh

- `src/App.tsx`
- `src/locales/ja.json`
- `src/locales/en.json`
- `src/locales/vi.json`
- `src/locales/zh.json`
- `src/locales/my.json`
- `src/locales/ne.json`
- `docs/nippo.md`

---

## Ngay: 2026-06-30 (session 7 - bo sung da ngon ngu cho bang tieu chuan hien mau)

## Noi dung da hoan thanh

- **Đa ngôn ngữ hóa Bảng tiêu chuẩn hiến máu (eligibility)**:
  * Chuyển đổi toàn bộ nội dung của bảng tiêu chuẩn hiến máu `献血基準表` (bao gồm tiêu đề, các cột, các dòng thông số về lượng hiến, độ tuổi, cân nặng, huyết áp, nhịp tim, nhiệt độ, lượng huyết sắc tố, tiểu cầu, khoảng cách hiến giữa các lần, lượng hiến tối đa năm và các điều kiện cấm hiến chung) sang hệ thống đa ngôn ngữ.
  * Tích hợp hàm `t()` của hook i18next và thuộc tính `dangerouslySetInnerHTML` để xử lý mượt mà các định dạng HTML (`<br />`, `<small>`) trong bảng dịch ở cả 6 ngôn ngữ (`ja`, `en`, `vi`, `zh`, `my`, `ne`).
- Đồng bộ hóa toàn diện các tệp locales: Số lượng khóa dịch của mỗi tệp ngôn ngữ hiện đã được đồng bộ chuẩn hóa lên **356 khóa** khớp nhau hoàn toàn, có cơ chế tự động loại bỏ ký tự BOM khi đọc dữ liệu.

## Kiem tra

- Chạy linter (`npm run lint`): pass.
- Chạy build (`npm run build`): pass.

## File da thay doi chinh

- `src/App.tsx`
- `src/locales/ja.json`
- `src/locales/en.json`
- `src/locales/vi.json`
- `src/locales/zh.json`
- `src/locales/my.json`
- `src/locales/ne.json`
- `docs/nippo.md`

---

## Ngay: 2026-06-30 (session 8 - da ngon ngu hoa nut Eligibility Details)

## Noi dung da hoan thanh

- **Đa ngôn ngữ hóa nút xem chi tiết bảng tiêu chuẩn (`eligibility-btn`)**:
  * Chuyển đổi văn bản nút bấm cứng `献血基準の詳細を見る →` trong thẻ `aside` precautions thành dạng đa ngôn ngữ thông qua `t('precautions.detailsBtn')`.
  * Thêm khóa dịch `detailsBtn` vào mục `precautions` cho cả 6 ngôn ngữ (`ja`, `en`, `vi`, `zh`, `my`, `ne`).
- Đồng bộ hóa toàn diện các tệp locales: Số lượng khóa dịch của mỗi tệp ngôn ngữ hiện đã được đồng bộ chuẩn hóa lên **357 khóa** khớp nhau hoàn toàn.

## Kiem tra

- Chạy linter (`npm run lint`): pass.
- Chạy build (`npm run build`): pass.

## File da thay doi chinh

- `src/App.tsx`
- `src/locales/ja.json`
- `src/locales/en.json`
- `src/locales/vi.json`
- `src/locales/zh.json`
- `src/locales/my.json`
- `src/locales/ne.json`
- `docs/nippo.md`

---

## Ngay: 2026-06-30 (session 9 - bo sung 3 ngon ngu: Uzbekistan, Bangladesh, Indonesia)

## Noi dung da hoan thanh

- **Bổ sung 3 ngôn ngữ mới**:
  * Tích hợp **Uzbekistan (Oʻzbekcha)**, **Bangladesh (বাংলা)**, và **Indonesia (Bahasa Indonesia)** vào hệ thống.
  * Tạo mới 3 tệp dịch tương ứng: `src/locales/uz.json`, `src/locales/bn.json`, và `src/locales/id.json` với đầy đủ **357 khóa dịch** đồng bộ 100% với các ngôn ngữ có sẵn.
  * Cấu hình tệp `src/lib/i18n.ts` để nạp tài nguyên dịch của 3 ngôn ngữ mới này, nâng tổng số ngôn ngữ hỗ trợ lên 9 ngôn ngữ.
  * Cập nhật danh sách `LANGS` trong `src/lib/shared.tsx` để hiển thị tùy chọn trên giao diện chọn ngôn ngữ của Header.
- **Sửa lỗi TypeScript**:
  * Sửa lỗi khai báo `useRef<number>()` trong `BloodTreeProgress.tsx` thành `useRef<number | undefined>(undefined)` để hỗ trợ biên dịch chặt chẽ hơn ở các môi trường.

## Kiem tra

- Chạy linter (`npm run lint`): pass.
- Chạy build (`npm run build`): pass.

## File da thay doi chinh

- `src/lib/i18n.ts`
- `src/lib/shared.tsx`
- `src/components/BloodTreeProgress.tsx`
- `src/locales/uz.json`
- `src/locales/bn.json`
- `src/locales/id.json`
- `docs/nippo.md`

