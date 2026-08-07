# Design System - Phiếu khảo sát mức độ hài lòng
Version: 2.0
Style: Modern Government UI

---

# 1. Mục tiêu thiết kế

## Mục tiêu

Thiết kế lại giao diện phiếu khảo sát theo phong cách:

- Hiện đại
- Thân thiện
- Chuyên nghiệp
- Dễ đọc
- Dễ thao tác trên điện thoại
- Phù hợp với cơ quan nhà nước
- Tăng trải nghiệm người dân nhưng vẫn giữ tính trang trọng.

**Lưu ý**

KHÔNG thay đổi:

- Nội dung
- Thứ tự câu hỏi
- Quy trình khảo sát
- Logic nghiệp vụ
- Các trường dữ liệu

Chỉ thay đổi:

- UI
- Typography
- Color
- Spacing
- Icon
- Layout

---

# 2. Design Style

## Phong cách

Modern Government

Kết hợp giữa:

- Material Design 3
- Fluent Design
- Gov.UK Design System
- Apple Human Interface

Giao diện tạo cảm giác:

- sạch
- nhẹ
- nhiều khoảng trắng
- ít đường viền
- bo góc mềm
- dễ nhìn

Không sử dụng:

❌ màu quá chói

❌ gradient nhiều màu

❌ viền dày

❌ bảng quá cứng

❌ nền xám đậm

---

# 3. Tone màu

## Primary

```
#0F766E
```

Teal Green

Dùng cho:

- Header
- Button
- Icon
- Tiêu đề section

---

## Primary Hover

```
#0D9488
```

---

## Secondary

```
#14B8A6
```

---

## Accent

```
#22C55E
```

---

## Background

```
#F8FAFC
```

Toàn bộ trang.

---

## Card

```
#FFFFFF
```

---

## Border

```
#E2E8F0
```

---

## Divider

```
#CBD5E1
```

---

## Text Primary

```
#0F172A
```

---

## Text Secondary

```
#475569
```

---

## Placeholder

```
#94A3B8
```

---

## Success

```
#22C55E
```

---

## Warning

```
#F59E0B
```

---

## Error

```
#EF4444
```

---

# 4. Font

Font:

```
Be Vietnam Pro
```

Fallback

```
Inter
Roboto
sans-serif
```

---

Heading

700

---

Section title

700

---

Body

400

---

Button

600

---

# 5. Border Radius

Card

```
20px
```

Input

```
12px
```

Button

```
14px
```

Badge

```
999px
```

---

# 6. Shadow

Card

```
0 8px 24px rgba(15,23,42,.08)
```

Hover

```
0 12px 32px rgba(15,23,42,.12)
```

---

# 7. Layout

Max width

```
1200px
```

Center

```
margin:auto
```

Padding

Desktop

```
40px
```

Tablet

```
24px
```

Mobile

```
16px
```

Khoảng cách giữa section

```
40px
```

Khoảng cách giữa card

```
24px
```

---

# 8. Header

Chiều cao

```
220px
```

Bo góc

```
20px
20px
0
0
```

Background

Gradient

```
#0F766E

↓

#0D9488
```

Bên trái:

Logo

Tên đơn vị

Tên biểu mẫu

Mô tả

Bên phải:

Illustration

Phong cách Flat Illustration

Không dùng ảnh thật.

Có thể gồm:

- tòa nhà UBND
- cây xanh
- mây
- skyline

Opacity khoảng

```
15%
```

---

# 9. Section

Mỗi section là một card riêng.

Ví dụ

Thông tin chung

↓

Nội dung khảo sát

↓

Thông tin người trả lời

Card:

```
background:white;

border-radius:20px;

padding:32px;

box-shadow nhẹ
```

---

# 10. Section Title

Có icon.

Ví dụ

Thông tin chung

↓

Icon Info

Nội dung khảo sát

↓

Icon Clipboard

Thông tin người trả lời

↓

Icon User

Màu icon

```
Primary
```

Font

28px

Bold

---

# 11. Hướng dẫn đánh giá

Hiển thị thành 5 card.

Ví dụ

😊

5

Rất hài lòng

🙂

4

Hài lòng

😐

3

Bình thường

🙁

2

Không hài lòng

😡

1

Rất không hài lòng

Card

```
height:110px

border-radius:14px

background:white

border:1px solid Border

hover nâng nhẹ
```

---

# 12. Input

Height

```
48px
```

Radius

```
12px
```

Border

```
1px solid Border
```

Focus

```
border Primary

shadow teal nhẹ
```

Placeholder

Màu xám.

---

# 13. Bảng khảo sát

Giữ nguyên cấu trúc.

Nhưng cải tiến:

Không dùng viền đậm.

Dùng:

```
border-bottom

#EDF2F7
```

Header nền

```
#F8FAFC
```

Tên nhóm

Nền xanh nhạt

```
#DFF7F3
```

Font đậm.

Các dòng:

Hover đổi nền

```
#F8FAFC
```

---

# 14. Radio Button

Kích thước

```
22px
```

Checked

Primary

Hover

Scale nhẹ.

---

# 15. Card thông tin người trả lời

Desktop

3 cột

Tablet

2 cột

Mobile

1 cột

Card

```
padding 24

radius 16
```

Có icon ở tiêu đề.

---

# 16. Button

Chỉ có một button chính.

Text

```
Gửi phiếu khảo sát
```

Height

```
52px
```

Padding

```
32px
```

Radius

```
999px
```

Background

Gradient

```
#0F766E

↓

#0D9488
```

Hover

- sáng hơn
- nâng 2px

Shadow

```
0 8px 24px rgba(13,148,136,.25)
```

---

# 17. Icon

Sử dụng

Lucide

hoặc

Heroicons

Không dùng icon màu mè.

Icon nét mảnh.

---

# 18. Khoảng trắng

Ưu tiên nhiều khoảng trắng.

Không để các thành phần sát nhau.

Section

```
40px
```

Card

```
24px
```

Input

```
16px
```

---

# 19. Responsive

Desktop

≥1200px

Tablet

768-1199px

Mobile

≤767px

Header tự co.

Các card tự xuống hàng.

Không xuất hiện scroll ngang.

---

# 20. Animation

Transition

```
0.25s ease
```

Hover Card

```
translateY(-2px)
```

Button

```
scale(1.02)
```

Input Focus

Border đổi màu.

---

# 21. Accessibility

Contrast tối thiểu

4.5:1

Hit Area

≥44px

Label luôn hiển thị.

Không chỉ dùng màu để biểu thị trạng thái.

---

# 22. Thành phần không được thay đổi

BẮT BUỘC GIỮ NGUYÊN

✓ Nội dung

✓ Thứ tự câu hỏi

✓ Logic đánh giá

✓ Thang điểm 1-5

✓ Các nhóm khảo sát

✓ Thông tin người trả lời

✓ Mã phiếu

✓ Nút gửi

✓ Tên trường dữ liệu

Chỉ thay đổi giao diện.

---

# 23. Cảm xúc thiết kế

Khi người dân mở biểu mẫu phải có cảm giác:

✓ Chuyên nghiệp

✓ Tin cậy

✓ Thân thiện

✓ Hiện đại

✓ Dễ sử dụng

✓ Không giống biểu mẫu hành chính truyền thống

Nhưng vẫn đủ nghiêm túc để phù hợp với giao diện của UBND phường.
