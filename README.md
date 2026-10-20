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

## 🚀 Hướng Dẫn Publish Dự Án Lên GitHub

### Bước 1: Tạo Repository mới trên GitHub
1. Đăng nhập vào tài khoản [GitHub](https://github.com/).
2. Bấm vào dấu `+` ở góc trên bên phải ➔ chọn **New repository**.
3. Điền tên repository (ví dụ: `telegram-gold-price-bot`).
4. Chọn chế độ **Public** hoặc **Private** tùy bạn.
5. **Không** tích chọn "Initialize this repository with a README" (vì dự án đã có sẵn).
6. Bấm **Create repository**.

### Bước 2: Đẩy mã nguồn từ máy tính lên GitHub
Mở Terminal / PowerShell tại thư mục dự án và chạy các lệnh sau:

```bash
# 1. Đảm bảo file .env không bị đẩy lên (đã cấu hình trong .gitignore)
git status

# 2. Thêm toàn bộ file vào git
git add .

# 3. Tạo commit
git commit -m "feat: complete telegram gold price bot with daily chart and analysis"

# 4. Đổi nhánh chính sang main
git branch -M main

# 5. Thêm đường dẫn repository GitHub của bạn (thay username/repo tương ứng)
git remote add origin https://github.com/USERNAME/telegram-gold-price-bot.git

# 6. Đẩy mã nguồn lên GitHub
git push -u origin main
```

> ⚠️ **LƯU Ý BẢO MẬT:** Tuyệt đối không bao giờ commit file `.env` chứa token bot lên GitHub. File `.gitignore` đã được cấu hình sẵn để tự động bỏ qua file `.env`.

---

## 🌐 Hướng Dẫn Deploy Lên VPS aaPanel (Chạy 24/7)

**aaPanel** là bảng điều khiển VPS rất phổ biến và dễ dùng. Dưới đây là 2 cách thiết lập bot chạy vĩnh viễn 24/7 trên aaPanel:

---

### CÁCH 1: Triển khai qua Giao Diện aaPanel (Node project) - KHUYÊN DÙNG ⭐

#### Bước 1: Cài đặt Node.js Version Manager trên aaPanel
1. Đăng nhập vào bảng điều khiển **aaPanel** của bạn.
2. Vào mục **App Store** ở thanh menu bên trái.
3. Tìm kiếm từ khóa: `Node` hoặc `Node.js Version Manager`.
4. Bấm **Install** để cài đặt.
5. Sau khi cài xong, mở **Node.js Version Manager**, tại tab **Node version**, chọn cài đặt phiên bản **v20.x** hoặc **v22.x LTS**.

#### Bước 2: Tải mã nguồn lên VPS
Bạn có thể chọn 1 trong 2 cách:
- **Cách qua Git (Khuyên dùng):**
  1. Vào menu **Files** trong aaPanel ➔ chuyển tới thư mục `/www/wwwroot/`.
  2. Bấm **Terminal** và gõ:
     ```bash
     cd /www/wwwroot
     git clone https://github.com/USERNAME/telegram-gold-price-bot.git bot-telegram
     cd bot-telegram
     npm install
     ```
- **Cách upload file zip:**
  1. Nén toàn bộ thư mục dự án trên máy tính thành file `.zip` (trừ thư mục `node_modules`).
  2. Trong aaPanel, vào **Files** ➔ `/www/wwwroot/` ➔ bấm **Upload** và tải file `.zip` lên.
  3. Bấm chuột phải vào file `.zip` ➔ chọn **Uncompress** giải nén vào `/www/wwwroot/bot-telegram`.
  4. Mở Terminal tại thư mục đó và chạy: `npm install`.

#### Bước 3: Tạo file `.env` trên VPS
1. Trong aaPanel ➔ **Files** ➔ truy cập thư mục `/www/wwwroot/bot-telegram/`.
2. Tạo file mới đặt tên là `.env`.
3. Nhấp đúp chuột để chỉnh sửa và dán nội dung:
   ```env
   BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ
   CRON_SCHEDULE=0 8 * * *
   TIMEZONE=Asia/Ho_Chi_Minh
   ```
4. Bấm **Save** (Lưu lại).

#### Bước 4: Tạo Node Project để chạy Bot 24/7
1. Trong aaPanel, vào menu **Website** ở cột bên trái.
2. Chọn tab **Node project** ➔ Bấm nút **Add Node project**.
3. Điền các thông số như sau:
   - **Path (Đường dẫn):** `/www/wwwroot/bot-telegram`
   - **Project name:** `bot-telegram-giavang`
   - **Run script:** `src/bot.js` (hoặc chọn Custom run command: `node src/bot.js`)
   - **Node version:** Chọn phiên bản Node vừa cài đặt (v20 hoặc v22)
   - **Package Manager:** `npm`
4. Bấm **Submit**.
5. Hệ thống aaPanel (sử dụng PM2 ngầm) sẽ tự động khởi chạy bot. Bạn có thể bấm vào mục **Log** bên cạnh tên project để xem trạng thái hoạt động trực tiếp!

---

### CÁCH 2: Triển khai nhanh qua Terminal SSH bằng PM2

Nếu bạn quen dùng dòng lệnh SSH (Terminal, PuTTY, MobaXterm):

```bash
# 1. Truy cập thư mục web
cd /www/wwwroot

# 2. Clone mã nguồn
git clone https://github.com/USERNAME/telegram-gold-price-bot.git bot-telegram
cd bot-telegram

# 3. Cài đặt dependencies
npm install

# 4. Tạo file cấu hình .env
cp .env.example .env
nano .env
# (Điền BOT_TOKEN của bạn vào rồi bấm Ctrl + O -> Enter để lưu, Ctrl + X để thoát)

# 5. Cài đặt PM2 để chạy nền vĩnh viễn
npm install -g pm2

# 6. Khởi động bot bằng PM2
pm2 start src/bot.js --name "bot-giavang"

# 7. Lưu lại danh sách PM2 để tự bật lại khi khởi động lại VPS
pm2 save
pm2 startup
```

#### Một số lệnh hữu ích khi quản lý Bot trên VPS:
- Xem nhật ký hoạt động (Logs): `pm2 logs bot-giavang`
- Khởi động lại Bot: `pm2 restart bot-giavang`
- Dừng Bot: `pm2 stop bot-giavang`
- Kiểm tra trạng thái: `pm2 status`
- Cập nhật code mới từ Git:
  ```bash
  cd /www/wwwroot/bot-telegram
  git pull
  npm install
  pm2 restart bot-giavang
  ```

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
