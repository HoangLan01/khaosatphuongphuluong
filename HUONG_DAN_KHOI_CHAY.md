# Hướng dẫn cài đặt phiếu khảo sát phường Phú Lương

Tài liệu này dùng cho hệ thống khảo sát tĩnh:

```text
index.html
        -> fetch JSON bằng Content-Type: text/plain;charset=utf-8
Google Apps Script Web App
        -> Google Sheet: lưu mỗi lượt gửi thành một dòng
        -> Google Drive: trigger nền tạo một PDF cho mỗi phiếu
```

Người dân không cần đăng nhập Google. Không dán `SPREADSHEET_ID` hoặc `DRIVE_FOLDER_ID` vào `index.html`.

## 1. Chuẩn bị

- Tài khoản Google có quyền tạo Google Sheet, Google Drive folder và Apps Script project.
- File website:
  - `index.html`
  - `assets/logo_phu_luong.jpg`
- Backend:
  - `google_apps_script/Code.gs`
  - `google_apps_script/appsscript.json`

## 2. Tạo Google Sheet

1. Tạo Google Sheet mới, ví dụ: `Phản hồi khảo sát Phú Lương`.
2. Sao chép `SPREADSHEET_ID` từ URL Sheet.
3. ID là đoạn nằm giữa `/d/` và `/edit`.
4. Không cần tạo header thủ công nếu sẽ chạy `setupProject()`.
5. Nếu đã có header sẵn trong sheet `Responses`, header phải đúng schema sau:

```text
MaPhieu
ThoiGianGui
LinhVuc
q_1
q_2
q_3
q_4
q_5
q_6
q_7
q_8
q_9
GioiTinh
DoTuoi
TrinhDo
FileUrl
```

## 3. Tạo thư mục Google Drive

1. Tạo folder mới, ví dụ: `Phiếu khảo sát Phú Lương`.
2. Mở folder và sao chép `DRIVE_FOLDER_ID` từ URL.
3. Chỉ dán ID folder, không dán cả URL.

## 4. Tạo và cấu hình Apps Script

1. Tạo Apps Script project mới, ví dụ: `Backend khảo sát Phú Lương`.
2. Dán toàn bộ nội dung `google_apps_script/Code.gs` vào file `Code.gs`.
3. Trong Apps Script, bật phần hiển thị manifest nếu cần, rồi cập nhật `appsscript.json` theo file trong repo.
4. Trong `Code.gs`, thay đúng hai placeholder:

```javascript
const SPREADSHEET_ID = "DÁN_ID_GOOGLE_SHEET_PHU_LUONG_Ở_ĐÂY";
const DRIVE_FOLDER_ID = "DÁN_ID_THƯ_MỤC_DRIVE_PHU_LUONG_Ở_ĐÂY";
```

5. Chạy thủ công `setupProject()` một lần. Hàm này tạo sheet/header và tạo trigger nền `processPendingPdfs` chạy mỗi phút.
6. Khi Google yêu cầu cấp quyền, chọn tài khoản quản lý, bấm tiếp tục qua màn hình cảnh báo ứng dụng chưa xác minh nếu đây là project nội bộ do đơn vị tự tạo.
7. Chạy `testCreateSamplePdf()` để kiểm tra bố cục PDF. Hàm này chỉ tạo PDF mẫu, không ghi Sheet và không tăng mã phiếu.
8. Trong `Triggers`, kiểm tra có trigger chạy hàm `processPendingPdfs` theo lịch mỗi phút.

## 5. Deploy Web App

1. Trong Apps Script, chọn `Deploy` -> `New deployment`.
2. Chọn loại `Web app`.
3. Chọn `Execute as: Me`.
4. Chọn `Who has access: Anyone`, hoặc lựa chọn tương đương mà tài khoản Workspace cho phép để người dân không phải đăng nhập.
5. Deploy, cấp quyền và sao chép URL kết thúc bằng `/exec`.
6. Khi sửa backend, tạo version/deployment mới và dùng đúng URL deployment mới.

Không dùng URL `/dev` cho website public.

## 6. Kết nối frontend

Mở `index.html`, thay placeholder sau bằng URL Web App kết thúc bằng `/exec`:

```javascript
const SCRIPT_URL = "DÁN_URL_GOOGLE_APPS_SCRIPT_WEB_APP_PHU_LUONG_Ở_ĐÂY";
```

Không dán ID Sheet hoặc ID Drive vào frontend.

## 7. Chạy local

Mở PowerShell từ thư mục repo:

```powershell
cd D:\2025\src\phuluong_form_test
python -m http.server 8080
```

Mở trình duyệt:

```text
http://localhost:8080
```

Không khuyến nghị mở trực tiếp `index.html` bằng `file://`, vì cách đó có thể làm sai hành vi tải asset hoặc gửi request.

## 8. Kiểm thử đầu-cuối

Sau khi đã cấu hình Google Sheet, Drive folder, deploy Apps Script và thay `SCRIPT_URL`, gửi một phiếu test rồi xác nhận:

1. Giao diện hiển thị đúng logo Phú Lương và đủ 9 nhận định.
2. Không thể gửi khi thiếu bất kỳ trường bắt buộc nào.
3. Lượt đầu nhận mã `001`.
4. Sheet `Responses` có đúng một dòng mới và đúng 16 cột theo schema.
5. Điểm `q_1..q_9` nằm đúng cột.
6. Ngay sau khi gửi, cột `FileUrl` có trạng thái `PENDING` hoặc `PROCESSING`.
7. Sau khi trigger nền chạy, Drive có file `Phieu_khao_sat_Phu_Luong_001.pdf`.
8. PDF có đủ nội dung và đúng dấu `X`.
9. Cột `FileUrl` được cập nhật thành URL file PDF vừa tạo.
10. Lượt thứ hai nhận mã `002`.

## 9. Triển khai website tĩnh

Có thể triển khai bằng GitHub Pages, Netlify, Cloudflare Pages hoặc web server của đơn vị. Cấu trúc upload bắt buộc:

```text
index.html
assets/
  logo_phu_luong.jpg
```

Không upload `Code.gs`, manifest hoặc tài liệu chứa ID cấu hình lên web public nếu không cần.

## 10. Lỗi thường gặp

- Chưa thay `SCRIPT_URL`: form báo chưa cấu hình hệ thống.
- Dùng `/dev` thay vì `/exec`: deploy lại Web App và dán URL `/exec`.
- `Failed to fetch` hoặc CORS: kiểm tra URL Web App, quyền `Anyone`, mạng và việc dùng `Content-Type: text/plain;charset=utf-8`.
- Web App chưa cho phép `Anyone`: cập nhật deployment để người dân không phải đăng nhập.
- Chưa deploy version mới sau khi sửa Apps Script: tạo deployment/version mới và dán lại URL nếu URL thay đổi.
- Sai `SPREADSHEET_ID` hoặc `DRIVE_FOLDER_ID`: chỉ dán ID, không dán cả URL.
- Chưa cấp quyền Sheet/Drive/Docs/Triggers: chạy `setupProject()` hoặc `testCreateSamplePdf()` để kích hoạt màn hình cấp quyền.
- Header `Responses` sai schema: Apps Script sẽ từ chối ghi để tránh lệch cột. Sửa header cho đúng hoặc tạo Sheet mới.
- PDF vẫn ở `PENDING`: kiểm tra Apps Script `Triggers` có `processPendingPdfs` mỗi phút chưa, rồi xem `Executions`.
- Tạo PDF thất bại: kiểm tra quyền Drive, `DRIVE_FOLDER_ID` và hạn mức Drive/Apps Script. Nếu cột `FileUrl` bắt đầu bằng `PDF_ERROR:`, mở `Executions` để xem lỗi chi tiết.
- Mã phiếu trùng, thiếu hoặc ngoài dải: dừng nhận phiếu, sao lưu Sheet, kiểm tra cột `MaPhieu`. Không tự xóa từng dòng để sửa dãy mã.
- Hết hạn mức Apps Script/Drive: giảm lưu lượng gửi, chờ hạn mức reset hoặc dùng tài khoản/quy trình phù hợp hơn cho đợt khảo sát lớn.

## 11. Reset dữ liệu và vận hành an toàn

Khi cần reset để mở đợt khảo sát mới:

1. Dừng nhận phiếu trước khi reset.
2. Sao lưu Google Sheet.
3. Giữ nguyên dòng header.
4. Chỉ xóa toàn bộ dữ liệu từ dòng 2 trở xuống.
5. Không sửa hoặc xóa riêng mã phiếu.
6. PDF trên Drive phải được quản lý hoặc xóa riêng theo quy định lưu trữ của đơn vị.
7. Sau reset, gửi test để xác nhận mã quay về `001`.
8. Không tự động xóa dữ liệu để "sửa" dãy mã lỗi.

Lưu ý bảo mật:

- Không cấp quyền edit Sheet hoặc folder Drive cho người điền phiếu.
- Không public PDF nếu PDF có dữ liệu cần bảo vệ.
- Không để lộ thông tin cấu hình nội bộ trên frontend.
- Sao lưu định kỳ và theo dõi Apps Script Executions.
- Kiểm tra hạn mức trước khi mở đợt khảo sát lớn.
