import cron from 'node-cron';
import { config } from '../config.js';
import { storageService } from './storageService.js';
import { goldService } from './goldService.js';
import { messageFormatter } from './messageFormatter.js';

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

      let sent = 0;
      let failed = 0;

      for (const sub of subscribers) {
        try {
          await bot.api.sendMessage(sub.chatId, message, { parse_mode: 'HTML' });
          sent++;
          console.log(`  ✓ Đã gửi thành công tới chatId: ${sub.chatId} (${sub.firstName || sub.username || 'User'})`);
          // Nghỉ 50ms giữa các tin nhắn để tuân thủ Telegram API rate limit
          await new Promise(r => setTimeout(r, 50));
        } catch (err) {
          failed++;
          console.error(`  ✗ Lỗi gửi tới chatId ${sub.chatId}:`, err.message);
          // Nếu user đã block bot, đánh dấu hoặc xóa
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
