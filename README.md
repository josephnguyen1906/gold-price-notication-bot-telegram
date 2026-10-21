# 👑 Telegram Bot Báo Giá Vàng 9999 & Phân Tích Mua / Bán Tự Động

Bot Telegram thông minh tự động theo dõi **Giá Vàng 99** (Vàng Nhẫn 9999, Vàng Miếng SJC 9999, Vàng Thế Giới XAU/USD), **vẽ biểu đồ giá trực quan theo ngày**, thống kê tỷ lệ biến động theo **1 tuần, 1 tháng, 3 tháng, 6 tháng**, và tự động phân tích đưa ra **kết luận hành động MUA / BÁN** vào đúng **08:00 sáng hàng ngày**.

---

## 🌟 Tính Năng Nổi Bật

1. **Dữ liệu Vàng 99 chuẩn xác & thời gian thực:**
   - 💍 **Vàng Nhẫn SJC 9999** (chuẩn tích lũy phổ biến nhất của người dân).
   - 🧱 **Vàng Miếng SJC 9999** & 🌍 **Vàng Thế Giới (XAU/USD)**.
   - Dữ liệu lịch sử 180 ngày (6 tháng) có sẵn, không phụ thuộc cào web dễ lỗi.

2. **📊 Vẽ biểu đồ giá trực quan theo ngày (`/chart`):**
   - Tạo biểu đồ hình ảnh độ phân giải cao với giao diện **Dark Mode** hiện đại.
   - Hiển thị đầy đủ đường giá Mua vào - Bán ra, biên độ Đỉnh - Đáy, % biến động.
   - Hỗ trợ các khung thời gian linh hoạt: **7 ngày, 14 ngày, 30 ngày (1 tháng), 90 ngày (3 tháng), 180 ngày (6 tháng)**.
   - Tích hợp **nút bấm Inline Keyboard** ngay trong tin nhắn Telegram để chuyển đổi ngày và loại vàng chỉ bằng 1 chạm.

3. **Thống kê biến động đa khung thời gian:**
   - So với hôm qua (1 ngày): Số tiền (+/- tr/lượng) và % tăng/giảm.
   - So với 1 tuần trước (7 ngày).
   - So với 1 tháng trước (30 ngày).
   - So với 3 tháng trước (90 ngày).
   - So với 6 tháng trước (180 ngày).
   - Xác định khoảng giá Đỉnh/Đáy 6 tháng và Thước đo vị thế hiện tại (0% = Đáy, 100% = Đỉnh).

4. **Thuật toán phân tích & Kết luận khuyến nghị thông minh:**
   - 🟢 **GIẢM SÂU ➔ KHUYẾN NGHỊ NÊN MUA / TÍCH LŨY:** Kích hoạt khi giá giảm sâu trong tuần, tháng hoặc chiết khấu mạnh từ đỉnh 6 tháng. Đưa ra chiến lược gom hàng DCA chia nhỏ vốn.
   - 🔴 **TĂNG MẠNH ➔ KHUYẾN NGHỊ NÊN BÁN / CHỐT LỜI:** Kích hoạt khi giá tăng nóng trong tuần, 1 tháng, 3 tháng hoặc 6 tháng và neo sát đỉnh. Đưa ra khuyến nghị chốt lời 30% - 50% bảo toàn vốn.
   - 🟡 **ĐI NGANG (SIDEWAY) ➔ KHUYẾN NGHỊ NẮM GIỮ:** Khi thị trường cân bằng, khuyên nhà đầu tư giữ vị thế quan sát.

5. **Lập lịch gửi tự động 08:00 sáng mỗi ngày:**
   - Tự động gửi bản tin phân tích kèm hình ảnh biểu đồ 7 ngày gần nhất đến tất cả người dùng đăng ký vào 08:00 sáng (Múi giờ `Asia/Ho_Chi_Minh`).

---

## 📱 Danh Sách Câu Lệnh Bot

| Lệnh | Mô tả |
| :--- | :--- |
| `/start` | Đăng ký nhận tin tự động lúc 08:00 sáng & nhận ngay bản tin hiện tại kèm biểu đồ |
| `/chart` | Xem biểu đồ biến động giá vàng (mặc định 7 ngày, kèm nút bấm chọn 14d, 30d, 90d, 180d) |
| `/giavang` | Xem giá vàng nhẫn 9999 & SJC 9999 mới nhất tức thì |
| `/thongke` | Xem bảng thống kê chi tiết tỷ lệ % tăng/giảm các mốc 1 ngày, tuần, tháng, 3T, 6T |
| `/khuyennghi` | Xem phân tích kỹ thuật và kết luận chiến lược MUA / BÁN |
| `/test` | Bắn thử bản tin 08:00 sáng kèm biểu đồ ngay lập tức |
| `/stop` | Hủy đăng ký nhận tin tự động |
| `/help` | Xem danh sách hướng dẫn câu lệnh |

> 💡 **Mẹo:** Bạn có thể gõ trực tiếp `/chart 30` để xem biểu đồ 30 ngày, hoặc `/chart sjc` để xem biểu đồ vàng miếng SJC.

---

## 🛠️ Cài Đặt & Chạy Thử Ở Máy Local (Windows / Mac)

### 1. Chuẩn bị:
- Đã cài đặt [Node.js](https://nodejs.org/) (khuyên dùng Node.js 18, 20 hoặc 22 LTS).

### 2. Lấy Bot Token từ Telegram:
1. Mở Telegram, tìm kiếm bot **`@BotFather`**.
2. Gõ `/newbot` và làm theo hướng dẫn để đặt tên và username cho bot.
3. Sao chép chuỗi **Token** (ví dụ: `7123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`).

### 3. Cấu hình file `.env`:
Tạo file `.env` từ `.env.example` và điền token:
```env
BOT_TOKEN=Điền_Token_Từ_BotFather_Vào_Đây
CRON_SCHEDULE=0 8 * * *
TIMEZONE=Asia/Ho_Chi_Minh
```

### 4. Chạy bot:
```bash
# Cài đặt thư viện
npm install

# Kiểm tra dữ liệu & biểu đồ không cần token:
npm run test-report

# Khởi động bot:
npm start
```
*(Trên Windows, bạn chỉ cần nhấp đúp vào file `start.bat` để chạy).*

---


## 📂 Cấu Trúc Mã Nguồn

```
bot-telegram/
├── src/
│   ├── bot.js                  # Entry point chính xử lý các lệnh và tương tác Telegram
│   ├── config.js               # Đọc file cấu hình .env và thiết lập mặc định
│   ├── test-run.js             # File kiểm thử độc lập dữ liệu, phân tích và biểu đồ
│   └── services/
│       ├── goldService.js      # Lấy dữ liệu API giá vàng, tính toán % thay đổi 1d/7d/30d/90d/180d
│       ├── analysisService.js  # Thuật toán phân tích kỹ thuật & kết luận Mua/Bán
│       ├── chartService.js     # Tạo biểu đồ hình ảnh Dark Mode chuẩn xác qua QuickChart
│       ├── messageFormatter.js # Định dạng tin nhắn Telegram HTML bắt mắt
│       ├── scheduler.js        # Lập lịch gửi tin và biểu đồ lúc 8:00 AM (node-cron)
│       └── storageService.js   # Quản lý danh sách người dùng đăng ký nhận tin (JSON DB)
├── data/                       # Lưu trữ danh sách subscribers & cache dữ liệu
├── .env.example                # File mẫu cấu hình biến môi trường
├── .gitignore                  # Cấu hình loại trừ file nhạy cảm khi đẩy lên Git
├── start.bat                   # File 1-click chạy bot trên Windows
├── package.json
└── README.md
```

---

## 📜 Giấy Phép & Tuyên Bố Miễn Trừ Trách Nhiệm
- Dữ liệu giá vàng được tổng hợp từ các tổ chức kinh doanh vàng uy tín tại Việt Nam (SJC, DOJI, Bảo Tín Minh Châu).
- Các nhận định, khuyến nghị MUA / BÁN do bot đưa ra mang tính chất tham khảo kỹ thuật dựa trên chuỗi dữ liệu biến động giá lịch sử, không phải là lời khuyên đầu tư tài chính pháp lý.
