import cron from 'node-cron';
import { InputFile, InlineKeyboard } from 'grammy';
import { config } from '../config.js';
import { storageService } from './storageService.js';
import { goldService } from './goldService.js';
import { messageFormatter } from './messageFormatter.js';
import { chartService } from './chartService.js';

function createChartKeyboard(currentDays = 7, currentType = 'SJ9999') {
  const keyboard = new InlineKeyboard();
  keyboard.text('7 Ngày', `chart_7_${currentType}`);
  keyboard.text('14 Ngày', `chart_14_${currentType}`);
  keyboard.text('30 Ngày', `chart_30_${currentType}`);
  keyboard.row();
  keyboard.text('3 Tháng', `chart_90_${currentType}`);
  keyboard.text('6 Tháng', `chart_180_${currentType}`);
  keyboard.row();
  const isRing = currentType === 'SJ9999';
  keyboard.text(isRing ? '🔘 💍 Vàng Nhẫn 9999' : '💍 Vàng Nhẫn 9999', `chart_${currentDays}_SJ9999`);
  keyboard.text(!isRing ? '🔘 🧱 Vàng Miếng SJC' : '🧱 Vàng Miếng SJC', `chart_${currentDays}_SJL1L10`);
  return keyboard;
}

export const scheduler = {
  job: null,

  // Khởi động lịch chạy cron gửi tin 8h00 sáng
  start(bot) {
    if (this.job) {
      this.job.stop();
    }

    console.log(`[Scheduler] Đã lên lịch cron: "${config.cronSchedule}" (Múi giờ: ${config.timezone})`);

    this.job = cron.schedule(
      config.cronSchedule,
      async () => {
        console.log(`\n⏰ [${new Date().toLocaleTimeString('vi-VN')}] Bắt đầu tiến trình gửi tin thông báo giá vàng 8:00 sáng...`);
        await this.broadcastDailyReport(bot);
      },
      {
        timezone: config.timezone
      }
    );
  },

  // Gửi thông báo đến toàn bộ danh sách subscribers
  async broadcastDailyReport(bot) {
    try {
      const subscribers = storageService.getSubscribers();
      if (!subscribers || subscribers.length === 0) {
        console.log('[Scheduler] Chưa có người đăng ký (subscriber) nào để gửi tin.');
        return { total: 0, sent: 0, failed: 0 };
      }

      console.log(`[Scheduler] Đang lấy dữ liệu giá vàng mới nhất cho ${subscribers.length} người nhận...`);
      const goldData = await goldService.getFullGoldData();
      const message = messageFormatter.formatDailyReport(goldData);

      // Tải sẵn biểu đồ 7 ngày để gửi kèm
      let chartBuffer = null;
      let chartMeta = null;
      try {
        const res = await chartService.getChartBuffer(7, 'SJ9999');
        chartBuffer = res.buffer;
        chartMeta = res.meta;
      } catch (e) {
        console.warn('[Scheduler] Không thể tải biểu đồ cho broadcast:', e.message);
      }

      let sent = 0;
      let failed = 0;

      for (const sub of subscribers) {
        try {
          // Gửi bản tin văn bản đầy đủ
          await bot.api.sendMessage(sub.chatId, message, { parse_mode: 'HTML' });

          // Gửi kèm hình ảnh biểu đồ nếu có
          if (chartBuffer && chartMeta) {
            const caption = `📊 <b>Biểu đồ giá vàng 7 ngày gần nhất</b> (${chartMeta.trendText})\n<i>Bấm các nút bên dưới để đổi khung thời gian:</i>`;
            await bot.api.sendPhoto(sub.chatId, new InputFile(chartBuffer, 'gold-chart.png'), {
              caption,
              parse_mode: 'HTML',
              reply_markup: createChartKeyboard(7, 'SJ9999')
            });
          }

          sent++;
          console.log(`  ✓ Đã gửi thành công tới chatId: ${sub.chatId} (${sub.firstName || sub.username || 'User'})`);
          // Nghỉ 100ms giữa các tin nhắn để tuân thủ Telegram API rate limit
          await new Promise(r => setTimeout(r, 100));
        } catch (err) {
          failed++;
          console.error(`  ✗ Lỗi gửi tới chatId ${sub.chatId}:`, err.message);
          // Nếu user đã block bot, xóa khỏi danh sách
          if (err.description && err.description.includes('bot was blocked by the user')) {
            console.log(`  ⚠️ User ${sub.chatId} đã chặn bot. Đang xóa khỏi danh sách...`);
            storageService.removeSubscriber(sub.chatId);
          }
        }
      }

      console.log(`[Scheduler] Hoàn tất gửi tin: Thành công ${sent}/${subscribers.length}, Thất bại: ${failed}`);
      return { total: subscribers.length, sent, failed };
    } catch (err) {
      console.error('[Scheduler] Lỗi nghiêm trọng khi chạy broadcastDailyReport:', err.message);
      return { total: 0, sent: 0, failed: 1, error: err.message };
    }
  }
};
