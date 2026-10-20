import { Bot } from 'grammy';
import { config } from './config.js';
import { storageService } from './services/storageService.js';
import { goldService } from './services/goldService.js';
import { messageFormatter } from './services/messageFormatter.js';
import { scheduler } from './services/scheduler.js';

const isPlaceholder = !config.botToken || 
  config.botToken === 'YOUR_TELEGRAM_BOT_TOKEN' || 
  config.botToken === 'YOUR_TELEGRAM_BOT_TOKEN_HERE' ||
  !config.botToken.includes(':');

if (isPlaceholder) {
  console.log('====================================================');
  console.log('⚠️  CHƯA CẤU HÌNH BOT TOKEN TELEGRAM TRONG FILE .env');
  console.log('====================================================');
  console.log('👉 Vui lòng mở file .env và điền BOT_TOKEN từ @BotFather:');
  console.log('   BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ');
  console.log('');
  console.log('💡 Hướng dẫn nhanh:');
  console.log('   1. Mở Telegram, chat với @BotFather');
  console.log('   2. Gõ lệnh /newbot để tạo bot và nhận token');
  console.log('   3. Dán token vào file .env rồi chạy lại: npm start hoặc click start.bat');
  console.log('====================================================\n');
  process.exit(1);
}

const bot = new Bot(config.botToken);

// Cấu hình menu câu lệnh hiển thị trên Telegram
async function setupBotCommands() {
  try {
    await bot.api.setMyCommands([
      { command: 'start', description: 'Đăng ký & nhận bản tin 8h sáng' },
      { command: 'giavang', description: 'Xem giá vàng 9999 mới nhất' },
      { command: 'thongke', description: 'Thống kê biến động tuần/tháng/3T/6T' },
      { command: 'khuyennghi', description: 'Kết luận & khuyến nghị Mua/Bán' },
      { command: 'test', description: 'Bắn thử thông báo 8h sáng ngay lập tức' },
      { command: 'stop', description: 'Tạm dừng nhận tin 8h sáng' },
      { command: 'help', description: 'Xem hướng dẫn sử dụng' }
    ]);
    console.log('[Bot] Đã đăng ký menu câu lệnh với Telegram thành công.');
  } catch (err) {
    console.warn('[Bot] Không thể đăng ký setMyCommands:', err.message);
  }
}

// LỆNH: /start
bot.command('start', async (ctx) => {
  const chatId = ctx.chat.id;
  storageService.addSubscriber(chatId, ctx.from);

  const welcomeMsg = `👋 <b>Chào mừng bạn đến với Bot Báo Giá Vàng 9999 & Phân Tích Xu Hướng!</b>\n\n` +
    `✅ <b>Đã đăng ký thành công!</b> Bạn sẽ tự động nhận bản tin giá vàng đầy đủ vào lúc <b>08:00 sáng mỗi ngày</b>.\n\n` +
    `📌 <b>Nội dung bản tin mỗi ngày gồm có:</b>\n` +
    `  • Giá Vàng Nhẫn 9999 & Vàng Miếng SJC 9999 chuẩn xác.\n` +
    `  • Thống kê tỷ lệ tăng/giảm % theo 1 tuần, 1 tháng, 3 tháng, 6 tháng.\n` +
    `  • Đánh giá mức độ giảm sâu hay tăng nóng.\n` +
    `  • <b>Kết luận rõ ràng:</b> Khi nào NÊN MUA (giảm sâu) hoặc NÊN BÁN (tăng mạnh chốt lời).\n\n` +
    `⏳ <i>Đang tải dữ liệu thực tế hôm nay gửi bạn tham khảo ngay...</i>`;

  await ctx.reply(welcomeMsg, { parse_mode: 'HTML' });

  try {
    const goldData = await goldService.getFullGoldData();
    const report = messageFormatter.formatDailyReport(goldData);
    await ctx.reply(report, { parse_mode: 'HTML' });
  } catch (error) {
    await ctx.reply('⚠️ Không thể tải dữ liệu giá vàng lúc này. Vui lòng thử lại bằng lệnh /giavang.');
  }
});

// LỆNH: /giavang hoặc /today
bot.command(['giavang', 'today', 'now'], async (ctx) => {
  await ctx.reply('⏳ Đang lấy dữ liệu giá vàng 99 mới nhất...');
  try {
    const goldData = await goldService.getFullGoldData();
    const message = messageFormatter.formatQuickPrice(goldData);
    await ctx.reply(message, { parse_mode: 'HTML' });
  } catch (error) {
    await ctx.reply(`❌ Lỗi lấy dữ liệu: ${error.message}`);
  }
});

// LỆNH: /thongke
bot.command('thongke', async (ctx) => {
  await ctx.reply('⏳ Đang tổng hợp thống kê lịch sử 7 ngày, 1 tháng, 3 tháng và 6 tháng...');
  try {
    const goldData = await goldService.getFullGoldData();
    const message = messageFormatter.formatDetailedStats(goldData);
    await ctx.reply(message, { parse_mode: 'HTML' });
  } catch (error) {
    await ctx.reply(`❌ Lỗi tổng hợp thống kê: ${error.message}`);
  }
});

// LỆNH: /khuyennghi
bot.command('khuyennghi', async (ctx) => {
  try {
    const goldData = await goldService.getFullGoldData();
    const { ringStats } = goldData;
    const { analysisService } = await import('./services/analysisService.js');
    const analysis = analysisService.analyze(ringStats);

    let msg = `🎯 <b>KẾT LUẬN & KHUYẾN NGHỊ ĐẦU TƯ VÀNG 9999</b>\n`;
    msg += `👉 <b>Khuyến nghị:</b> <b>${analysis.badge}</b>\n`;
    msg += `📌 <b>Hiện trạng:</b> <b>${analysis.title}</b>\n\n`;
    if (analysis.reasons && analysis.reasons.length > 0) {
      msg += `<b>Các tiêu chí kỹ thuật:</b>\n`;
      analysis.reasons.forEach(r => {
        msg += `  • ${r}\n`;
      });
      msg += `\n`;
    }
    msg += `💡 <b>Lời khuyên cụ thể:</b>\n`;
    msg += `<i>${analysis.advice}</i>`;

    await ctx.reply(msg, { parse_mode: 'HTML' });
  } catch (error) {
    await ctx.reply(`❌ Lỗi: ${error.message}`);
  }
});

// LỆNH: /test - Bắn thử ngay thông báo 8h sáng
bot.command('test', async (ctx) => {
  await ctx.reply('🚀 Đang tạo và gửi bản tin giả lập 8:00 sáng cho bạn...');
  try {
    const goldData = await goldService.getFullGoldData();
    const message = messageFormatter.formatDailyReport(goldData);
    await ctx.reply(message, { parse_mode: 'HTML' });
  } catch (error) {
    await ctx.reply(`❌ Lỗi tạo bản tin test: ${error.message}`);
  }
});

// LỆNH: /stop
bot.command('stop', async (ctx) => {
  const chatId = ctx.chat.id;
  storageService.removeSubscriber(chatId);
  await ctx.reply(
    `🔕 <b>Đã hủy đăng ký nhận thông báo 8:00 sáng!</b>\n` +
    `Bạn có thể gõ lại /start bất kỳ lúc nào để nhận lại bản tin.`,
    { parse_mode: 'HTML' }
  );
});

// LỆNH: /help
bot.command('help', async (ctx) => {
  const helpMsg = `📖 <b>DANH SÁCH CÂU LỆNH BOT GIÁ VÀNG:</b>\n\n` +
    `/start - Đăng ký nhận tin tự động lúc 08:00 sáng mỗi ngày\n` +
    `/giavang - Xem giá vàng nhẫn 9999 & SJC 9999 hiện tại\n` +
    `/thongke - Xem bảng so sánh % tăng/giảm (tuần, tháng, 3T, 6T)\n` +
    `/khuyennghi - Xem riêng nhận định MUA hay BÁN\n` +
    `/test - Bắn thử bản tin 08:00 sáng ngay tức thì\n` +
    `/stop - Tắt nhận tin tự động hàng ngày\n` +
    `/help - Xem trợ giúp này\n\n` +
    `⏰ <i>Bot tự động gửi báo cáo mỗi ngày vào 08:00 AM (Giờ Việt Nam).</i>`;
  await ctx.reply(helpMsg, { parse_mode: 'HTML' });
});

// Bắt lỗi không làm crash bot
bot.catch((err) => {
  console.error(`[Bot Error] Lỗi xử lý update:`, err.error?.message || err);
});

// Khởi chạy bot
async function startApp() {
  console.log('----------------------------------------------------');
  console.log('🤖 KHỞI ĐỘNG TELEGRAM BOT THÔNG BÁO GIÁ VÀNG 9999');
  console.log('----------------------------------------------------');

  await setupBotCommands();
  scheduler.start(bot);

  const subscribers = storageService.getSubscribers();
  console.log(`[Database] Đang có ${subscribers.length} người đăng ký nhận tin 8h sáng.`);

  bot.start({
    onStart: (botInfo) => {
      console.log(`\n🎉 Bot đã chạy thành công với username: @${botInfo.username}`);
      console.log(`⏰ Lịch gửi tin tự động: 08:00 AM hàng ngày.`);
      console.log(`👉 Hãy mở Telegram, tìm @${botInfo.username} và gõ /start để kích hoạt!\n`);
    }
  });
}

startApp();

// Xử lý dừng tiến trình an toàn
process.once('SIGINT', () => {
  console.log('\n[Bot] Đang dừng bot...');
  bot.stop();
  process.exit(0);
});
process.once('SIGTERM', () => {
  console.log('\n[Bot] Đang dừng bot...');
  bot.stop();
  process.exit(0);
});
