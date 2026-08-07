# Prompt triển khai hệ thống Phiếu khảo sát phường Phú Lương

Bạn là lập trình viên full-stack có kinh nghiệm xây dựng biểu mẫu HTML responsive, Google Apps Script Web App, Google Sheets, Google Drive, tạo PDF bằng `DocumentApp` và triển khai website tĩnh.

Hãy làm việc trực tiếp trong repo hiện tại và triển khai một hệ thống khảo sát hoàn chỉnh cho **UBND phường Phú Lương**, dựa trên kiến trúc, luồng xử lý và cách tổ chức file sẵn có của repo. Không chỉ đổi tên phường: phải thay đồng bộ toàn bộ nội dung phiếu, schema dữ liệu, validation, giao diện, file PDF và tài liệu hướng dẫn theo mẫu Word mới.

## 1. Nguồn dữ liệu và phạm vi phải đọc trước khi sửa

Trước khi thay đổi code, hãy đọc đầy đủ các file sau:

- `documents/Mẫu số 02.docx`: nguồn chân lý về tiêu đề, lời dẫn, hướng dẫn, câu hỏi, nhóm câu hỏi, thang đánh giá và thông tin người trả lời.
- `assets/logo_phu_luong.jpg`: logo/hình nhận diện phải dùng trên giao diện phường Phú Lương.
- `index.html`: giao diện khảo sát hiện tại.
- `google_apps_script/Code.gs`: backend Apps Script, ghi Sheet, cấp mã phiếu và tạo PDF.
- `google_apps_script/appsscript.json`: cấu hình Apps Script.
- `HUONG_DAN_KHOI_CHAY.md`: quy trình cài đặt và vận hành hiện tại.
- `prompt_trien_khai_phieu_khao_sat_google_apps_script.md`: tài liệu tham khảo về ý đồ hệ thống cũ, không phải nguồn câu hỏi của phiếu mới.

Giữ kiến trúc gọn nhẹ hiện có:

```text
index.html (website tĩnh)
        ↓ fetch JSON bằng Content-Type text/plain
Google Apps Script Web App
        ├── Google Sheet: lưu mỗi lượt gửi thành một dòng
        └── Google Drive: lưu một PDF cho mỗi phiếu
```

Không thêm backend riêng, database riêng hoặc framework build nếu không thực sự cần thiết. Không yêu cầu người dân đăng nhập Google.

## 2. Nội dung chính thức phải triển khai từ Mẫu số 02

### 2.1. Phần đầu phiếu

Phải thể hiện đủ các thành phần sau trên giao diện và trong PDF lưu trữ:

- `Mẫu số 02`.
- Tiêu đề: `MẪU PHIẾU KHẢO SÁT`.
- Phụ đề: `Khảo sát đo lường mức độ hài lòng đối với các phòng chuyên môn thuộc UBND phường`.
- Dòng căn cứ: `(Kèm theo Kế hoạch .../KH-UBND ngày ... tháng ... năm 2026 của UBND phường Phú Lương)`; giữ chỗ trống/chỗ cấu hình cho số và ngày kế hoạch, không tự bịa dữ liệu.
- Đơn vị: `UBND phường Phú Lương`.
- Logo giao diện phải dùng đúng đường dẫn tương đối `assets/logo_phu_luong.jpg` và có `alt="Logo phường Phú Lương"`.

Không cắt méo ảnh logo. Dùng `object-contain` hoặc cách tương đương để giữ tỷ lệ ảnh. Khi đưa website lên host, phải giữ nguyên thư mục `assets/` cùng cấp với `index.html`.

### 2.2. I. THÔNG TIN CHUNG

#### 1. Mục đích khảo sát

Giữ đúng nội dung:

> Để giúp UBND phường triển khai đo lường sự hài lòng của tổ chức, cá nhân đối với sự phục vụ của các phòng chuyên môn thuộc UBND phường. Kính mong Ông (bà) cung cấp thông tin đầy đủ, chính xác, khách quan đối với việc thực hiện một số nội dung của chính quyền đối với ông (bà).

#### 2. Hướng dẫn trả lời

Giữ đúng ý nghĩa của mẫu:

> Xin Ông/Bà chọn một trong các chữ số 1, 2, 3, 4, 5 đối với từng nhận định; trong đó 5 = Rất hài lòng, 4 = Hài lòng, 3 = Bình thường, 2 = Không hài lòng và 1 = Rất không hài lòng.

Trên giao diện web dùng radio button thay cho thao tác khoanh tròn trên giấy. Phải hiển thị đầy đủ cả số điểm và nhãn của 5 mức đánh giá.

Thêm trường bắt buộc:

- Nhãn: `Lĩnh vực/thủ tục hành chính đã giải quyết`.
- Tên payload: `linhVuc`.
- Kiểu: text, trim khoảng trắng, giới hạn tối đa 500 ký tự ở cả client và server.

### 2.3. Bảng đánh giá gồm đúng 9 nhận định

Chỉ dùng một dãy field `q_1` đến `q_9`. Xóa hoàn toàn nhóm `cq_1` đến `cq_8` và các câu hỏi không có trong `Mẫu số 02.docx` khỏi HTML, JavaScript, payload, validation, Sheet, PDF và dữ liệu test.

#### I. CÔNG CHỨC TRỰC TIẾP GIẢI QUYẾT CÔNG VIỆC

1. Công chức có thái độ giao tiếp lịch sự.
2. Công chức trả lời, giải thích, hướng dẫn kê khai hồ sơ tận tình, chu đáo, dễ hiểu.
3. Công chức tuân thủ đúng quy định trong giải quyết công việc.

#### II. KẾT QUẢ CUNG ỨNG DỊCH VỤ HÀNH CHÍNH CÔNG

4. Kết quả mà Ông/Bà nhận được là đúng quy định *(Kết quả có thể là được cấp giấy tờ hoặc bị từ chối cấp giấy tờ)*.
5. Kết quả mà Ông/Bà nhận được có thông tin đầy đủ, chính xác.

Phải giữ phần chú thích trong ngoặc của nhận định 4 ở giao diện và trong PDF; không được rút gọn hoặc bỏ sót.

#### III. TIẾP NHẬN, XỬ LÝ CÁC Ý KIẾN GÓP Ý, PHẢN ÁNH, KIẾN NGHỊ

6. Cơ quan có bố trí hình thức tiếp nhận góp ý, phản ánh, kiến nghị của người dân, tổ chức.
7. Ông/Bà dễ dàng thực hiện góp ý, phản ánh, kiến nghị.
8. Cơ quan tiếp nhận và xử lý tích cực các góp ý, phản ánh, kiến nghị của Ông/Bà.
9. Cơ quan thông báo kịp thời kết quả xử lý các ý kiến góp ý, phản ánh, kiến nghị cho Ông/Bà.

Mỗi nhận định là bắt buộc và chỉ nhận một trong các giá trị chuỗi `"1"`, `"2"`, `"3"`, `"4"`, `"5"` ở request. Backend phải kiểm tra lại, không tin dữ liệu client.

### 2.4. THÔNG TIN NGƯỜI TRẢ LỜI

Các nhóm sau đều bắt buộc và phải xuất hiện trong giao diện, payload, Sheet và PDF:

**Giới tính** (`gioiTinh`):

1. Nam
2. Nữ

**Độ tuổi** (`doTuoi`):

1. Từ 18 - 24 tuổi
2. Từ 25-34 tuổi
3. Từ 35-49 tuổi
4. Từ 50-60 tuổi
5. Trên 60 tuổi

**Trình độ** (`trinhDo`):

1. Tiểu học
2. Trung học cơ sở (Cấp II)
3. Trung học phổ thông (Cấp 3)
4. Đại học
5. Dạy nghề, Trung cấp, Cao đẳng
6. Sau Đại học

Cuối phiếu hiển thị: `Trân trọng cảm ơn ông/bà!`

Giá trị lưu phải nhất quán giữa client và danh sách cho phép ở backend. Không dùng lại giá trị cũ `Dưới 25`; phải chuyển đúng thành `Từ 18 - 24 tuổi` hoặc một giá trị máy ổn định như `18-24` nhưng nhãn hiển thị và PDF phải đúng nguyên văn mẫu.

## 3. Yêu cầu chỉnh sửa giao diện `index.html`

Giữ tinh thần giao diện responsive, dễ đọc và dễ thao tác trên điện thoại của repo hiện tại, nhưng chuyển toàn bộ nhận diện sang phường Phú Lương.

Phải thực hiện tối thiểu:

1. Đổi `<title>`, header, tên đơn vị, tiêu đề và mọi nội dung `Tùng Thiện` thành nội dung Phú Lương phù hợp mẫu mới.
2. Thay ảnh bằng `assets/logo_phu_luong.jpg`; không dùng lại logo cũ.
3. Hiển thị đủ phần `Mẫu số 02`, tiêu đề, phụ đề, dòng căn cứ kế hoạch, mục đích, hướng dẫn, trường lĩnh vực, 3 nhóm/9 nhận định, thông tin người trả lời và lời cảm ơn.
4. Bảng đánh giá có cột nhận định và 5 cột theo thứ tự `5, 4, 3, 2, 1`, kèm nhãn `Rất hài lòng`, `Hài lòng`, `Bình thường`, `Không hài lòng`, `Rất không hài lòng`.
5. Trên màn hình nhỏ, cho phép cuộn ngang bảng hoặc dùng bố cục mobile rõ ràng; không để radio quá nhỏ, chữ bị cắt hay bảng tràn phá layout.
6. Tất cả radio có label/aria-label rõ ràng; có trạng thái focus; màu sắc đủ tương phản.
7. Người dân không nhập mã phiếu. Giao diện chỉ thông báo rằng mã được cấp tự động sau khi gửi thành công.
8. Biến cấu hình phải là placeholder mới, không tái sử dụng URL deployment của hệ thống cũ:

```javascript
const SCRIPT_URL = "DÁN_URL_GOOGLE_APPS_SCRIPT_WEB_APP_PHU_LUONG_Ở_ĐÂY";
```

9. `collectPayload()` chỉ thu:

```javascript
{
  linhVuc,
  q_1, q_2, q_3, q_4, q_5, q_6, q_7, q_8, q_9,
  gioiTinh,
  doTuoi,
  trinhDo
}
```

10. Khi submit:
    - dùng validation HTML và kiểm tra bổ sung nếu cần;
    - disable nút, đổi thành `Đang gửi...` để chống bấm nhiều lần;
    - gửi `fetch()` bằng `POST`, body JSON và `Content-Type: text/plain;charset=utf-8` để hạn chế preflight với Apps Script;
    - parse JSON an toàn và hiển thị lỗi thân thiện;
    - khi thành công, hiển thị mã phiếu và link PDF nếu backend trả về;
    - chỉ reset form sau khi server xác nhận thành công;
    - luôn bật lại nút trong `finally`.

Không đưa `SPREADSHEET_ID` hoặc `DRIVE_FOLDER_ID` vào HTML.

## 4. Yêu cầu Google Apps Script `google_apps_script/Code.gs`

### 4.1. Cấu hình và an toàn dữ liệu

Không sử dụng lại Google Sheet, Drive folder hoặc deployment của hệ thống Tùng Thiện. Thay giá trị hiện tại bằng placeholder rõ ràng:

```javascript
const SPREADSHEET_ID = "DÁN_ID_GOOGLE_SHEET_PHU_LUONG_Ở_ĐÂY";
const SHEET_NAME = "Responses";
const DRIVE_FOLDER_ID = "DÁN_ID_THƯ_MỤC_DRIVE_PHU_LUONG_Ở_ĐÂY";
const START_CODE = 1;
const END_CODE = 200;
const CODE_WIDTH = 3;
const TIME_ZONE = "Asia/Ho_Chi_Minh";
```

Giữ cơ chế `LockService` để tránh trùng mã khi nhiều người gửi cùng lúc. Chỉ cấp mã cho lượt gửi được xử lý thành công. Google Sheet là nguồn xác định mã tiếp theo như repo hiện tại; không tạo hai nguồn trạng thái dễ lệch nhau.

Trong JavaScript, xử lý giá trị tuần tự nội bộ dưới dạng số từ `1` đến `200`, sau đó định dạng mã hiển thị đủ 3 chữ số bằng `String(code).padStart(CODE_WIDTH, "0")`. Không khai báo số JavaScript trực tiếp dưới dạng `001`. Mã trả về frontend, ghi trong PDF, tên file và thông báo cho người dùng phải có dạng `001`, `002`, ..., `200`.

Nếu tạo PDF thành công nhưng ghi Sheet thất bại, xóa/đưa PDF dở dang vào thùng rác như cơ chế hiện có. Luôn release lock trong `finally`.

### 4.2. Schema Google Sheet

`HEADERS` phải đúng thứ tự sau:

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

Mỗi lượt gửi thành công là một dòng. Cột `MaPhieu` phải giữ được đúng 3 chữ số, ví dụ `001`; có thể lưu dạng text hoặc đặt number format `000`, nhưng khi đọc lại phải chuyển an toàn về số để xác định mã kế tiếp. Điểm `q_1` đến `q_9` lưu dạng số. Các chuỗi nhập vào Sheet phải được xử lý để giảm nguy cơ formula injection, kế thừa helper an toàn của repo hiện tại.

`ensureHeaders_()` phải:

- tự tạo header nếu Sheet trống;
- đóng băng dòng đầu và định dạng dễ đọc;
- từ chối ghi nếu header hiện hữu không đúng schema, nhằm tránh lệch cột.

### 4.3. Validation backend

`validatePayload_()` phải yêu cầu đủ:

- `linhVuc`;
- `q_1` đến `q_9`;
- `gioiTinh`;
- `doTuoi`;
- `trinhDo`.

Phải kiểm tra:

- mọi điểm thuộc `1..5`;
- `linhVuc` không rỗng sau khi trim và không quá 500 ký tự;
- giới tính, độ tuổi, trình độ thuộc đúng danh sách cho phép của mẫu Phú Lương;
- payload không hợp lệ không được tạo PDF hoặc ghi Sheet.

### 4.4. Cấp mã phiếu

Giữ hành vi ổn định của hệ thống hiện tại:

- mã đầu tiên `001`, mã cuối cùng `200`;
- từ chối lượt mới sau `200` với thông báo dễ hiểu;
- không trùng mã khi gửi đồng thời;
- kiểm tra mã trong Sheet tương ứng số nguyên từ `1` đến `200`, hiển thị đủ 3 chữ số, không trùng và không đứt dãy;
- nếu Sheet chỉ còn dòng header thì mã tiếp theo là `001`;
- không tự động sửa/xóa dữ liệu cũ khi phát hiện bất thường.

### 4.5. Tạo PDF lưu Google Drive

Ưu tiên tiếp tục dùng `DocumentApp.create()` rồi xuất PDF như repo hiện tại. PDF phải rõ ràng, khổ A4, font hỗ trợ tiếng Việt, và chứa đủ:

- `Mẫu số 02`;
- tên UBND phường Phú Lương;
- mã số phiếu và thời gian gửi;
- tiêu đề, phụ đề và dòng căn cứ kế hoạch;
- mục đích khảo sát;
- hướng dẫn thang điểm;
- lĩnh vực/thủ tục hành chính;
- đủ 3 nhóm và 9 nhận định theo đúng thứ tự;
- bảng 5 mức đánh giá và dấu `X` ở mức người trả lời đã chọn;
- giới tính, độ tuổi, trình độ;
- lời cảm ơn.

Tên file:

```text
Phieu_khao_sat_Phu_Luong_001.pdf
Phieu_khao_sat_Phu_Luong_002.pdf
...
```

Chỉ giữ PDF cuối cùng, xóa Google Docs trung gian. Lưu URL PDF vào `FileUrl` và trả URL về client. Không bắt buộc nhúng logo repo vào PDF nếu Apps Script không thể truy cập asset tĩnh một cách an toàn; tuyệt đối không hardcode một URL ảnh không ổn định. Logo trên giao diện web là bắt buộc.

Cập nhật `testCreateSamplePdf()` để chỉ tạo dữ liệu mẫu cho `q_1..q_9`, dùng đúng giá trị tuổi Phú Lương, không ghi Sheet và không tăng mã phiếu.

### 4.6. Response và lỗi

`doGet()` trả JSON health check đơn giản. `doPost()` trả JSON nhất quán:

```javascript
{
  success: true,
  message: "Hệ thống đã ghi nhận phiếu khảo sát số 001.",
  code: "001",
  fileUrl: "..."
}
```

Khi lỗi, không trả stack trace hoặc thông tin nội bộ cho người dùng. Ghi chi tiết lỗi vào Apps Script Executions/console và trả thông báo công khai phù hợp.

## 5. Manifest Apps Script

Kiểm tra `google_apps_script/appsscript.json` và giữ cấu hình tối thiểu cần thiết cho Spreadsheet, Drive, Docs và Web App. Dùng múi giờ `Asia/Ho_Chi_Minh`. Không thêm scope rộng không cần thiết.

## 6. Viết lại hướng dẫn cài đặt, setup và khởi chạy

Cập nhật `HUONG_DAN_KHOI_CHAY.md` thành hướng dẫn riêng cho phường Phú Lương, đủ chi tiết để người không chuyên có thể làm theo. Phải có các phần dưới đây.

### 6.1. Chuẩn bị

- Tài khoản Google có quyền tạo Google Sheet, Drive folder và Apps Script project.
- Các file website: `index.html` và `assets/logo_phu_luong.jpg`.
- Backend: `google_apps_script/Code.gs` và `google_apps_script/appsscript.json`.

### 6.2. Tạo Google Sheet

1. Tạo Sheet mới, ví dụ `Phản hồi khảo sát Phú Lương`.
2. Sao chép đúng `SPREADSHEET_ID` từ URL; giải thích ID là đoạn nằm giữa `/d/` và `/edit`.
3. Không yêu cầu tạo header thủ công nếu `setupProject()` sẽ tạo; nếu có header sẵn thì phải đúng schema.

### 6.3. Tạo thư mục Google Drive

1. Tạo folder, ví dụ `Phiếu khảo sát Phú Lương`.
2. Sao chép `DRIVE_FOLDER_ID` từ URL folder; chỉ dán ID, không dán cả URL.

### 6.4. Tạo và cấu hình Apps Script

1. Tạo project Apps Script mới, ví dụ `Backend khảo sát Phú Lương`.
2. Dán toàn bộ `Code.gs`.
3. Bật hiển thị manifest và cập nhật `appsscript.json` nếu quy trình cần.
4. Dán `SPREADSHEET_ID` và `DRIVE_FOLDER_ID` của Phú Lương.
5. Chạy thủ công `setupProject()` một lần.
6. Hướng dẫn cấp quyền và xử lý màn hình cảnh báo ứng dụng chưa xác minh.
7. Chạy `testCreateSamplePdf()` để kiểm tra bố cục mà không ghi Sheet/không tăng mã.

### 6.5. Deploy Web App

Mô tả đúng thao tác:

1. `Deploy` → `New deployment`.
2. Chọn loại `Web app`.
3. `Execute as: Me`.
4. `Who has access: Anyone` (hoặc lựa chọn tương đương mà tài khoản Workspace cho phép để người dân không phải đăng nhập).
5. Deploy, cấp quyền và sao chép URL kết thúc bằng `/exec`.
6. Khi sửa backend, tạo version/deployment mới và dùng URL deployment đúng.

### 6.6. Kết nối frontend

Mở `index.html`, thay placeholder `SCRIPT_URL` bằng URL `/exec`. Không dùng URL `/dev`. Không dán ID Sheet/Drive vào frontend.

### 6.7. Chạy local

Hướng dẫn PowerShell từ thư mục repo:

```powershell
python -m http.server 8080
```

Mở:

```text
http://localhost:8080
```

Không khuyến nghị mở `index.html` trực tiếp bằng `file://`.

### 6.8. Kiểm thử đầu-cuối

Hướng dẫn gửi một phiếu test và xác nhận đủ:

1. Giao diện hiển thị đúng logo Phú Lương và đủ 9 nhận định.
2. Không thể gửi khi thiếu bất kỳ trường bắt buộc nào.
3. Lượt đầu nhận mã `001`.
4. Sheet `Responses` có đúng một dòng mới và đúng 16 cột theo schema.
5. Điểm `q_1..q_9` nằm đúng cột.
6. Drive có `Phieu_khao_sat_Phu_Luong_001.pdf`.
7. PDF có đủ nội dung và đúng dấu `X`.
8. `FileUrl` trỏ tới file vừa tạo.
9. Lượt thứ hai nhận mã `002`.

### 6.9. Triển khai website tĩnh

Hướng dẫn có thể dùng GitHub Pages, Netlify, Cloudflare Pages hoặc web server của đơn vị. Cấu trúc upload bắt buộc:

```text
index.html
assets/
  logo_phu_luong.jpg
```

Không upload `Code.gs`, manifest hoặc tài liệu chứa ID cấu hình lên web public nếu không cần.

### 6.10. Lỗi thường gặp

Có hướng dẫn chẩn đoán tối thiểu cho:

- chưa thay `SCRIPT_URL`;
- dùng `/dev` thay vì `/exec`;
- `Failed to fetch`/CORS;
- Web App chưa cho phép `Anyone`;
- chưa deploy version mới sau khi sửa Apps Script;
- sai `SPREADSHEET_ID` hoặc `DRIVE_FOLDER_ID`;
- chưa cấp quyền Sheet/Drive/Docs;
- header `Responses` sai schema;
- tạo PDF thất bại;
- mã phiếu trùng, thiếu hoặc ngoài dải;
- hết hạn mức Apps Script/Drive.

### 6.11. Reset dữ liệu và vận hành an toàn

Giữ hướng dẫn reset an toàn như repo hiện tại:

- dừng nhận phiếu trước khi reset;
- sao lưu Sheet;
- giữ nguyên dòng header;
- chỉ reset bằng cách xóa toàn bộ dữ liệu từ dòng 2 trở xuống;
- không sửa/xóa riêng mã phiếu;
- PDF trên Drive phải được quản lý/xóa riêng;
- sau reset, gửi test để xác nhận mã quay về `001`;
- không tự động xóa dữ liệu để “sửa” dãy mã lỗi.

Nêu rõ các lưu ý bảo mật:

- không cấp quyền edit Sheet/folder cho người điền;
- không public PDF nếu có dữ liệu cần bảo vệ;
- không để lộ thông tin cấu hình nội bộ trên frontend;
- sao lưu định kỳ và theo dõi Apps Script Executions;
- kiểm tra hạn mức trước khi mở đợt khảo sát lớn.

## 7. Kiểm tra bắt buộc trước khi bàn giao

Sau khi sửa, phải tự rà soát và báo kết quả cụ thể:

1. Tìm toàn repo (trừ tài liệu lịch sử nếu được giữ có chủ đích) để chắc chắn runtime không còn chuỗi `Tùng Thiện`, logo cũ, `cq_`, vòng lặp 18 câu hoặc các câu hỏi không thuộc mẫu mới.
2. Xác nhận frontend tạo đúng 9 nhóm radio `q_1..q_9` và mỗi nhóm có 5 lựa chọn.
3. Xác nhận `collectPayload()`, `validatePayload_()`, `HEADERS`, `appendResponse_()`, PDF builder và sample test đều dùng cùng schema 9 câu.
4. Kiểm tra cú pháp JavaScript/Apps Script bằng cách phù hợp; không báo là đã chạy trên Apps Script thật nếu mới chỉ kiểm tra local.
5. Chạy website bằng HTTP local và kiểm tra giao diện desktop/mobile nếu môi trường cho phép.
6. Kiểm tra đường dẫn `assets/logo_phu_luong.jpg` tồn tại và tải được.
7. Rà soát diff để không ghi đè thay đổi không liên quan.

Phân biệt rõ trong báo cáo:

- kiểm tra local/static đã thực hiện;
- các bước chỉ có thể xác minh sau khi người quản lý cung cấp Google Sheet ID, Drive folder ID, deploy Apps Script và gửi phiếu thật.

## 8. Kết quả phải bàn giao

Hãy triển khai trực tiếp, không chỉ đưa ví dụ hoặc đoạn code rời. Kết quả tối thiểu gồm:

1. `index.html` hoàn chỉnh cho phiếu Phú Lương.
2. `google_apps_script/Code.gs` hoàn chỉnh, đồng bộ schema 9 câu.
3. `google_apps_script/appsscript.json` hợp lệ.
4. `HUONG_DAN_KHOI_CHAY.md` đầy đủ phần cài đặt, setup, deploy, chạy local, kiểm thử, xử lý lỗi, reset và vận hành.
5. Báo cáo ngắn về file đã sửa, kiểm tra đã chạy, kết quả pass/fail và giới hạn chưa thể xác minh trên hạ tầng Google thật.

## 9. Tiêu chí chấp nhận

- Đủ và đúng 9 nhận định từ `Mẫu số 02.docx`, đúng 3 nhóm và đúng thứ tự.
- Không còn nhóm 18 câu/8 câu của phiếu cũ trong runtime.
- Đủ mục đích, hướng dẫn, lĩnh vực, thông tin người trả lời và lời cảm ơn.
- Logo Phú Lương được dùng từ `assets/logo_phu_luong.jpg`.
- Frontend, payload, backend, Sheet và PDF dùng chung một schema.
- Mã phiếu tự động, chống trùng, hiển thị đủ 3 chữ số từ `001` đến `200`.
- Mỗi lượt thành công ghi một dòng Sheet và tạo một PDF Drive.
- Hướng dẫn cài đặt và khởi chạy có thể copy-paste, không dùng ID/URL thật của hệ thống cũ.
- Không bịa số/ngày kế hoạch hoặc dữ liệu hành chính chưa được cung cấp.
- Code dễ đọc, comment tiếng Việt ở các phần quan trọng, ưu tiên ổn định và dễ bảo trì.
