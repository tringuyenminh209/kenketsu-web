# BÁO CÁO CHI TIẾT NÂNG CẤP HỆ THỐNG "BÀN GIAO LÂU DÀI & VẬN HÀNH KHÔNG BẢO TRÌ" (SUSTAINABILITY & ZERO-MAINTENANCE)

> **Dự án:** kenketsu-web (Trang thông tin & Đăng ký Hiến máu tình nguyện ECC)  
> **Thời gian cập nhật:** 15/09/2026  
> **Mục tiêu:** Cho phép giáo viên và ban tổ chức tự vận hành, khởi tạo đợt hiến máu mới hàng năm, upload ảnh hoạt động và quản lý lịch sử đăng ký qua từng năm hoàn toàn trên trang **Admin**, không cần lập trình viên can thiệp hoặc sửa code.

---

## I. TỔNG QUAN CÁC VẤN ĐỀ ĐƯỢC GIẢI QUYẾT

Trước đây, hệ thống còn nhiều điểm phụ thuộc vào cấu hình tĩnh (`src/config/event.ts`) và mã nguồn:
1. **Khởi tạo sự kiện mới**: Cần mở code sửa năm, ngày giờ, số lượng chỗ và deploy lại qua GitHub/Vercel.
2. **Kỷ niệm các năm trước (昨年の記録)**: Ảnh và bài viết bị hardcode tĩnh chỉ cho năm 2025; không có cách cho giáo viên tải ảnh mới của năm sau lên.
3. **Cây người tham gia (参加者の木)**: Cố định theo năm cấu hình, không tự reset khi sang đợt mới và không có tính năng cho người dùng xem lại cây của các năm trước.
4. **Lưu trữ dữ liệu lịch sử**: Dữ liệu đăng ký và khảo sát chưa có giao diện trực quan để thầy cô lọc xem và xuất Excel theo từng năm riêng biệt.

---

## II. CHI TIẾT CÁC THAY ĐỔI & NÂNG CẤP

### 1. Cơ sở Dữ liệu & Storage (Supabase Backend)

Tạo mới file migration: [`supabase/migrations/010_event_management_and_memories.sql`](file:///C:/Users/2240788/OneDrive%20-%20yamaguchigakuen/Project/kenketsu/supabase/migrations/010_event_management_and_memories.sql)

* **Bảng `public.events` (Quản lý các đợt sự kiện qua từng năm)**:
  - `id` (UUID): Khóa chính.
  - `year` (INTEGER, UNIQUE): Năm tổ chức sự kiện (ví dụ: 2025, 2026, 2027...).
  - `title`, `date_display`, `time_display`: Tiêu đề và chuỗi hiển thị ngày/giờ tổ chức.
  - `location`, `location_detail`: Địa điểm và vị trí cụ thể (ví dụ: 1号館 1階ラウンジ).
  - `capacity`: Mục tiêu số lượng người hiến máu (mặc định 50).
  - `slot_capacity`: Sức chứa tối đa của mỗi khung giờ (mặc định 8).
  - `sponsor`: Đơn vị tài trợ (Lions Club).
  - `is_active` (BOOLEAN): Đánh dấu sự kiện nào đang diễn ra/mở đăng ký. Khi kích hoạt đợt mới, hệ thống tự động đổi `is_active = true` cho năm mới và đưa các năm cũ về dạng lưu trữ (archive).
  - **Bảo mật RLS**: Cho phép công chúng đọc (`SELECT`), chỉ tài khoản giáo viên đã đăng nhập (`authenticated`) mới có quyền Thêm/Sửa/Xóa.

* **Bảng `public.event_memories` (Lưu trữ ảnh & bài viết kỷ niệm 昨年の記録)**:
  - `id` (UUID), `event_year` (INTEGER, UNIQUE): Năm của kỷ niệm.
  - `badge`, `title`, `summary`: Nội dung tiêu đề và tóm tắt hoạt động của năm đó.
  - `photos` (JSONB): Mảng các ảnh và chú thích `[{ "url": "...", "caption": "..." }]`.
  - `source_label`, `source_link`: Nguồn trích dẫn / Link bài viết gốc của ECC.
  - `is_published` (BOOLEAN): Trạng thái xuất bản ra ngoài web.
  - **Bảo mật RLS**: Cho phép công chúng đọc bài viết đã xuất bản, admin toàn quyền quản trị.

* **Supabase Storage Bucket `event-photos`**:
  - Tạo bucket công khai `event-photos` để lưu trữ ảnh hoạt động.
  - Thiết lập chính sách RLS cho phép người dùng xem ảnh công khai và chỉ cho phép Admin upload/xóa ảnh trực tiếp từ trình duyệt.

* **Seed Data**:
  - Khởi tạo sự kiện năm 2026 ở trạng thái Active.
  - Khởi tạo đầy đủ 6 ảnh kỷ niệm kèm chú thích của năm 2025 để đảm bảo không gián đoạn giao diện hiện tại.

---

### 2. Tầng Dữ liệu & Helper API (`src/lib/supabase.ts` & `src/types/index.ts`)

* **Khai báo kiểu dữ liệu mới (`src/types/index.ts`)**:
  - [`EventItem`](file:///C:/Users/2240788/OneDrive%20-%20yamaguchigakuen/Project/kenketsu/src/types/index.ts#L63-L76): Định nghĩa cấu trúc của một sự kiện.
  - [`PhotoItem`](file:///C:/Users/2240788/OneDrive%20-%20yamaguchigakuen/Project/kenketsu/src/types/index.ts#L78-L81) & [`EventMemory`](file:///C:/Users/2240788/OneDrive%20-%20yamaguchigakuen/Project/kenketsu/src/types/index.ts#L83-L94): Định nghĩa cấu trúc của bài viết và ảnh kỷ niệm.

* **Bổ sung các hàm API (`src/lib/supabase.ts`)**:
  - [`fetchActiveEvent()`](file:///C:/Users/2240788/OneDrive%20-%20yamaguchigakuen/Project/kenketsu/src/lib/supabase.ts#L306-L317): Lấy thông tin sự kiện đang active để hiển thị trên trang chủ và form đăng ký.
  - [`fetchAllEvents()`](file:///C:/Users/2240788/OneDrive%20-%20yamaguchigakuen/Project/kenketsu/src/lib/supabase.ts#L320-L327): Lấy toàn bộ danh sách các sự kiện qua các năm.
  - [`createOrUpdateEvent()`](file:///C:/Users/2240788/OneDrive%20-%20yamaguchigakuen/Project/kenketsu/src/lib/supabase.ts#L329-L337): Tạo mới hoặc cập nhật cài đặt sự kiện.
  - [`setActiveEventYear(year)`](file:///C:/Users/2240788/OneDrive%20-%20yamaguchigakuen/Project/kenketsu/src/lib/supabase.ts#L339-L352): Kích hoạt một năm làm sự kiện chính thức, tự động chuyển các năm khác thành lưu trữ.
  - [`fetchPublishedMemories()`](file:///C:/Users/2240788/OneDrive%20-%20yamaguchigakuen/Project/kenketsu/src/lib/supabase.ts#L355-L366): Lấy danh sách kỷ niệm các năm đã xuất bản cho người dùng xem.
  - [`saveEventMemory()`](file:///C:/Users/2240788/OneDrive%20-%20yamaguchigakuen/Project/kenketsu/src/lib/supabase.ts#L377-L385): Lưu bài viết và danh sách ảnh kỷ niệm theo năm.
  - [`uploadEventPhoto(file)`](file:///C:/Users/2240788/OneDrive%20-%20yamaguchigakuen/Project/kenketsu/src/lib/supabase.ts#L388-L404): Upload ảnh trực tiếp lên Supabase Storage bucket `event-photos` và trả về URL công khai.

---

### 3. Nâng cấp Giao diện Quản trị Admin (`src/pages/AdminPage.tsx`)

Trang Admin đã được tái cấu trúc thành **3 Tab nghiệp vụ trực quan**:

1. **Tab 1: 📋 Quản lý Đăng ký & Khảo sát (Multi-year)**:
   - Thêm thanh **Chọn năm hiển thị (年度切り替え)**: Cho phép thầy cô xem lại số liệu của từng năm (2025, 2026, 2027...). Có nhãn `★現在開催中` đánh dấu năm đang diễn ra.
   - Thống kê tự động cập nhật theo năm được chọn (Số người đăng ký, Số khảo sát, Mục tiêu còn lại).
   - Công cụ **Điều chỉnh số chỗ trống thực tế của Hội Chữ Thập Đỏ**: Nhập số chỗ trống từng khung giờ, lưu trực tiếp vào DB để phản ánh ra màn hình người dùng.
   - Bảng danh sách sinh viên đăng ký có nút lọc theo từng khung giờ và nút **Xuất Excel (Excelエクスポート)** cho từng năm.
   - Biểu đồ và dữ liệu chi tiết kết quả khảo sát theo năm.

2. **Tab 2: ⚙️ Khởi tạo Đợt mới & Cài đặt Sự kiện (Event Settings & New Batch)**:
   - **Khu vực khởi tạo nhanh**: Thầy cô chỉ cần nhập năm mới (ví dụ `2027`) và nhấn nút **"新年度イベントを作成して公開開始"**:
     * Hệ thống tự động thiết lập sự kiện mới là Active.
     * Cây người tham gia ngoài trang chủ tự động reset về 0 để đón nhận sinh viên đăng ký mới.
     * Toàn bộ dữ liệu của năm trước được lưu trữ nguyên vẹn, không bị mất.
   - **Danh sách sự kiện**: Hiển thị tất cả các năm, có nút chuyển đổi năm nào đang chạy hoặc bấm "Chỉnh sửa".
   - **Form chỉnh sửa chi tiết**: Cho phép sửa ngày giờ, địa điểm, sức chứa tổng, sức chứa mỗi slot, đơn vị tài trợ trực tiếp trên web mà không cần sửa code.

3. **Tab 3: 📸 Quản lý "Kỷ niệm các năm trước" (昨年の記録 / Memories)**:
   - Chọn năm để biên tập (2025, 2026, 2027...).
   - Chỉnh sửa tiêu đề bài viết, tóm tắt nội dung, nguồn trích dẫn.
   - **Upload ảnh trực tiếp**: Nút `＋ 写真を追加する` cho phép thầy cô chọn ảnh từ máy tính để tải lên hệ thống ngay lập tức.
   - Nhập chú thích (caption) cho từng ảnh, có nút xóa ảnh không cần thiết.
   - Nút **Lưu & Xuất bản** để cập nhật ngay ra trang chủ.

---

### 4. Nâng cấp Giao diện Phía Người Dùng (Client)

* **Cây người tham gia ([`BloodTreeProgress.tsx`](file:///C:/Users/2240788/OneDrive%20-%20yamaguchigakuen/Project/kenketsu/src/components/BloodTreeProgress.tsx))**:
  - **Mặc định**: Tự động kết nối với sự kiện Active từ database và lắng nghe thay đổi Realtime (khi có người đăng ký mới, lá cây tự động nở thêm).
  - **Tính năng xem lại lịch sử**: Bổ sung thanh nút chọn năm phía dưới tiêu đề (ví dụ: `[2026年 (現在)]`, `[2025年]`). Khi bấm vào năm cũ, cây sẽ tái hiện lại trạng thái thành quả của năm đó, giúp người dùng cảm nhận được bề dày hoạt động hiến máu của trường.

* **Kỷ niệm các năm trước ([`LastYearSection.tsx`](file:///C:/Users/2240788/OneDrive%20-%20yamaguchigakuen/Project/kenketsu/src/components/LastYearSection.tsx))**:
  - Không còn hardcode tĩnh; chuyển sang tải dữ liệu động từ bảng `event_memories`.
  - Có thanh Tab chuyển đổi qua lại giữa các năm (2025, 2026, 2027...) để người xem khám phá toàn bộ ảnh và hoạt động của từng năm.
  - Vẫn giữ cơ chế fallback ảnh gốc an toàn trong trường hợp mạng chậm hoặc cơ sở dữ liệu chưa có bài viết.

* **Form Đăng ký & Khảo sát ([`App.tsx`](file:///C:/Users/2240788/OneDrive%20-%20yamaguchigakuen/Project/kenketsu/src/App.tsx))**:
  - Khởi tạo với sự kiện Active lấy từ DB.
  - Tự động tính toán số chỗ còn lại theo cấu hình của đợt hiện tại.
  - Gắn chính xác `event_year` của đợt đang diễn ra vào bản ghi đăng ký và khảo sát.

---

## III. KẾT QUẢ KIỂM THỬ (VALIDATION)

1. **Kiểm tra biên dịch TypeScript & Build Vite**:
   ```bash
   npm run build
   ```
   * **Kết quả**: `✓ built in 633ms` — Không có bất kỳ lỗi cú pháp hoặc lỗi kiểu dữ liệu nào.

2. **Kiểm tra cú pháp & Quy chuẩn Lint**:
   ```bash
   npm run lint
   ```
   * **Kết quả**: `0 errors` — Mã nguồn sạch sẽ, tuân thủ đúng quy ước dự án.

3. **Môi trường chạy thử**:
   * Dev Server Vite hoạt động ổn định tại `http://localhost:5173/`.

---

## IV. TỔNG HỢP CÁC TỆP ĐÃ THAY ĐỔI

| Tệp | Thay đổi chính |
|---|---|
| [`supabase/migrations/010_event_management_and_memories.sql`](file:///C:/Users/2240788/OneDrive%20-%20yamaguchigakuen/Project/kenketsu/supabase/migrations/010_event_management_and_memories.sql) | Tạo bảng `events`, `event_memories`, Storage bucket `event-photos`, RLS policies và seed data |
| [`src/types/index.ts`](file:///C:/Users/2240788/OneDrive%20-%20yamaguchigakuen/Project/kenketsu/src/types/index.ts) | Định nghĩa TypeScript types: `EventItem`, `PhotoItem`, `EventMemory` |
| [`src/lib/supabase.ts`](file:///C:/Users/2240788/OneDrive%20-%20yamaguchigakuen/Project/kenketsu/src/lib/supabase.ts) | Thêm các hàm tương tác API cho Events, Memories và Upload Storage |
| [`src/pages/AdminPage.tsx`](file:///C:/Users/2240788/OneDrive%20-%20yamaguchigakuen/Project/kenketsu/src/pages/AdminPage.tsx) | Xây dựng giao diện 3 Tab: Quản lý đăng ký đa năm, Khởi tạo đợt mới và Upload ảnh kỷ niệm |
| [`src/components/BloodTreeProgress.tsx`](file:///C:/Users/2240788/OneDrive%20-%20yamaguchigakuen/Project/kenketsu/src/components/BloodTreeProgress.tsx) | Nâng cấp Cây người tham gia hỗ trợ xem theo nhiều năm và kết nối realtime theo đợt active |
| [`src/components/LastYearSection.tsx`](file:///C:/Users/2240788/OneDrive%20-%20yamaguchigakuen/Project/kenketsu/src/components/LastYearSection.tsx) | Nâng cấp khu vực kỷ niệm tải ảnh động từ DB và có Tabs chuyển đổi năm |
| [`src/App.tsx`](file:///C:/Users/2240788/OneDrive%20-%20yamaguchigakuen/Project/kenketsu/src/App.tsx) | Kết nối sự kiện Active động cho Form Đăng ký, Khảo sát và tính toán slot |
| [`docs/nippo.md`](file:///C:/Users/2240788/OneDrive%20-%20yamaguchigakuen/Project/kenketsu/docs/nippo.md) | Ghi nhận nhật ký công việc ngày 15/09/2026 theo quy chuẩn dự án |
