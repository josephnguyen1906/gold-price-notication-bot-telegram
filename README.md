# 👑 Telegram Bot Báo Giá Vàng 9999 & Phân Tích Mua / Bán Tự Động

Bot Telegram thông minh theo dõi dữ liệu **Giá Vàng 99** (Vàng Nhẫn 9999, Vàng Miếng SJC 9999, Vàng Thế Giới), thống kê tỷ lệ biến động theo **1 tuần, 1 tháng, 3 tháng, 6 tháng**, tự động phân tích và đưa ra **kết luận hành động MUA / BÁN** vào đúng **08:00 sáng hàng ngày**.

---

## 🌟 Tính Năng Nổi Bật

1. **Dữ liệu Vàng 99 chuẩn xác & thời gian thực:**
   - Vàng Nhẫn SJC 9999 (chuẩn tích lũy phổ biến nhất).
   - Vàng Miếng SJC 9999 & Vàng Thế Giới (XAU/USD).
   - Dữ liệu lịch sử 180 ngày (6 tháng) có sẵn, không phụ thuộc cào web dễ lỗi.

2. **Thống kê biến động đa khung thời gian:**
   - So với hôm qua (1 ngày): Số tiền (+/- tr/lượng) và % tăng/giảm.
   - So với 1 tuần trước (7 ngày).
   - So với 1 tháng trước (30 ngày).
   - So với 3 tháng trước (90 ngày).
   - So với 6 tháng trước (180 ngày).
   - Xác định khoảng giá Đỉnh/Đáy 6 tháng và Thước đo vị thế hiện tại (0% = Đáy, 100% = Đỉnh).

3. **Thuật toán phân tích & Kết luận khuyến nghị thông minh:**
   - 🟢 **GIẢM SÂU ➔ KHUYẾN NGHỊ NÊN MUA / TÍCH LŨY:** Kích hoạt khi giá giảm sâu trong tuần, tháng hoặc chiết khấu mạnh từ đỉnh 6 tháng. Đưa ra chiến lược gom hàng DCA chia nhỏ vốn.
   - 🔴 **TĂNG MẠNH ➔ KHUYẾN NGHỊ NÊN BÁN / CHỐT LỜI:** Kích hoạt khi giá tăng nóng trong tuần, 1 tháng, 3 tháng hoặc 6 tháng và neo sát đỉnh. Đưa ra khuyến nghị chốt lời 30% - 50% bảo toàn vốn.
   - 🟡 **ĐI NGANG (SIDEWAY) ➔ KHUYẾN NGHỊ NẮM GIỮ:** Khi thị trường cân bằng, khuyên nhà đầu tư giữ vị thế quan sát.

4. **Lập lịch gửi tự động 08:00 sáng mỗi ngày:**
   - Chạy ngầm chuẩn xác theo múi giờ Việt Nam (`Asia/Ho_Chi_Minh`).
   - Tự động broadcast đến tất cả người dùng đã bấm `/start`.

5. **Bộ lệnh tương tác trực tiếp bất cứ lúc nào:**
   - `/start` - Đăng ký nhận tin 8h sáng & nhận ngay bản tin hiện tại.
   - `/giavang` - Cập nhật giá tức thì.
   - `/thongke` - Xem bảng so sánh số liệu chi tiết tuần, tháng, 3T, 6T.
   - `/khuyennghi` - Xem riêng nhận định chuyên sâu và chiến lược Mua/Bán.
   - `/test` - Bắn thử ngay bản tin 8:00 sáng giả lập.
   - `/stop` - Hủy nhận tin tự động lúc 8h sáng.
   - `/help` - Xem hướng dẫn câu lệnh.

---

## 🚀 Hướng Dẫn Cài Đặt & Sử Dụng

### Bước 1: Lấy Token Bot Telegram (Mất 1 phút)
1. Mở ứng dụng **Telegram**, tìm kiếm bot: `@BotFather`.
2. Gõ `/newbot` và gửi.
3. Đặt **Tên bot** (ví dụ: `Báo Giá Vàng 9999`).
4. Đặt **Username bot** kết thúc bằng chữ `bot` (ví dụ: `giavang9999_bot`).
5. @BotFather sẽ gửi cho bạn một chuỗi **HTTP API Token** có dạng:
   `7123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ_1234567`

### Bước 2: Điền Token vào file `.env`
Mở file `.env` trong thư mục dự án và thay thế dòng sau:
```env
BOT_TOKEN=Điền_Token_Của_Bạn_Vào_Đây
CRON_SCHEDULE=0 8 * * *
TIMEZONE=Asia/Ho_Chi_Minh
```

### Bước 3: Chạy Bot
Bạn có 2 cách chạy cực kỳ đơn giản:

#### Cách 1: Click chuột (Khuyên dùng trên Windows)
- Nhấp đúp vào file **`start.bat`**.

#### Cách 2: Bằng dòng lệnh terminal
```bash
npm start
```

### Bước 4: Nhận tin trên Telegram
1. Mở Telegram, tìm bot của bạn theo username đã tạo.
2. Bấm nút **START** (hoặc gõ `/start`).
3. Bot sẽ tự động lưu tài khoản của bạn vào danh sách nhận tin và gửi ngay 1 bản tin mẫu!
4. Cứ đúng **08:00 sáng mỗi ngày**, bot sẽ tự động gửi báo cáo đầy đủ cho bạn.

---

## 🧪 Chạy Kiểm Thử Không Cần Token Bot

Bạn có thể chạy thử ngay để kiểm tra dữ liệu và thuật toán phân tích:
```bash
npm run test-report
```

---

## 📂 Cấu Trúc Dự Án

```
d:/project/bot-telegram/
├── src/
│   ├── bot.js                  # Entry point chính của bot Telegram
│   ├── config.js               # Đọc file cấu hình .env
│   ├── test-run.js             # File kiểm thử tính toán và định dạng tin nhắn
│   └── services/
│       ├── goldService.js      # Lấy dữ liệu API, tính toán 1d, 7d, 30d, 90d, 180d
│       ├── analysisService.js  # Phân tích kỹ thuật & kết luận Mua/Bán
│       ├── messageFormatter.js # Soạn tin nhắn Telegram HTML bắt mắt
│       ├── scheduler.js        # Lập lịch gửi tin 8h00 sáng (node-cron)
│       └── storageService.js   # Quản lý danh sách người dùng đăng ký (JSON DB)
├── data/                       # Lưu cache giá vàng và danh sách subscribers
├── .env                        # File cấu hình token
├── start.bat                   # File 1-click chạy bot trên Windows
├── package.json
└── README.md
```

---

## ⚡ Hướng Dẫn Chạy Bot 24/7 (Không lo tắt máy / tắt cửa sổ)

Nếu bạn muốn bot chạy ngầm liên tục:
```bash
# Cài đặt PM2
npm install -g pm2

# Khởi chạy bot ngầm
pm2 start src/bot.js --name "gold-bot"

# Cài đặt tự khởi động lại khi bật máy
pm2 startup
pm2 save
```
