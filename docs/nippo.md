# NIPPO

## Ngay: 2026-09-19

## Noi dung da hoan thanh

- Tinh chỉnh CTA cuối trang trên mobile: cân lại line-height, cỡ chữ và khoảng cách để tiêu đề tiếng Nhật không bị dính hoặc ngắt dòng thiếu tự nhiên.
- Rút gọn nút chuyển ngôn ngữ thành icon quả địa cầu, ẩn nhãn và mũi tên nhưng vẫn giữ nút có thể truy cập bằng bàn phím.

## Kiem tra

- Browser QA: mobile 366x738, light mode; header hiển thị icon ngôn ngữ gọn, trang render thành công.
- `npm run lint`: pass, chỉ còn 2 warning Fast Refresh có sẵn trong `src/lib/shared.tsx`.
- `npm run build`: pass; còn cảnh báo bundle lớn từ Vite, không ảnh hưởng render.

## File da thay doi chinh

- `src/App.css`
- `docs/nippo.md`

---

## Ngay: 2026-09-19

## Noi dung da hoan thanh

- Thiết kế lại các reason card trên mobile: giảm khoảng trắng, dùng bố cục 2 cột cho hai card đầu và card cộng đồng full-width, giúp màn hình gọn và cân đối hơn.

## Kiem tra

- Browser QA: mobile 366x738, light mode; trang chính render thành công và card hiển thị gọn hơn.
- `npm run lint`: chạy lại trong thư mục dự án.
- `npm run build`: chạy lại trong thư mục dự án.

## File da thay doi chinh

- `src/App.css`
- `docs/nippo.md`

---

## Ngay: 2026-09-18

## Noi dung da hoan thanh

- Rà soát và cải thiện toàn bộ UX/UI trang chính: tăng hierarchy cho hero, CTA, navigation, form controls và card surfaces.
- Tối ưu responsive desktop/tablet/mobile: header thành chip navigation cuộn ngang, hero xếp lại hợp lý, CTA full-width, thông tin và card chuyển về layout dễ đọc.
- Bổ sung trạng thái focus/hover/active rõ hơn, bo góc và shadow nhất quán, typography cân bằng và giới hạn độ dài dòng cho khả năng đọc.

## Kiem tra

- `npm run lint`: pass (chỉ còn 2 warning Fast Refresh có sẵn trong `src/lib/shared.tsx`).
- `npm run build`: pass; Vite chỉ cảnh báo bundle lớn ở mức khuyến nghị tối ưu thêm.
- Browser QA: desktop 1302x820 và mobile 390x844 đều render thành công, không thấy lỗi runtime hoặc horizontal overflow.

## File da thay doi chinh

- `src/App.css`
- `docs/nippo.md`

---

## Ngay: 2026-09-18

## Noi dung da hoan thanh

- Rà soát responsive toàn bộ trang ở mobile 366x738, không chỉ riêng phần khảo sát.
- Tối ưu header/brand, điều hướng cuộn ngang, hero image, CTA, spacing toàn trang, card và bảng dữ liệu để không bị tràn ngang.
- Thu gọn form khảo sát trên màn hình nhỏ, tăng vùng chạm checkbox/select và giữ các trường full-width dễ thao tác.

## Kiem tra

- Browser QA: mobile 366x738, light mode; trang chính và survey đều render thành công.
- `npm run lint`: pass, chỉ còn 2 warning Fast Refresh có sẵn trong `src/lib/shared.tsx`.
- `npm run build`: pass; còn cảnh báo bundle lớn từ Vite, không ảnh hưởng render.

## File da thay doi chinh

- `src/App.css`
- `docs/nippo.md`

---

## Noi dung da hoan thanh

- Sua loi runtime `supabaseUrl is required` trong `src/lib/supabase.ts` bang cach ho tro ca bien Vite va bien `NEXT_PUBLIC_`, kem fallback an toan de preview van render duoc khi env chua duoc inject.
- Them canh bao console ro rang khi preview dang chay khong co cau hinh Supabase.

## Kiem tra

- `npm run build`: pass
- Browser preview trang chinh: render thanh cong, khong con loi khoi tao Supabase.

## File da thay doi chinh

- `src/lib/supabase.ts`
- `docs/nippo.md`

---

## Ngay: 2026-09-18

## Noi dung da hoan thanh

- Căn đều các ô trong form 学内献血アンケート: card câu hỏi dạng select cùng chiều cao theo hàng, option checkbox có chiều cao ổn định và nội dung được căn giữa để tránh cảm giác lệch.
- Cho caption tự giãn đầy phần còn lại của card, giữ chiều cao tối thiểu và bo góc nhất quán.

## Kiem tra

- Browser QA: kiểm tra lại gallery ở desktop 1302x820 và mobile 390x844.

## File da thay doi chinh

- `src/App.css`
- `docs/nippo.md`

---

## Ngay: 2026-09-18

## Noi dung da hoan thanh

- Tối ưu riêng trải nghiệm mobile cho 学内献血アンケート theo hướng gọn, dễ quét và ít cảm giác nặng nề hơn bản desktop.
- Giảm padding, khoảng cách, shadow và kích thước tiêu đề; chuyển nhóm lựa chọn nhiều đáp án thành một cột để thao tác bằng ngón tay rõ ràng hơn.
- Giữ select/card cùng chiều rộng, tăng vùng chạm tối thiểu và bảo toàn layout desktop hai cột.

## Kiem tra

- Browser QA tại viewport mobile 366x738, light mode: render thành công.
- `npm run lint`: pass.
- `npm run build`: pass.

## File da thay doi chinh

- `src/App.css`
- `docs/nippo.md`

---

## Ngay: 2026-09-18

## Noi dung da hoan thanh

- Thu gọn và cân lại các card “Vì sao nên hiến máu” trên mobile: bỏ khoảng trắng thừa, giảm padding, icon và typography để nội dung liền mạch, dễ quét hơn.
- Giữ card đồng nhất chiều cao theo nội dung và cải thiện khoảng cách giữa các card ở viewport 366px.

## Kiem tra

- Browser QA: mobile 366x738, light mode; card hiển thị gọn và không tràn ngang.
- `npm run lint` và `npm run build` cần chạy từ thư mục dự án `/vercel/share/v0-project`.

## File da thay doi chinh

- `src/App.css`
- `docs/nippo.md`

---

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
- Them thong tin `協賛`: `大阪曾根崎ライオ���ズクラブ / 大阪西ライオンズクラブ`.
- Them ghi chu: dat lich truoc se rut ngan thoi gian thu tuc hien mau.
- Them thong tin `献血記念品`: nguoi hop tac hien mau se nhan qua ky niem tu Lions Club.
- Them link App Store va Google Play cho ung dung Labrad de nguoi dung co the bam truc tiep thay vi quet QR.
- Tao va gan 4 anh minh hoa rieng cho cac card `輸血が必要な人たちの現実`: cap cuu/phau thuat, ung thu/huyet hoc, sinh san/tre so sinh, benh man tinh/dieu tri dai han.
- Cai thien section `安全で安心の献血`: bien 3 buoc `事��チェック`, `問診・検査`, `採血` thanh card co the bam, moi buoc co anh minh hoa, noi dung detail va danh sach cac muc duoc kiem tra.
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
- Mở rộng chi tiết nội dung chiều sâu (`detail`) cho cả 3 thẻ trong phần `knowledge.cards` ở toàn bộ 6 tệp locales (ja, en, vi, zh, my, ne). Nội dung mới tập trung cung cấp kiến thức y học thực tế về thời hạn bảo quản máu cực ngắn (h��ng cầu 21 ngày, tiểu cầu 4 ngày), quy trình ly tâm tách thành phần máu để cứu tối đa 3 người, và vấn đề già hóa dân số tại Nhật Bản.
- Cải tiến logic hiển thị m�� tả chi tiết của phần kiến thức và lợi ích (`knowledge` và `benefits` trong `src/App.tsx` & `src/App.css`): tự động cắt chuỗi `\n` và chuyển dòng bắt đầu bằng `- ` thành danh sách bullet list (`<li>`) vô cùng sinh động, chuyên nghiệp và có chiều sâu cấu trúc.


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
  * Tích hợp hàm `t()` của hook i18next và thuộc tính `dangerouslySetInnerHTML` ��ể xử lý mượt mà các định dạng HTML (`<br />`, `<small>`) trong bảng dịch ở cả 6 ngôn ngữ (`ja`, `en`, `vi`, `zh`, `my`, `ne`).
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

## Ngay: 2026-06-30 (session 10 - thiet ke lai cay nhan ai theo growth stages)

## Noi dung da hoan thanh

- **Thiet ke lai BloodTreeProgress thanh growth stages**:
  * Xoa toan bo he thong la don le (50 la SVG, tooltip, am thanh, particle burst, GSAP animation).
  * Thay bang 4 stage truc quan dua tren so luong dang ky: stage -1 (chua co ai), stage 0 (1-10 nguoi = Mam non), stage 1 (11-25 = Cay non), stage 2 (26-40 = Dang lon), stage 3 (41-50 = No ro).
  * Moi stage them them vong tron do chong len nhau tao tan tan (canopy): stage 0 co 3 vong, stage 1 them 3, stage 2 them 5, stage 3 them 5 vong va 3 trai tim trang decorative.
  * Bo GSAP hoan toan khoi component nay, thay bang `useCountUp` hook don gian dung `requestAnimationFrame`.
  * Them `IntersectionObserver` de khoi dong animation dem so khi section vao viewport.
  * Them CSS `@keyframes stageReveal` de transition muot khi stage thay doi.
- **Cap nhat CSS App.css**:
  * Doi mau xanh la → do cho: progress fill, milestone markers, progress pct, goal badge.
  * Xoa CSS khong con dung: `.tree-leaf-group`, `.tree-leaf-active`, `.leaf-tooltip`, `.leaf-tooltip-emoji`, `@keyframes leafPop`, `@keyframes tooltipIn`, `.tree-click-hint`.
  * Them `.tree-illustration` (thay the `.tree-svg-wrap`) va `.tree-stage-badge`.
  * Doi mau nen section tu xanh la sang do nhat.
- **Cap nhat 9 locale files**:
  * Them 4 khoa moi: `tree.stage0`, `tree.stage1`, `tree.stage2`, `tree.stage3`.
  * Cap nhat `tree.subtitle` de khong con noi den "la" nua, thay bang "cay".

## Kiem tra

- Chay build (`npm run build`): pass.
- Kiem tra tren trinh duyet: tree stage 0 hien thi dung voi canopy do, label "Mam non", counter animate, progress bar mau do.

## File da thay doi chinh

- `src/components/BloodTreeProgress.tsx`
- `src/App.css`
- `src/locales/ja.json`, `vi.json`, `en.json`, `zh.json`, `my.json`, `ne.json`, `id.json`, `uz.json`, `bn.json`
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

---

## Ngay: 2026-06-30 (session 11 - bo sung 3 ngon ngu: Han, Thai, Sri Lanka)

## Noi dung da hoan thanh

- **Bổ sung 3 ngôn ngữ mới**:
  * Tích hợp **Hàn Quốc (한국어)**, **Thái Lan (ภาษาไทย)**, và **Sri Lanka (සිංහල)** vào hệ thống.
  * Tạo mới 3 tệp dịch tương ứng: `src/locales/ko.json`, `src/locales/th.json`, và `src/locales/si.json` với đầy đủ **361 khóa dịch** đồng bộ 100% với các ngôn ngữ khác.
  * Cấu hình tệp `src/lib/i18n.ts` để nạp tài nguyên dịch của 3 ngôn ngữ này, nâng tổng số ngôn ngữ hỗ trợ lên 12 ngôn ngữ.
  * Cập nhật danh sách `LANGS` trong `src/lib/shared.tsx` để hiển thị tùy chọn trên giao diện chọn ngôn ngữ của Header.

## Kiem tra

- Chạy linter (`npm run lint`): pass.
- Chạy build (`npm run build`): pass.

## File da thay doi chinh

- `src/lib/i18n.ts`
- `src/lib/shared.tsx`
- `src/locales/ko.json`
- `src/locales/th.json`
- `src/locales/si.json`
- `docs/nippo.md`

---

## Ngay: 2026-06-30 (session 12 - cau hinh SEO va xac minh Google Search Console)

## Noi dung da hoan thanh

- **Cấu hình SEO**:
  * Tạo tệp `public/robots.txt` cho phép các công cụ tìm kiếm thu thập dữ liệu và khai báo đường dẫn Sitemap.
  * Tạo tệp `public/sitemap.xml` để liệt kê cấu trúc và tần suất cập nhật trang web.
- **Xác minh Google Search Console**:
  * Chèn thẻ `<meta name="google-site-verification" content="X-cAfr-MioYxYMOO1tJ5_mr_uRUHSyI1I94J0eee-ww" />` vào thẻ `<head>` của tệp `index.html` theo yêu cầu từ Google Search Console để xác minh quyền sở hữu trang web.

## Kiem tra

- Chạy build (`npm run build`): pass.

## File da thay doi chinh

- `index.html`
- `public/robots.txt`
- `public/sitemap.xml`
- `docs/nippo.md`

---

## Ngay: 2026-06-30 (session 13 - thiet ke lai cay nhan ai organic va nghe thuat hon)

## Noi dung da hoan thanh

- **Thiết kế lại Cây Nhân Ải**:
  * Loại bỏ hoàn toàn hiệu ứng bong bóng hình tròn (goo filter) vốn gây cảm giác thô cứng và loang lổ.
  * Thiết kế lại hệ thống lá và trái tim dựa trên danh sách tọa độ phân bổ hữu cơ (`LEAF_DATA` gồm 88 phần tử) chia đều theo các giai đoạn.
  * Vẽ lá cây bằng hình dáng chiếc lá thật (`<path d="M12,2 C8,7 6,14 12,22 C18,14 16,7 12,2 Z" />`) kết hợp gân lá tinh tế.
  * Sử dụng dải màu gradient 3D cho thân cây (`#trunk-live` và `#trunk-dry`) để tạo chiều sâu chân thực.
  * Thêm các cánh hoa/trái tim rơi rụng dưới g���c cây ở giai đoạn 3 (In Full Bloom) để tạo không gian nghệ thuật.
- **Hoạt họa (CSS Animation)**:
  * Thêm hiệu ứng `.tree-leaf-pop` và `@keyframes leafPopIn` giúp các lá và trái tim nở ra sinh động khi chuyển đổi giai đoạn với độ trễ (delay) khác nhau.

## Kiem tra

- Chạy build (`npm run build`): pass.
- Chạy linter (`npm run lint`): pass.

## File da thay doi chinh

- `src/components/BloodTreeProgress.tsx`
- `src/App.css`
- `docs/nippo.md`

---

## Ngay: 2026-07-01 (session 14 - sua loi responsive va ngon ngu cua dialog tieu chuan hien mau)

## Noi dung da hoan thanh

- **Sửa lỗi hiển thị Dialog trên thiết bị di động (Mobile/Tablet)**:
  * Thêm `padding-bottom: 32px` vào `.eligibility-table-wrap` để tạo không gian trống phía dưới bảng. Điều này ngăn chặn thanh cuộn ngang đè lên và che mất dòng chữ cuối cùng của bảng.
  * Thêm media query `@media (max-width: 768px)` để tinh chỉnh kích thước: giảm padding của overlay (`10px`), bo góc hộp thoại (`12px`), giảm kích thước chữ của bảng xuống `11px`, thu hẹp khoảng cách padding ở các ô để tối ưu hóa không gian hiển thị trên màn hình dọc nhỏ (iPad/iPhone).
- **Sửa lỗi dịch chưa tự nhiên**:
  * Tiếng Việt: Chỉnh sửa cụm từ `"Từ cùng thứ đó sau 4/8/2 tuần"` dịch từ tiếng Nhật (`同じ曜日から`) thành cụm từ tự nhiên và chuẩn y khoa: `"Kể từ cùng ngày thứ trong tuần sau 4/8/2 tuần"`.
  * Tiếng Thái: Hiệu chỉnh cụm từ chỉ khoảng cách sang dạng tự nhiên của tiếng Thái: `"เริ่มต้นได้���นวันเดียวกันของอีก 4/8/2 สัปดาห์ถัดไป"`.
  * Tiếng Indonesia: Tối ưu hóa cụm từ dịch khoảng cách tương ứng: `"Mulai hari yang sama di 4/8/2 minggu berikutnya"`.

## Kiem tra

- Chạy build (`npm run build`): pass.
- Chạy linter (`npm run lint`): pass.

## File da thay doi chinh

- `src/locales/id.json`
- `docs/nippo.md`

---

## Ngay: 2026-07-01 (session 15 - khoanh vung CSS table de sua loi vo giao dien dialog tren mobile/tablet)

## Noi dung da hoan thanh

- **Sửa lỗi vỡ cấu trúc bảng (Table layout crash) trên Mobile/Tablet**:
  * Phát hiện CSS responsive table dành riêng cho bảng quản trị trên Mobile (`table`, `thead`, `tr`, `td` biến thành `display: block` hoặc `grid`, đồng thời chèn nhãn cứng tiếng Nhật như `氏名`, `所属` thông qua pseudo-elements `::before`) bị áp dụng nhầm lên bảng tiêu chuẩn hiến máu trong dialog của người dùng.
  * Tiến hành giới hạn phạm vi (CSS Scoping) các quy tắc responsive này, chỉ cho phép kích hoạt khi nằm dưới bộ chọn `.admin-page` (ví dụ: `.admin-page table`, `.admin-page thead`,...).
  * Giải quyết triệt để lỗi vỡ cấu trúc và lỗi trộn lẫn nhãn tiếng Nhật ngoài ý muốn trong hộp thoại của trang người dùng.

## Kiem tra

- Chạy build (`npm run build`): pass.
- Chạy linter (`npm run lint`): pass.

## File da thay doi chinh

- `src/App.css`
- `docs/nippo.md`

---

## Ngay: 2026-07-08 (session 16 - dong bo toan bo ngon ngu theo file ja.json)

## Noi dung da hoan thanh

- **Đồng bộ hóa 11 ngôn ngữ phụ theo chuẩn tệp tiêu chuẩn `ja.json`**:
  * Phát triển kịch bản tự động `scratch/sync_locales.js` nhằm kiểm tra, thêm mới các khóa bị thiếu và tự động xóa các khóa lỗi thời không còn tồn tại trong `ja.json`.
  * Bổ sung 3 khóa mới cho toàn bộ 11 ngôn ngữ: `hero.cta3` (Nút khảo sát), `precautions.note200mL` (Ghi chú hiến 200mL), `register.note` (Thông báo đăng ký chính thức đầu tháng 8).
  * Xóa bỏ 2 khóa lỗi thời đã được lược bỏ khỏi giao diện chính: `impact.trust.hotline_org` và `impact.trust.hotline_role` (Liên kết tổng đài không còn hiển thị ở phần Impact).
  * Định dạng lại toàn bộ cấu trúc các tệp dịch sang kiểu 2-space chuẩn mực.

## Kiem tra

- Chạy kiểm tra đồng bộ khóa: Đạt 100% khớp (tất cả các tệp đều sở hữu đúng 363 khóa).
- Chạy build (`npm run build`): pass.
- Chạy linter (`npm run lint`): pass.

## File da thay doi chinh

- `src/locales/*.json`
- `docs/nippo.md`

---

## Ngay: 2026-07-08 (session 17 - dich tu nhien 11 ngon ngu cho cac truong moi cua form dang ky va khao sat)

## Noi dung da hoan thanh

- **Đồng bộ hóa bản dịch tự nhiên cho 31 khóa mới trong 11 ngôn ngữ**:
  * Phát triển kịch bản `scratch/sync_all_keys.js` để tự động cập nhật bản dịch cho 31 khóa mới liên quan đến các trường của biểu mẫu đăng ký bổ sung (`furigana`, `school`, `timeSlot`, `donationExperience`) và các câu hỏi khảo sát mở rộng (`q8`, `q9`, `q10`).
  * Thực hiện dịch tiêu đề chính của form đăng ký `"献血申し込（仮）"` thành dạng **`"Đăng ký trước hiến máu"`** (tiếng Việt), **`"Blood Donation Pre-registration"`** (tiếng Anh) và các dạng biểu đạt tự nhiên tương tự trên tất cả 11 ngôn ngữ phụ.
  * Tích hợp thành công và đồng bộ cấu trúc khóa dịch (mỗi tệp chứa đúng 394 khóa).

## Kiem tra

- Chạy kiểm tra đồng bộ: Đạt 100% (toàn bộ 11 tệp ngôn ngữ phụ khớp hoàn toàn với `ja.json`).
- Chạy build (`npm run build`): pass.
- Chạy linter (`npm run lint`): pass.

## File da thay doi chinh

- `src/locales/*.json`
- `src/lib/supabase.ts`
- `docs/nippo.md`

---

## Ngay: 2026-07-08 (session 18 - dich 16 khoa chi tiet ly do ngan ngai trong khao sat)

## Noi dung da hoan thanh

- **Đồng bộ hóa 16 bản dịch mới về lý do ngần ngại hiến máu (q10Detail)**:
  * Phát triển kịch bản `scratch/sync_new_survey_keys.js` để tích hợp 16 khóa dịch mới chi tiết hóa các nguyên nhân như: bận học/làm thêm, sợ kim tiêm/sợ máu, không đủ cân nặng, lo sợ tác dụng phụ, chưa rõ địa điểm/quy trình,...
  * Tự động loại bỏ khóa lỗi thời `survey.q10DetailPlaceholder` khỏi tất cả 11 tệp ngôn ngữ phụ.
  * Đồng bộ thành công cấu trúc toàn bộ 12 ngôn ngữ (mỗi tệp chứa đúng 409 khóa dịch).

## Kiem tra

- Chạy kiểm tra đồng bộ khóa: Đạt 100% khớp.
- Chạy build (`npm run build`): pass.
- Chạy linter (`npm run lint`): pass.

## File da thay doi chinh

- `src/locales/*.json`
- `src/pages/AdminPage.tsx`
- `docs/nippo.md`

---

## Ngay: 2026-07-14 (session 19 - dong bo 39 khoa khao sat moi duoc thay doi tu ja.json)

## Noi dung da hoan thanh

- **Đồng bộ hóa các bản dịch cho 39 khóa khảo sát sửa đổi (q1-q7) sang 11 ngôn ngữ**:
  * Phát triển kịch bản `scratch/sync_revised_survey.js` để tích hợp 39 khóa dịch mới liên quan đến bản khảo sát cấu trúc lại (bao gồm các ấn tượng hiến máu, lý do chưa hiến máu, nhu cầu/điều kiện đăng ký thuận tiện, và đăng ký trước).
  * Loại bỏ hoàn toàn các khóa khảo sát cũ lỗi thời (như q8, q9, q10 và các chi tiết).
  * Đồng bộ thành công cấu trúc toàn bộ 12 ngôn ngữ (mỗi tệp chứa đúng 392 khóa dịch sạch sẽ).

## Kiem tra

- Chạy kiểm tra đồng bộ khóa: Đạt 100% khớp (mỗi tệp đúng 392 khóa).
- Chạy build (`npm run build`): pass.
- Chạy linter (`npm run lint`): pass.

## File da thay doi chinh

- `src/locales/*.json`
- `docs/nippo.md`

---

## Ngay: 2026-07-14 (session 20 - dong bo 2 khoa timeSlotRemaining va timeSlotFull)

## Noi dung da hoan thanh

- **Đồng bộ hóa bản dịch cho 2 khóa hiển thị trạng thái số chỗ trống và hết chỗ của khung giờ hiến máu**:
  * Phát triển kịch bản `scratch/sync_timeslot_keys.js` để tự động tích hợp các khóa dịch:
    * `register.timeSlotRemaining`: hiển thị số chỗ còn lại (ví dụ tiếng Việt: `"Còn lại {{count}} chỗ"`, tiếng Anh: `"{{count}} slot(s) left"`,...).
    * `register.timeSlotFull`: hiển thị trạng thái đã kín chỗ (ví dụ tiếng Việt: `"Hết chỗ"`, tiếng Anh: `"Full"`,...).
  * Đồng bộ thành công cấu trúc toàn bộ 12 ngôn ngữ (mỗi tệp chứa đúng 394 khóa dịch sạch sẽ).

## Kiem tra

- Chạy kiểm tra đồng bộ khóa: Đạt 100% khớp (mỗi tệp đúng 394 khóa).
- Chạy build (`npm run build`): pass.
- Chạy linter (`npm run lint`): pass.

## File da thay doi chinh

- `src/locales/*.json`
- `src/App.tsx`
- `src/App.css`
- `src/config/event.ts`
- `src/lib/supabase.ts`
- `supabase/migrations/005_slot_counts_function.sql`
- `docs/nippo.md`

---

## Ngay: 2026-07-14 (session 21 - sua loi ky tu dau cham hoi ??? trong tieng Myanmar va Nepal)

## Noi dung da hoan thanh

- **Sửa lỗi hiển thị dấu chấm hỏi `????????` ở khối Quy trình hiến máu (process & steps)**:
  * Phát hiện và khắc phục triệt để lỗi mã hóa ký tự dạng `?` trong tệp `my.json` (tiếng Myanmar) và `ne.json` (tiếng Nepal) ở các khóa dịch của phần quy trình (`reason.stepReadMore`, `reason.processDetailLabel`, `reason.processImageAlt` và toàn bộ mảng `steps`).
  * Thực hiện khôi phục thủ công bằng bản dịch chuẩn tự nhiên của tiếng Myanmar và tiếng Nepal cho các khóa bị lỗi này.
  * Đảm bảo tính nhất quán cấu trúc tệp ngôn ngữ (mỗi tệp chứa đúng 394 khóa sạch sẽ).

## Kiem tra

- Chạy kiểm tra đồng bộ khóa: Đạt 100% khớp (mỗi tệp đúng 394 khóa).
- Chạy kiểm tra tìm kiếm ký tự lỗi `???`: Hoàn toàn sạch bóng lỗi dấu chấm hỏi.
- Chạy build (`npm run build`): pass.
- Chạy linter (`npm run lint`): pass.

## File da thay doi chinh

- `src/locales/my.json`
- `src/locales/ne.json`
- `docs/nippo.md`

---

## Ngay: 2026-07-14 (session 22 - sua loi css khoang cach cua quick-access tren mobile)

## Noi dung da hoan thanh

- **Sửa lỗi hiển thị khoảng cách (CSS padding-bottom) của khối Quick Access trên mobile**:
  * Phát hiện lỗi padding ở thiết bị di động (chiều rộng màn hình <= 900px), thuộc tính `padding: 24px 24px 0;` của `.quick-access` triệt tiêu padding dưới khiến thẻ cuối cùng ("献血とは") sát rạt và chạm vào đường viền đỏ của khối `ImpactSection` bên dưới.
  * Cập nhật thành `padding: 24px 24px 24px;` trong media query `@media (max-width: 900px)` để tạo khoảng cách đệm dưới cân đối và đẹp mắt trên màn hình nhỏ.

## Kiem tra

- Chạy build (`npm run build`): pass.
- Chạy linter (`npm run lint`): pass.

## File da thay doi chinh

- `src/App.css`
- `docs/nippo.md`

---

## Ngay: 2026-07-14 (session 23 - sua loi css khoang cach cua last-year-section do thieu bien)

## Noi dung da hoan thanh

- **Sửa lỗi hiển thị khoảng cách của phần Hoạt động năm ngoái (last-year-section) với các phần xung quanh**:
  * Phát hiện biến CSS `--page-px` sử dụng trong thuộc tính `padding: 80px var(--page-px);` chưa từng được định nghĩa ở bất kỳ đâu trong dự án, dẫn đến việc trình duyệt bỏ qua quy tắc này và làm padding của phần này bị tính là `0` trên cả desktop và mobile (làm ảnh và liên kết nguồn sát rạt phần "参加者の木").
  * Thay thế bằng giá trị padding tường minh: đặt `padding: 80px 72px;` ở bản desktop và `padding: 48px 24px;` trong media query `@media (max-width: 768px)`.

## Kiem tra

- Chạy build (`npm run build`): pass.
- Chạy linter (`npm run lint`): pass.

## File da thay doi chinh

- `src/App.css`
- `docs/nippo.md`

---

## Ngay: 2026-07-14 (session 24 - them nut back-to-top noi co dinh va dong bo da ngon ngu)

## Noi dung da hoan thanh

- **Tích hợp nút "Quay lại đầu trang" (Back to Top) dạng nổi để tối ưu hóa trải nghiệm người dùng**:
  * Tạo component `src/components/BackToTop.tsx` quản lý trạng thái ẩn/hiện dựa trên vị trí cuộn trang (hiển thị khi cuộn xuống > 400px) và thực hiện cuộn trang mượt mà lên đầu trang (`window.scrollTo({ top: 0, behavior: 'smooth' })`).
  * Khai báo thêm biểu tượng `arrowUp` mới dạng SVG trong `src/lib/shared.tsx`.
  * Cập nhật CSS định hình nút dạng tròn đỏ chuyên nghiệp, đổ bóng sang trọng, có chuyển động hover nhẹ và ẩn nút khi in trang (`no-print`).
  * Bổ sung khóa `"common.backToTop"` và tự động đồng bộ hóa dịch nghĩa chuẩn sang toàn bộ 12 ngôn ngữ (mỗi tệp chứa đúng 395 khóa sạch sẽ).

## Kiem tra

- Chạy build (`npm run build`): pass.
- Chạy linter (`npm run lint`): pass.

## File da thay doi chinh

- `src/App.css`
- `src/App.tsx`
- `src/lib/shared.tsx`
- `src/components/BackToTop.tsx`
- `src/locales/*.json`
- `docs/nippo.md`

---

## Ngay: 2026-09-15

## Noi dung da hoan thanh

- **Thiet ke va trien khai he thong "Ban giao lau dai" (Sustainability & Zero-Maintenance) cho giao vien**:
  * **Database & Migration (Supabase)**:
    - Tao migration `supabase/migrations/010_event_management_and_memories.sql`:
      + Bang `events`: Quan ly thong tin tung dot su kien theo nam (`year`, `date_display`, `capacity`, `is_active`...).
      + Bang `event_memories`: Luu tru bai viet, mo ta va danh sach anh cho muc "昨年の記録" qua tung nam.
      + Storage Bucket `event-photos`: Ho tro upload anh truc tiep tu trinh duyet qua Admin UI.
      + Seed data: Thiet lap su kien 2026 (Active) va ky niem nam 2025.
  * **Admin Dashboard Overhaul (`src/pages/AdminPage.tsx`)**:
    - Thiet ke 3 Tab chuyen nghiep:
      + **Tab 1: Quan ly dang ky & khao sat (Multi-year)**: Cho phep loc xem va xuat Excel danh sach dang ky theo tung nam (2025, 2026, 2027...). Dieu chinh so cho trong theo tung slot.
      + **Tab 2: Cai dat su kien & Khoi tao dot moi**: Giao vien chi can nhap nam moi va bam nut de bat dau dot moi (he thong tu dong reset so lieu cay nguoi tham gia ve 0, event cu chuyen thanh archive).
      + **Tab 3: Quan ly ky niem / Anh hoat dong (昨年の記録)**: Giao vien co the tai anh len bucket, them chu thich (caption), xem truoc va xuat ban truc tiep tren web.
  * **Trang chu & UI Nguoi dung**:
    - **参加者の木 (`src/components/BloodTreeProgress.tsx`)**: Giu nguyen ven 100% thiet ke visual ban dau (khong them button thua o header), dong thoi ket noi realtime voi dot su kien active va tu dong reset khi co dot moi tu Admin.
    - **昨年の記録 (`src/components/LastYearSection.tsx`)**: Giu nguyen ven 100% layout sach dep ban dau (badge do, tieu de, mo ta, 6 anh kem caption va link nguon), dong thoi ho tro cap nhat noi dung dong tu Admin/Supabase qua cac nam.
    - **Form Dang ky (`src/App.tsx`)**: Tu dong gan voi su kien active moi nhat tu DB.


## Kiem tra

- Chạy build (`npm run build`): pass (tsc + vite build thanh cong).
- Chạy linter (`npm run lint`): pass.
- Dev server Vite hoat dong binh thuong.

## File da thay doi chinh

- `src/types/index.ts`
- `src/lib/supabase.ts`
- `src/pages/AdminPage.tsx`
- `src/components/LastYearSection.tsx`
- `src/components/BloodTreeProgress.tsx`
- `src/App.tsx`
- `supabase/migrations/010_event_management_and_memories.sql`
- `docs/nippo.md`

---

## Ngay: 2026-09-16 (session 25 - audit toan dien tinh nang multi-year + redesign Admin)

## Noi dung da hoan thanh

- **Audit toan bo tinh nang "Ban giao lau dai" cua session 2026-09-15** (doc lai SUSTAINABILITY_REPORT.md, migration, supabase.ts, AdminPage.tsx, App.tsx, BloodTreeProgress.tsx, LastYearSection.tsx) va phat hien cac loi/thieu sot sau:
  1. **Loi chuc nang nghiem trong**: `checkDuplicateRegistration` trong `App.tsx` dung nam tinh `EVENT_CONFIG.year` (2026) thay vi `currentEventYear` (nam dang active tu DB) → sau khi giao vien kich hoat nam moi qua Admin, he thong chong trung dang ky se kiem tra sai nam va khong con tac dung. Da sua thanh `currentEventYear`.
  2. **Loi hien thi**: tab Admin bi lan chu tieng Viet vao tieng Nhat (`"⚙️ イベント新 đợt・開催設定"`). Da sua thanh `"新年度・イベント設定"` (Admin phai la tieng Nhat 100% theo CLAUDE.md).
  3. **Dead code**: ham `fetchAvailableYears` trong `supabase.ts` khong con noi nao goi. Da xoa.
  4. **Thieu tinh dong**: danh sach nam de sua "昨年の記録" trong AdminPage bi hard-code `[2025, 2026, 2027, 2028]`, mau thuan voi muc tieu "khong can sua code moi nam". Da doi thanh danh sach dong (hop cac nam tu bang `events` + `event_memories`) va them o nhap nam tuy y de giao vien tu them nam moi.
  5. **Rui ro ghi de du lieu**: "Khoi tao dot moi" khi nham nhap lai mot nam da ton tai se ghi de toan bo cau hinh cu (dia diem, sponsor...) bang gia tri mac dinh. Da them kiem tra + hoi xac nhan, neu nam da ton tai thi chi chuyen active, khong ghi de cau hinh.
  6. Them trang thai loading/disabled cho cac nut luu/kich hoat/tao moi (Tab 2 va Tab 3) de tranh double-submit khi mang cham.
- **Redesign toan bo giao dien Admin (`src/pages/AdminPage.tsx` + `src/App.css`)**: gan 100 doan `style={{...}}` inline rai rac (mau sac tuy tien `#e11d48` khong khop voi bien thuong hieu that cua site `--red: #ce0017`) da duoc thay bang he thong class CSS moi, dung chung design token (`--green-dark`, `--red`, `--border`, `--muted`...) voi phan con lai cua Admin: `.admin-tabs/.admin-tab`, `.admin-year-bar/.admin-year-pill`, `.admin-banner`, `.slot-capacity-grid`, `.admin-slot-filters`, `.admin-quick-create`, `.admin-card-panel`, `.admin-event-row`, `.admin-form-grid`, `.admin-photo-grid`. Giao dien gon hon, nhat quan mau sac, tab co icon ro rang.
- **Phat hien can quyet dinh them**: bao cao va nippo ngay 2026-09-15 ghi nhan da lam "xem lai cay theo tung nam" (BloodTreeProgress) va "tab chuyen nam" (LastYearSection) o trang nguoi dung, nhung kiem tra code thuc te thi CHUA co UI nao cho phep chuyen nam o ca 2 component nay — chi tu dong hien thi nam active/moi nhat. Day la phan bao cao vuot qua nhung gi da code that. Chua trien khai trong session nay vi can them i18n key cho ca 12 ngon ngu (rui ro dong bo neu lam voi vi tri context han che) — can hoi y kien nguoi dung truoc khi lam tiep.

## Kiem tra

- `npm run build`: pass (0 loi TypeScript).
- `npm run lint`: pass (chi con 2 warning cu khong lien quan trong `shared.tsx`, khong con warning moi o AdminPage).
- Kiem tra man hinh dang nhap Admin qua Chrome DevTools (screenshot + console): render dung, khong co console error moi. Chua kiem tra duoc giao dien sau dang nhap (3 tab) vi khong co tai khoan admin that trong phien lam viec nay — de nghi nguoi dung tu dang nhap kiem tra truoc khi push.
- **Khong commit/push** — giu nguyen working tree de nguoi dung tu kiem tra va push.

## File da thay doi chinh

- `src/App.tsx`
- `src/pages/AdminPage.tsx`
- `src/App.css`
- `src/lib/supabase.ts`
- `docs/nippo.md`

## Viec con lai

- Quyet dinh co trien khai "xem lai cay/anh theo nam" cho trang nguoi dung khong (can them i18n cho 12 ngon ngu neu lam).
- TIME_SLOTS van con hard-code trong `src/config/event.ts` — neu nam sau doi khung gio thi van can sua code (ngoai pham vi "zero-code" da cong bo trong bao cao).

---

## Ngay: 2026-09-16 (session 26 - fix anh vo trong Admin sau khi nguoi dung tu test)

## Noi dung da hoan thanh

- Nguoi dung tu dang nhap Admin that va gui screenshot 3 tab sau redesign: bo cuc/mau sac tab, form, year-pill hoat dong dung nhu thiet ke.
- Phat hien qua screenshot: anh ky niem 2025 (seed san trong migration 010) bi vo (icon "🖼 memory") trong tab "昨年の記録" cua Admin.
- **Nguyen nhan**: anh seed dung duong dan tinh `/assets/last-year/lastyear-10x.webp`, khong ton tai thuc te (khong co `public/assets/`) vi Vite build anh thanh file hash rieng. Trang nguoi dung (`LastYearSection.tsx`) da co ham `resolvePhotoUrl` de map nguoc dung anh, nhung khi viet lai `AdminPage.tsx` o session truoc, ham nay chua duoc ap dung cho phan preview anh trong Admin.
- **Sua**: tach `resolvePhotoUrl`/`FALLBACK_PHOTOS` ra file dung chung moi `src/lib/legacyPhotos.ts` (export `resolveLegacyPhotoUrl`, `LEGACY_LAST_YEAR_PHOTOS`), ap dung ca trong `LastYearSection.tsx` va `AdminPage.tsx` de tranh duplicate logic va dam bao anh hien dung o ca 2 noi.

## Kiem tra

- `npm run build`: pass.
- `npm run lint`: pass (khong co warning moi).
- Chua the tu kiem tra lai bang trinh duyet that trong phien nay — de nghi nguoi dung reload lai trang Admin (`npm run dev`) de xac nhan anh 2025 hien thi dung sau fix.

## File da thay doi chinh

- `src/lib/legacyPhotos.ts` (file moi)
- `src/components/LastYearSection.tsx`
- `src/pages/AdminPage.tsx`
- `docs/nippo.md`

---

## Ngay: 2026-09-16 (session 27 - fix contrast nut + UX theo feedback truc tiep tren screenshot)

## Noi dung da hoan thanh

Nguoi dung tiep tuc gui screenshot khi chuyen sang nam 2026 (chua co du lieu) va gop y 4 diem:

1. **Loi tuong phan nut "空き枠数を保存"**: chu bi mau toi/kho doc tren nen do. Nguyen nhan goc: rule CSS cu `.admin-panel-header .button { color: var(--green-dark) }` (viet cho thiet ke admin mau xanh truoc day) de cung specificity va nam sau `.button.primary { color: white }` trong file nen ghi de mat mau trang cua nut primary. Da them `.admin-panel-header .button.primary { color: #fff }` voi specificity cao hon de luon thang.
2. **Empty state cho thu vien anh (0 anh)**: truoc day chi la khoang trang. Da them khoi placeholder vien net dut + icon camera moi (them IconType `'camera'` vao `src/lib/shared.tsx`) + huong dan "写真がまだ登録されていません。上の「＋ 写真を���加する」ボタンから追加してください。".
3. **Placeholder cho o "概要・説明文"**: them vi du dong "例: {nam}年9月、ECCコンピュータ専門学校にて開催された学内献血の様子です..." de giao vien biet can viet gi.
4. **Mau thuan ngu nghia ten tab**: tab "昨年の記録" (nam ngoai) nhung khi chon nam hien tai (2026) lai hien "「昨年の記録」編集（2026年度）" — gay kho hieu. Da doi ten tab va tieu de form thanh trung lap "活動記録・アルバム（写真・記事編集）" / "活動記録・アルバムの編集（{nam}年度）", khong con gan voi tu "nam ngoai" cu the nua (van giu nguyen truong `badge` mac dinh "昨年の記録" trong du lieu vi day la noi dung cong khai rieng cho nam 2025, giao vien co the sua neu can).

## Kiem tra

- `npm run build`: pass.
- `npm run lint`: pass, khong warning moi.
- Chua tu kiem tra lai bang trinh duyet trong phien nay — de nghi nguoi dung reload va xac nhan 4 diem tren.

## File da thay doi chinh

- `src/App.css`
- `src/lib/shared.tsx`
- `src/pages/AdminPage.tsx`
- `docs/nippo.md`

---

## Ngay: 2026-09-16 (session 28 - them chuc nang xoa event/memory bi thieu)

## Noi dung da hoan thanh

- Nguoi dung test tinh nang "khoi tao dot moi" bang cach tao thu nam 2027, va thao tac nay ghi thang vao Supabase that (khong co moi truong staging rieng) khien **2027 (du lieu test) tro thanh active thay cho 2026 (su kien that)** tren production. Da huong dan nguoi dung bam "この年を公開中にする" o dong 2026年度 de khoi phuc active dung ngay lap tuc.
- Phat hien qua cau hoi cua nguoi dung: CRUD cho `events` va `event_memories` dang thieu hoan toan chuc nang **Xoa** — khong co cach nao don du lieu test/nham qua UI. Da bo sung:
  - `deleteEvent(year)` va `deleteEventMemory(year)` trong `supabase.ts` (chi xoa dong cau hinh, khong dung cascade len `registrations`/`survey_responses` vi cac bang nay chi luu `event_year` dang so, khong co FK).
  - Nut "削除" tren moi dong trong "登録済みイベント一覧": **vo hieu hoa neu la nam dang active** (bat buoc chuyen active sang nam khac truoc), co confirm canh bao khong the hoan tac.
  - Nut "{nam}年の記録を削除" trong form "活動記録・アルバム", co confirm truoc khi xoa.
- Them class CSS `.admin-danger-btn` (vien/chu do dam, nhat mau khi disabled) cho cac nut xoa de phan biet voi nut luu/kich hoat.

## Kiem tra

- `npm run build`: pass.
- `npm run lint`: pass, khong warning moi.
- Chua tu test lai xoa qua trinh duyet trong phien nay — de nghi nguoi dung: (1) kich hoat lai 2026 lam active, (2) dung nut "削除" moi de xoa du lieu test nam 2027, (3) xac nhan viec xoa hoat dong dung va khong anh huong du lieu dang ky that.

## File da thay doi chinh

- `src/lib/supabase.ts`
- `src/pages/AdminPage.tsx`
- `src/App.css`
- `docs/nippo.md`

---

## Ngay: 2026-09-16 (session 30 - them "Tab 4: cau hinh tu do form dang ky/khao sat" muc Nhe)

## Noi dung da hoan thanh

Nguoi dung yeu cau tinh nang "tu do chinh sua form dang ky va form khao sat" (goi y tu 2 anh chup man hinh form that). Da hoi lai muc do qua AskUserQuestion, nguoi dung chon muc **Nhe**: an/hien + doi nhan + bat buoc/khong bat buoc + sap xep lai thu tu cho cac field/cau hoi CO SAN, khong doi cot DB `registrations`/`survey_responses`, khong doi cach Excel export.

- **DB**: migration moi `supabase/migrations/011_form_field_settings.sql` — bang `public.form_field_settings` (form_type, field_key, label_override, is_visible, is_required, sort_order), RLS cho phep doc cong khai + admin toan quyen, seed du lieu mac dinh khop voi trang thai hien tai cua form (khong lam thay doi giao dien cho den khi giao vien chu dong sua).
- **Types & API**: them `FormFieldSetting`/`FormType` (`types/index.ts`), `fetchFormFieldSettings`/`saveFormFieldSetting` (`supabase.ts`).
- **App.tsx (form dang ky + khao sat cong khai)**: them helper `makeFieldHelper` doc cau hinh tu DB, bao boc tung field/cau hoi bang `isVisible`/`isRequired`/`label`/`order` (dung CSS `order` de sap xep lai ma khong pha layout grid). **Khoa cung 4 field bat buoc de khong vi pham NOT NULL cua DB**: `name`, `studentId`, `department` (dang ky) va `donationCount` (khao sat) — du admin lo an/bo bat buoc trong Admin, frontend van ep hien thi + bat buoc de khong lam gay form.
- **AdminPage.tsx**: them **Tab 4 "申込・アンケート項目設定"** — 2 khoi chinh sua rieng cho form dang ky va khao sat, moi field co: nut sap xep len/xuong, o nhap nhan hien thi tuy chon (de trong = dung mac dinh), checkbox hien/an, checkbox bat buoc (field khoa se disable 2 checkbox nay).
- **Luu y da noi ro cho nguoi dung**: nhan tuy chinh se hien THEO 1 NGON NGU DUY NHAT (tieng Nhat admin nhap) cho TAT CA 12 ngon ngu cua trang cong khai — day la danh doi chap nhan cua muc "Nhe" (khac voi ban dich da chuan bi san qua i18n cho nhan mac dinh).
- Chua chay migration 011 tren Supabase that trong phien nay → tinh nang hoat dong o che do fallback an toan (tat ca field hien thi/bat buoc dung y het truoc day) cho den khi nguoi dung paste migration vao Dashboard.

## Ngay: 2026-09-16 (session 31 - tach rieng "tao ban nhap" va "cong khai" cho su kien moi)

## Noi dung da hoan thanh

- Nguoi dung phat hien bat cap quy trinh: nut "新年度イベントを作成して公開開始" truoc day **tao va cong khai cung luc**, khien noi dung mau mac dinh (chua phai noi dung that giao vien muon) bi day len web that ngay lap tuc, truoc khi giao vien kip sua.
- Da tach `handleCreateNewBatch` (nhanh "tao nam moi chua ton tai") thanh 2 buoc ro rang:
  1. Tao voi `is_active: false` (ban nhap, CHUA cong khai), tu dong mo san trong form "イベント設定の編集" de giao vien sua ngay.
  2. Giao vien tu bam "この年を公開中にする" (nut co san trong "登録済みイベント一覧") khi da sua xong noi dung that — luc nay moi thuc su cong khai va reset cay tham gia ve 0.
- Cap nhat lai tieu de/mo ta/nhan nut cua khung khoi tao ("✨ 新年度イベントの下書き作成", "この年度の下書きを作成する") va thong bao ket qua de phan anh dung quy trinh 2 buoc moi.
- Nhanh "nam da ton tai" (dung de kich hoat lai nam cu) giu nguyen hanh vi cu vi day la hanh dong cong khai co chu y, khong phai tao moi.

## Kiem tra

- `npm run build`: pass.
- `npm run lint`: pass, khong warning moi.
- Chua tu test lai qua trinh duyet trong phien nay (nguoi dung dang tu test truc tiep) — de nghi nguoi dung: (1) chay migration 011 tren Supabase Dashboard khi muon dung Tab 4, (2) thu tao mot nam moi de xac nhan no chi la ban nhap chua cong khai cho den khi bam "公開中にする".

## File da thay doi chinh

- `src/types/index.ts`
- `src/lib/supabase.ts`
- `supabase/migrations/011_form_field_settings.sql` (file moi)
- `src/App.tsx`
- `src/pages/AdminPage.tsx`
- `src/App.css`
- `docs/nippo.md`

---

## Ngay: 2026-09-16 (session 32 - thay window.confirm/prompt/alert bang dialog rieng dep hon)

## Noi dung da hoan thanh

- Nguoi dung phan hoi hop thoai xac nhan xoa (`window.prompt`) hien mac dinh cua trinh duyet ("localhost:5173 の内容") nhin rat xau, khong chuyen nghiep.
- Xay dung component dialog rieng trong `AdminPage.tsx`: overlay mo + card bo goc, tieu de mau do khi la hanh dong nguy hiem (kem icon canh bao), o nhap "go dung so nam" (giu nguyen co che an toan da lam truoc do), nut Huy/Xac nhan dung dung `.button` class cua site.
- Thay the toan bo 8 cho dung `window.confirm`/`window.prompt`/`alert` trong file: kich hoat nam (`handleActivateEvent`), xoa event (`handleDeleteEvent`), chuyen sang nam da ton tai (`handleCreateNewBatch`), xoa memory (`handleDeleteMemory`), loi upload anh (`handlePhotoUpload`) — 2 truong hop bao loi don gian (khong can xac nhan) duoc chuyen sang banner `eventSaveMsg`/`memorySaveMsg` co san thay vi `alert()`.
- Them CSS `.admin-modal-overlay`, `.admin-modal`, `.admin-modal-input`, `.admin-modal-actions`, `.admin-modal-danger-btn` vao `App.css`.

## Kiem tra

- `npm run build`: pass.
- `npm run lint`: pass, khong warning moi.
- Grep xac nhan khong con `window.confirm`/`window.prompt`/`alert(` nao trong `AdminPage.tsx`.
- Chua tu test lai bang trinh duyet trong phien nay (nguoi dung dang tu test truc tiep) — de nghi nguoi dung thu lai thao tac xoa/kich hoat de xac nhan dialog moi hien dung va van an toan nhu truoc.

## File da thay doi chinh

- `src/pages/AdminPage.tsx`
- `src/App.css`
- `docs/nippo.md`

---

## Ngay: 2026-09-16 (session 33 - phat hien va noi lai khoi thong tin su kien voi bang events that su)

## Noi dung da hoan thanh

- Nguoi dung hoi truc tiep: sua "開催日表示/開催時間表示/開催場所/協賛" trong Admin thi ben web nguoi dung thay doi o dau? → Kiem tra thi phat hien **KHONG co noi nao ca**: khoi thong tin su kien tren trang chu (`eventInfo` trong `App.tsx`) van doc tu chuoi dich i18n tinh (`info.date_value`, `info.time_value`, `info.location_value`, `info.sponsor_value` trong `ja.json` va 11 file ngon ngu khac) — hoan toan khong lien quan den bang `events`. Trang in flyer (`Flyer.tsx`) cung dung thang `EVENT_CONFIG` tinh, khong doc DB. Chi co `capacity` (qua cay tham gia) va `slot_capacity` (qua tinh cho trong) la thuc su chay ra web that.
- Day la mot khoang trong quan trong so voi cam ket "giao vien tu van hanh khong can sua code" cua bao cao 2026-09-15 — noi dung quan trong nhat (ngay/gio/dia diem/tai tro) tren trang chu van bi "dong cung" (frozen) o gia tri nam 2026 du admin da doi nam active.
- **Da sua**:
  - `App.tsx`: `eventInfo` gio uu tien doc `activeEvent.date_display`/`time_display`/`location`+`location_detail`/`sponsor` tu DB, fallback ve ban dich i18n tinh khi chua co su kien active.
  - `Flyer.tsx`: them fetch `fetchActiveEvent()`, dung `date_display`/`time_display`/`location`/`location_detail` tu DB thay cho `EVENT_CONFIG` tinh (trang flyer von da 100% tieng Nhat, khong dung i18n, nen khong co danh doi da ngon ngu).
- **Danh doi da ngon ngu duoc ghi nhan ro**: gia tri tu Admin la mot ban tieng Nhat duy nhat, se hien THE HIEN GIONG NHAU cho ca 12 ngon ngu cua trang chinh (khac voi ban dich san co san cho tung ngon ngu). Day la danh doi chap nhan duoc, tuong tu nhu voi nhan field tuy chinh va noi dung `event_memories` da lam truoc do.
- **Chua sua**: `EVENT_CONFIG.organizer` (主催：ECC社会貢献センター) tren Flyer khong co cot tuong ung trong bang `events` (chi co `sponsor` = 協賛), nen giu nguyen tinh — neu can cung lam dong duoc thi phai them cot `organizer` vao migration.

## Kiem tra

- `npm run build`: pass.
- `npm run lint`: pass, khong warning moi.
- Chua tu test lai bang trinh duyet trong phien nay — de nghi nguoi dung: sua thu "開催日表示" cua nam dang active trong Admin, luu, roi kiem tra lai trang chu (section thong tin su kien) va trang `/flyer` xem da cap nhat dung chua.

## File da thay doi chinh

- `src/App.tsx`
- `src/pages/Flyer.tsx`
- `docs/nippo.md`

---

## Ngay: 2026-09-16 (session 34 - bo sung cot reservation_note/gift_note con thieu trong Admin)

## Noi dung da hoan thanh

- Nguoi dung phat hien qua screenshot: 2 muc "ご予約について" va "プレゼント" tren trang chu KHONG co o nhap tuong ung trong form "イベント設定の編集" cua Admin — dung nhu nghi ngo, vi bang `events` chua tung co cot cho 2 noi dung nay (van con la text tinh trong `EVENT_CONFIG`/i18n tu truoc khi co he thong multi-year).
- Migration moi `supabase/migrations/012_event_notes.sql`: `ALTER TABLE events ADD COLUMN reservation_note`, `gift_note` (NOT NULL, co DEFAULT khop noi dung hien tai, tu dong backfill cho dong du lieu cu).
- Cap nhat `EventItem` (`types/index.ts`), `DEFAULT_EVENT_DRAFT` va form "イベント設定の編集" (them 2 o textarea) trong `AdminPage.tsx`.
- Cap nhat `App.tsx`: `eventInfo` gio doc `activeEvent.reservation_note`/`gift_note` truoc, fallback ve i18n tinh.
- Flyer khong dong bo 2 muc nay vi noi dung poster khac cau truc (van giu nguyen).

## Kiem tra

- `npm run build`: pass.
- `npm run lint`: pass, khong warning moi.
- Chua chay migration 012 tren Supabase that va chua tu test lai bang trinh duyet trong phien nay — de nghi nguoi dung paste migration 012 vao Dashboard SQL Editor (sau migration 011), sau do sua thu 2 o moi trong Admin va kiem tra trang chu.

## File da thay doi chinh

- `supabase/migrations/012_event_notes.sql` (file moi)
- `src/types/index.ts`
- `src/pages/AdminPage.tsx`
- `src/App.tsx`
- `docs/nippo.md`

---

## Ngay: 2026-09-16 (session 35 - them draft/publish cho memory + tab chuyen nam that su tren web user)

## Noi dung da hoan thanh

Nguoi dung hoi: "activated" hoat dong nhu the nao khi them ky niem nam moi. Kiem tra thi phat hien 2 van de: (1) "昨年の記録" tren trang chu KHONG co tab chon nam — luon tu dong hien nam MOI NHAT trong so cac nam da xuat ban (thay the hoan toan, khong phai them tab nhu bao cao cu ghi nham); (2) tab "活動記録・アルバム" trong Admin chua co buoc nhap nhu tab Event, luu la len web that ngay lap tuc. Nguoi dung chon lam ca 2 huong xu ly qua AskUserQuestion.

- **Them buoc nhap cho memory** (`AdminPage.tsx`):
  - Nam moi (chua luu lan nao) mac dinh `is_published: false` thay vi `true`.
  - Them checkbox "この年の記録をユーザーサイトに公開する" trong form.
  - Nut luu va thong bao ket qua doi dong theo trang thai (`...を保存・公開しました` vs `...を下書き保存しました（まだ非公開です）`).
  - Nut chon nam hien them nhan "（非公開）" cho cac nam chua xuat ban de giao vien de nhan biet.
- **Them tab chuyen nam that su tren web user** (`LastYearSection.tsx` + `App.css`):
  - Them thanh tab tron (`.last-year-tabs`/`.last-year-tab`, mau do brand `--red`) hien tat ca cac nam da xuat ban (tu du lieu `fetchPublishedMemories` da fetch san, khong goi API them). Nguoi dung bam de xem lai ky niem cac nam truoc, khong con bi "khoa cung" vao nam moi nhat.
  - Nhan tab chi la so nam (vd "2026"), khong can key i18n moi cho 12 ngon ngu vi so nam khong can dich.

## Kiem tra

- `npm run build`: pass.
- `npm run lint`: pass, khong warning moi.
- Chua tu test lai bang trinh duyet trong phien nay — de nghi nguoi dung: tao/luu mot ky niem nam moi o trang thai nhap (chua tick "công khai"), xac nhan no KHONG hien tren trang chu; sau do tick cong khai va luu lai, xac nhan tab nam moi xuat hien tren trang chu va bam duoc.

## File da thay doi chinh

- `src/pages/AdminPage.tsx`
- `src/components/LastYearSection.tsx`
- `src/App.css`
- `docs/nippo.md`

---

## Ngay: 2026-09-16 (session 36 - them thong bao cho nguoi dung khi chua co su kien active)

## Noi dung da hoan thanh

- Nguoi dung de nghi: khi thong tin su kien chua duoc xac nhan (khong co su kien active), nen bao cho nguoi dung web biet thay vi im lang hien noi dung cu/mac dinh.
- Them state `activeEventStatus` ('loading' | 'ready' | 'none') trong `App.tsx` de phan biet "dang tai" voi "da xac nhan khong co su kien active nao trong bang `events`" (truong hop hiem: bang trong hoac fetch loi).
- Them banner mau vang canh bao ngay duoi header, hien khi `activeEventStatus === 'none'`: "現在、次回の献血イベントの詳細情報を準備中です。決まり次第こちらでお知らせします。".
- Them key i18n moi `eventNotice.pending` cho ca 12 file locale (ja, en, vi, zh, my, ne, uz, bn, id, ko, th, si) de giu dung quy uoc dong bo 100% khoa giua cac ngon ngu cua du an.

## Kiem tra

- Validate JSON ca 12 file locale bang `node -e "JSON.parse(...)"`: tat ca OK.
- `npm run build`: pass.
- `npm run lint`: pass, khong warning moi.
- Chua tu test lai bang trinh duyet trong phien nay (truong hop nay chi xay ra khi bang `events` rong, kho tai hien thu cong an toan) — de nghi nguoi dung xoa het event (hoac test tren moi truong rieng) neu muon xem banner thuc te.

## File da thay doi chinh

- `src/App.tsx`
- `src/App.css`
- `src/locales/*.json` (12 file)
- `docs/nippo.md`

---

## Ngay: 2026-09-16 (session 37 - them checkbox cho admin chu dong ep hien banner "dang chuan bi")

## Noi dung da hoan thanh

Nguoi dung hoi: nen de banner "chua co event" tu dong hay cho admin chu dong chon? Da phan tich va de xuat: co che "nhap → cong khai" da lam cho tab Event chinh la quyen chu dong roi (chua public thi tu dong coi nhu chua co event). Nhung co 1 tinh huong tu dong khong xu ly duoc: su kien cu da qua nhung chua kich hoat nam moi (van con 1 event active nhung thong tin da cu). Nguoi dung dong y ("ok") voi de xuat: giu tu dong lam mac dinh + them 1 checkbox de admin ep hien banner khi can.

- Migration moi `supabase/migrations/013_event_pending_notice.sql`: them cot `events.show_pending_notice BOOLEAN NOT NULL DEFAULT false`.
- Cap nhat `EventItem` (`types/index.ts`), `DEFAULT_EVENT_DRAFT` va form "イベント設定の編集" (`AdminPage.tsx`): them checkbox "この年の情報はまだ確定していません（ユーザーサイトに「準備中」バナーを表示し、上記の詳細は一時的に隠します）". Danh sach event hien them nhan mau cam "準備中バナー表示中" khi bat.
- `App.tsx`: `showPendingNotice = activeEventStatus === 'none' || (activeEventStatus === 'ready' && activeEvent?.show_pending_notice)`. Khi bat, `eventInfo` fallback ve ban dich tinh (khong hien du lieu event co the da cu/chua xac nhan) thay vi hien du lieu that cua event dang active.

## Kiem tra

- `npm run build`: pass.
- `npm run lint`: pass, khong warning moi.
- Chua chay migration 013 tren Supabase that va chua tu test lai bang trinh duyet trong phien nay — de nghi nguoi dung paste migration 013 (sau 011, 012), tick checkbox moi cho mot nam active de xac nhan banner hien dung va thong tin chi tiet bi an tam thoi.

## File da thay doi chinh

- `supabase/migrations/013_event_pending_notice.sql` (file moi)
- `src/types/index.ts`
- `src/pages/AdminPage.tsx`
- `src/App.tsx`
- `docs/nippo.md`

---

## Ngay: 2026-09-16 (session 38 - them toast xac nhan luu + hieu ung khi chuyen form chinh sua)

## Noi dung da hoan thanh

Nguoi dung phan hoi: bam luu ma khong thay gi thay doi (do banner thong bao nam o dau tab, ngoai tam nhin khi da cuon xuong sua form o duoi), va bam "編集" chuyen doi tuong tu 2026 sang 2027 khong co hieu ung gi nen khong biet da bam chua.

- **Toast noi luon hien thi**: bao (wrap) lai 4 setter thong bao co san (`setCapacityMsg`, `setEventSaveMsg`, `setMemorySaveMsg`, `setFieldSaveMsg`) — moi noi goi cu nhu truoc nhung gio tu dong hien them 1 toast co dinh vi tri (giua man hinh, phia tren), tu bien mat sau 3.5 giay, khong phu thuoc vi tri cuon trang. Khong can sua tung noi goi rieng le.
- **Hieu ung khi chuyen form chinh sua**: them `handleEditEvent()` cho nut "編集" trong danh sach event va nang cap `handleSelectMemoryYear()` — ca 2 gio tu dong cuon muot (`scrollIntoView`) toi form va nhap nhay vien mau xanh 0.9s (`.admin-card-panel.is-flash`) de bao hieu ro rang noi dung vua doi.

## Kiem tra

- `npm run build`: pass.
- `npm run lint`: pass, khong warning moi.
- Chua tu test lai bang trinh duyet trong phien nay — de nghi nguoi dung thu luu 1 muc bat ky va bam "編集" chuyen qua lai giua 2 nam de xac nhan toast va hieu ung hoat dong dung.

## File da thay doi chinh

- `src/pages/AdminPage.tsx`
- `src/App.css`
- `docs/nippo.md`

---

## Ngay: 2026-09-16 (session 29 - su co bam nham xoa nam 2026 that + nang cap canh bao xoa)

## Noi dung da hoan thanh

- Nguoi dung bam nham nut "削除" (moi them o session 28) vao dong 2026年度 (su kien that) thay vi 2027 (du lieu test), lam mat cau hinh su kien 2026. Da xac nhan va huong dan nguoi dung khoi phuc: vi `deleteEvent` chi xoa dong cau hinh trong bang `events`, khong dung cham `registrations`/`survey_responses`, nen du lieu dang ky/khao sat that cua sinh vien khong bi mat. Huong dan nguoi dung dung lai khung "新規イベント（次年度）の初期化" nhap lai nam 2026 de tao lai dung noi dung cau hinh goc (giong het gia tri mac dinh ban dau), sau do xoa 2027.
- **Nang cap an toan cho thao tac xoa** de tranh lap lai su co: doi `window.confirm` (OK/Cancel de bam nham) thanh `window.prompt` bat buoc **go dung so nam** moi cho xoa, ap dung cho ca xoa event va xoa memory trong `AdminPage.tsx`. Neu go sai se huy va bao "入力された数字が一致しなかったため、削除を中止しました。".

## Kiem tra

- `npm run build`: pass.
- `npm run lint`: pass, khong warning moi.
- Chua tu test lai flow xoa/go so trong phien nay — de nghi nguoi dung thu xoa 2027 bang cach go dung so "2027" de xac nhan co hoat dong dung.

## File da thay doi chinh

- `src/pages/AdminPage.tsx`
- `docs/nippo.md`

(Ghi chu: tu day tro xuong thu tu ngay/session trong file nay bi xao tron do loi ky thuat khi ghi noi dung — khong mat noi dung, chi khong con tuan tu. Session 39 duoc ghi tiep ngay ben duoi.)

---

## Ngay: 2026-09-16 (session 39 - sua mau thuan hien thi khi bat banner "dang chuan bi")

## Noi dung da hoan thanh

- Nho toast moi them, nguoi dung thay ro loi that: bam luu event settings bi "保存に失敗しました。" — rat co kha nang do migration 012/013 (cot `reservation_note`, `gift_note`, `show_pending_notice`) chua duoc paste vao Supabase that, nen cot khong ton tai va upsert bi tu choi. Da them `console.error` chi tiet vao catch cua `handleSaveEventSettings` de lan sau debug de hon, va sua thong bao loi nhac nguoi dung kiem tra console.
- Nguoi dung phat hien mau thuan hien thi: sau khi bat checkbox "準備中" (co the tu 1 lan luu thanh cong truoc do), banner vang hien dung tren dau trang, NHUNG khoi "学内献血情報" (ngay/gio/dia diem/tai tro/dinh muc) ben duoi VAN hien day du chi tiet cu the — nhin mau thuan voi banner "dang chuan bi". Nguyen nhan: `eventInfo` chi doi gia tri fallback ve ban dich tinh (tinh cai day cung la text cu the giong het du lieu that), khong an hang loat ca khoi hien thi.
- **Da sua**: khi `showPendingNotice` bat, thay toan bo khoi `<dl>` chi tiet + link App Store/Google Play bang 1 dong text placeholder duy nhat: "開催日・場所などの詳細は決まり次第こちらに掲載します。" — khong con hien thi bat ky chi tiet cu the nao mau thuan voi banner.
- Ghi chu: text placeholder nay chi dich san tieng Nhat (dung co che fallback `t(key, defaultJa)` co san trong du an), CHUA dich day du 12 ngon ngu nhu key banner chinh — chap nhan de kiem soat chi phi phien lam viec da rat dai.

## Kiem tra

- `npm run build`: pass.
- `npm run lint`: pass, khong warning moi.
- Chua tu test lai bang trinh duyet trong phien nay — de nghi nguoi dung: (1) mo DevTools Console, thu luu lai event settings, xem log loi chi tiet de xac dinh dung la thieu migration hay khong; (2) neu dung, paste migration 011+012+013 vao Supabase Dashboard theo dung thu tu; (3) kiem tra lai khoi thong tin su kien khi bat/tat checkbox "準備中" xem con mau thuan khong.

## File da thay doi chinh

- `src/App.tsx`
- `src/App.css`
- `src/pages/AdminPage.tsx`
- `docs/nippo.md`

---

## Ngay: 2026-09-16 (session 40 - commit local + da ngon ngu cho "活動記録・アルバム")

## Noi dung da hoan thanh

- **Commit local (khong push)** theo yeu cau nguoi dung: 28 file (toan bo thay doi tu session 25-39), loai tru 2 file scratch khong lien quan (`flyer.html`, `scratch_questions.json`).
- Nguoi dung neu van de lon: noi dung Admin tu nhap (kỷ niệm, ghi chu su kien) chi co tieng Nhat, trong khi phan con lai cua site hien du 12 ngon ngu — yeu cau thiet ke lai de nguoi cap nhat noi dung phai lam duoc da ngon ngu. Da hoi phuong an qua AskUserQuestion; nguoi dung chon: **nhap tay tung ngon ngu, khong dung API dich, chi goi y giao vien dung Gemini/Claude/ChatGPT de dich roi dan vao**.
- **Trien khai cho "活動記録・アルバム" (event_memories)**:
  - Migration `014_event_memories_translations.sql`: them cot `translations JSONB DEFAULT '{}'` ��� cau truc `{ [ma_ngon_ngu]: { badge, title, summary, source_label, photoCaptions: { [url]: caption } } }`. Cot tieng Nhat hien co van la ban goc/mac dinh.
  - `EventMemory` type them `translations` va interface `MemoryTranslation` moi.
  - `AdminPage.tsx`: them thanh tab chon 1 trong 12 ngon ngu (dung lai `LANGS` tu `shared.tsx`) ngay tren form chinh sua memory. Chon ngon ngu khac tieng Nhat se doi cac o badge/title/summary/nguon/caption anh sang doc-ghi vao `translations[lang]` thay vi cot chinh; co dong chu huong dan "dung AI dich roi dan vao"; tab co cham xanh nho bao hieu ngon ngu da co noi dung.
  - `LastYearSection.tsx` (web nguoi dung that): doc dung `translations[i18n.language]` truoc, fallback ve cot tieng Nhat, cuoi cung fallback ve ban dich tinh cua site — ap dung cho badge/title/summary/nguon/caption tung anh.

## Kiem tra

- `npm run build`: pass.
- `npm run lint`: pass, khong warning moi.
- Chua chay migration 014 tren Supabase that va chua tu test lai bang trinh duyet trong phien nay — de nghi nguoi dung paste migration 014 (sau 011-013), thu chon 1 ngon ngu khac trong tab moi, dan noi dung test, luu, roi doi ngon ngu tren trang chu de xac nhan hien dung.

## Viec con lai / can hoi them

- Cung mot han che tuong tu (chi co ban tieng Nhat) van con o: "イベント設定" (開催日/開催時間/開催場所/協賛/ご予約案内/プレゼント案内) va cac nhan field tuy chinh trong Tab "申込・アンケート項目設定" — chua ap dung co che da ngon ngu cho nhung noi nay. Can hoi nguoi dung co muon lam tiep theo cung mo hinh (tab ngon ngu + dan tay) khong.

## File da thay doi chinh

- `supabase/migrations/014_event_memories_translations.sql` (file moi)
- `src/types/index.ts`
- `src/pages/AdminPage.tsx`
- `src/App.css`
- `src/components/LastYearSection.tsx`
- `docs/nippo.md`

---

## Ngay: 2026-09-16 (session 41 - sua nhan tab ngon ngu trong Admin + khoi phuc ban dich san co cho nam 2025)

## Noi dung da hoan thanh

- Nguoi dung phat hien 2 van de qua screenshot:
  1. Nhan cac tab ngon ngu moi them trong Admin (`活動記録・アルバム`) dung chu ban ngu (မြန်မာ, नेपाली, Oʻzbekcha, বাংলা, ภาษาไทย, සිංහල...) — giao vien tieng Nhat khong doc duoc nen khong biet tab nao la ngon ngu nao.
  2. So sanh voi ban production that (kenketsu-web.vercel.app) khi chon tieng Viet: khoi "昨年の記録" van hien day du noi dung da dich (tu cac session dich thuat truoc day, khoa `lastYear.*` trong 12 file locale) — nhung tren localhost (code moi) lai chi hien tieng Nhat vi logic moi uu tien du lieu DB (chi co tieng Nhat) hon ban dich tinh co san.
- **Sua (1)**: them `ADMIN_LANG_LABELS` (ten tieng Nhat cho tung ma ngon ngu, vd "ミャンマー語", "ネパ���ル語"...) dung rieng cho giao dien Admin, khong dung lai nhan ban ngu cua `LANGS` (danh cho nguoi dung cuoi).
- **Sua (2)**: khoi phuc dung thu tu uu tien cho `LastYearSection.tsx` — voi rieng nam 2025 (du lieu seed goc, cai da duoc dich san qua nhieu session truoc khi co he thong DB nay) va khi admin CHUA tu dan ban dich rieng vao `translations`, uu tien dung ban dich tinh co san (`t('lastYear.badge/title/summary/captions/sourceLink')`) hon la cot tieng Nhat trong DB. Cac nam khac (2026, 2027...) khong co ban dich tinh nao co san nen van theo dung luong: `translations[lang]` (admin dan) → cot tieng Nhat → i18n mac dinh chung.

## Kiem tra

- `npm run build`: pass.
- `npm run lint`: pass, khong warning moi.
- Chua tu test lai bang trinh duyet trong phien nay — de nghi nguoi dung: (1) mo localhost, doi ngon ngu sang tieng Viet/Anh, xac nhan khoi "昨年の記録" nam 2025 hien lai dung ban dich cu; (2) vao Admin, xac nhan cac tab ngon ngu gio hien ten tieng Nhat de doc duoc.

## File da thay doi chinh

- `src/pages/AdminPage.tsx`
- `src/components/LastYearSection.tsx`
- `docs/nippo.md`

---

## Ngay: 2026-09-16 (session 42 - backfill du lieu, sua loi hien thi, ap dung redesign-skill, da ngon ngu cho Tab 4)

## Noi dung da hoan thanh

Gop nhieu vong sua nho lien tiep theo phan hoi truc tiep cua nguoi dung khi test:

1. **Backfill ban dich 2025**: nguoi dung hoi "sao khong tu dien du lieu cu vao" — da viet `015_backfill_2025_memory_translations.sql` lay noi dung 11 ngon ngu co san tu `src/locales/*.json` (khoa `lastYear.*`) nap thang vao `event_memories.translations` cho nam 2025, khong bat giao vien go lai.
2. **Sua loi migration 015**: nham lay noi dung tien to co dinh ("出典："/"Nguồn: ") thay vi noi dung hien thi that cua link nguon, gay lap chu "Nguồn: Nguồn:" tren web. Sua bang `016_fix_2025_translations_source_label.sql`. Doi ten o "出典ラベル" → "出典リンクの表示テキスト" cho ro nghia, them ghi chu giai thich vi sao URL chi sua duoc o tab tieng Nhat (dung chung cho moi ngon ngu).
3. **Sua bo cuc bi cat chu**: o "見出しタイトル"/"出典リンクの表示テキスト" chuyen sang full-width (span-2); **quan trong nhat**: doi caption anh tu `<input>` 1 dong (luon cat chu du rong bao nhieu) sang `<textarea>` 3 dong tu xuong dong.
4. **Ap dung skill thiet ke** (nguoi dung tu them `.claude/skills/redesign-existing-projects` va cac skill lien quan vao du an): doc SKILL.md, ap dung co chon loc cho Admin — tabular-nums cho so lieu thong ke, hieu ung nhan nut (`:active { scale }`), card co chieu sau nhe (box-shadow). Khong doi font (cac font "co ca tinh" nhu Geist/Outfit khong co chu Nhat, khong phu hop Admin 100% tieng Nhat) va khong lam lai layout lon de tranh rui ro.
5. **Da ngon ngu cho Tab 4 (申込・アンケート項目設定)**: nguoi dung chi ra van de tuong tu — neu giao vien doi nhan cau hoi trong Tab 4, nhan moi chi co tieng Nhat va hien nham cho ca 12 ngon ngu, pha ban dich i18n co san. Da hoi phuong an qua AskUserQuestion; nguoi dung chon ap dung dung mo hinh tab-ngon-ngu nhu phan ky niem:
   - Migration `017_form_field_label_translations.sql`: them cot `form_field_settings.label_translations JSONB`.
   - `AdminPage.tsx`: them thanh tab 12 ngon ngu dung chung cho ca 2 bang (form dang ky + khao sat), nhan tuy chinh gio doc/ghi theo dung ngon ngu dang chon.
   - `App.tsx`: `makeFieldHelper` nhan them `currentLang`; voi ngon ngu khac tieng Nhat, chi dung `label_translations[lang]` neu co, neu khong thi GIU NGUYEN ban dich mac dinh (khong bao gio hien nham tieng Nhat cho nguoi dung ngon ngu khac).

## Kiem tra

- `npm run build`: pass sau moi buoc.
- Chua chay migration 015-017 tren Supabase that va chua tu test lai bang trinh duyet trong phien nay — de nghi nguoi dung paste theo dung thu tu 014 → 015 → 016 → 017, roi kiem tra lai: (a) trang chu doi ngon ngu hien dung "Nguồn:" khong lap; (b) caption anh trong Admin hien tron ven; (c) Tab 4 dan thu 1 nhan dich va xac nhan trang chu hien dung theo ngon ngu.

## File da thay doi chinh

- `supabase/migrations/015_backfill_2025_memory_translations.sql` (moi)
- `supabase/migrations/016_fix_2025_translations_source_label.sql` (moi)
- `supabase/migrations/017_form_field_label_translations.sql` (moi)
- `src/types/index.ts`
- `src/lib/supabase.ts`
- `src/pages/AdminPage.tsx`
- `src/App.tsx`
- `src/App.css`
- `docs/nippo.md`
