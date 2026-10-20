import { Bot, InputFile, InlineKeyboard } from 'grammy';
import { config } from './config.js';
import { storageService } from './services/storageService.js';
import { goldService, GOLD_TYPES } from './services/goldService.js';
import { messageFormatter } from './services/messageFormatter.js';
import { scheduler } from './services/scheduler.js';
import { chartService } from './services/chartService.js';

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

// Tạo bàn phím Inline Keyboard cho biểu đồ
function createChartKeyboard(currentDays = 7, currentType = 'SJ9999') {
  const keyboard = new InlineKeyboard();

  // Hàng 1: Các khung thời gian ngắn
  const daysList = [7, 14, 30];
  daysList.forEach(d => {
    const label = d === currentDays ? `🔘 ${d} Ngày` : `${d} Ngày`;
    keyboard.text(label, `chart_${d}_${currentType}`);
  });
  keyboard.row();

  // Hàng 2: Các khung thời gian dài
  const longDays = [90, 180];
  longDays.forEach(d => {
    const label = d === currentDays ? `🔘 ${d === 90 ? '3 Tháng' : '6 Tháng'}` : (d === 90 ? '3 Tháng' : '6 Tháng');
    keyboard.text(label, `chart_${d}_${currentType}`);
  });
  keyboard.row();

  // Hàng 3: Đổi loại vàng
  const isRing = currentType === 'SJ9999';
  keyboard.text(isRing ? '🔘 💍 Vàng Nhẫn 9999' : '💍 Vàng Nhẫn 9999', `chart_${currentDays}_SJ9999`);
  keyboard.text(!isRing ? '🔘 🧱 Vàng Miếng SJC' : '🧱 Vàng Miếng SJC', `chart_${currentDays}_SJL1L10`);

  return keyboard;
}

// Cấu hình menu câu lệnh hiển thị trên Telegram
async function setupBotCommands() {
  try {
    await bot.api.setMyCommands([
      { command: 'start', description: 'Đăng ký & nhận bản tin 8h sáng' },
      { command: 'chart', description: 'Xem biểu đồ giá vàng (7d/30d/90d/180d)' },
      { command: 'giavang', description: 'Xem giá vàng 9999 mới nhất' },
      { command: 'thongke', description: 'Thống kê biến động tuần/tháng/3T/6T' },
      { command: 'khuyennghi', description: 'Kết luận & khuyến nghị Mua/Bán' },
      { command: 'test', description: 'Bắn thử thông báo 8h sáng kèm biểu đồ' },
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
    `  • <b>Kết luận rõ ràng:</b> Khi nào NÊN MUA (giảm sâu) hoặc NÊN BÁN (tăng mạnh chốt lời).\n` +
    `  • <b>Biểu đồ trực quan:</b> Xem biến động giá theo ngày.\n\n` +
    `⏳ <i>Đang tải dữ liệu thực tế hôm nay gửi bạn tham khảo ngay...</i>`;

  await ctx.reply(welcomeMsg, { parse_mode: 'HTML' });

  try {
    const goldData = await goldService.getFullGoldData();
    const report = messageFormatter.formatDailyReport(goldData);
    await ctx.reply(report, { parse_mode: 'HTML' });

    // Gửi kèm biểu đồ 7 ngày mẫu
    const { buffer, meta } = await chartService.getChartBuffer(7, 'SJ9999');
    const caption = `📊 <b>Biểu đồ giá vàng 7 ngày gần nhất</b> (${meta.trendText})\n<i>Bấm các nút bên dưới để đổi khung thời gian hoặc loại vàng:</i>`;
    await ctx.replyWithPhoto(new InputFile(buffer, 'gold-chart.png'), {
      caption,
      parse_mode: 'HTML',
      reply_markup: createChartKeyboard(7, 'SJ9999')
    });
  } catch (error) {
    await ctx.reply('⚠️ Không thể tải dữ liệu giá vàng lúc này. Vui lòng thử lại bằng lệnh /giavang.');
  }
});

// LỆNH: /chart hoặc /bieudo
bot.command(['chart', 'bieudo', 'dothi'], async (ctx) => {
  const text = ctx.message?.text || '';
  const args = text.trim().split(/\s+/).slice(1);

  let days = 7;
  let typeCode = 'SJ9999';

  // Phân tích tham số người dùng nhập (ví dụ: /chart 30 hoặc /chart sjc hoặc /chart 30 sjc)
  for (const arg of args) {
    const num = parseInt(arg);
    if (!isNaN(num) && num > 0) {
      days = num;
    } else if (arg.toLowerCase().includes('sjc') || arg.toLowerCase().includes('mieng')) {
      typeCode = 'SJL1L10';
    } else if (arg.toLowerCase().includes('nhan') || arg.toLowerCase().includes('9999')) {
      typeCode = 'SJ9999';
    }
  }

  const waitMsg = await ctx.reply(`⏳ Đang vẽ biểu đồ ${days} ngày qua cho bạn...`);

  try {
    const { buffer, meta } = await chartService.getChartBuffer(days, typeCode);
    const caption = `📊 <b>BIỂU ĐỒ ${meta.typeTitle} (${meta.days} NGÀY)</b>\n` +
      `▫️ Đáy: <b>${meta.minVal} tr</b> | Đỉnh: <b>${meta.maxVal} tr</b>\n` +
      `▫️ Hiện tại: <b>${meta.currentVal} tr</b> (Biến động: <b>${meta.trendText}</b>)\n\n` +
      `👉 <i>Bấm các nút bên dưới để chuyển đổi nhanh:</i>`;

    await ctx.replyWithPhoto(new InputFile(buffer, `chart-${days}d.png`), {
      caption,
      parse_mode: 'HTML',
      reply_markup: createChartKeyboard(meta.days, meta.typeCode)
    });

    // Xóa tin nhắn chờ
    try { await ctx.api.deleteMessage(ctx.chat.id, waitMsg.message_id); } catch {}
  } catch (err) {
    await ctx.reply(`❌ Lỗi tạo biểu đồ: ${err.message}`);
  }
});

// Xử lý khi người dùng bấm nút đổi biểu đồ trên Inline Keyboard
bot.callbackQuery(/^chart_(\d+)_(.+)$/, async (ctx) => {
  const days = parseInt(ctx.match[1]);
  const typeCode = ctx.match[2];

  await ctx.answerCallbackQuery({ text: `Đang tải biểu đồ ${days} ngày...` });

  try {
    const { buffer, meta } = await chartService.getChartBuffer(days, typeCode);
    const caption = `📊 <b>BIỂU ĐỒ ${meta.typeTitle} (${meta.days} NGÀY)</b>\n` +
      `▫️ Đáy: <b>${meta.minVal} tr</b> | Đỉnh: <b>${meta.maxVal} tr</b>\n` +
      `▫️ Hiện tại: <b>${meta.currentVal} tr</b> (Biến động: <b>${meta.trendText}</b>)\n\n` +
      `👉 <i>Bấm các nút bên dưới để chuyển đổi nhanh:</i>`;

    // Gửi ảnh biểu đồ mới
    await ctx.replyWithPhoto(new InputFile(buffer, `chart-${days}d.png`), {
      caption,
      parse_mode: 'HTML',
      reply_markup: createChartKeyboard(meta.days, meta.typeCode)
    });
  } catch (err) {
    await ctx.reply(`❌ Lỗi cập nhật biểu đồ: ${err.message}`);
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

// LỆNH: /test - Bắn thử ngay thông báo 8h sáng kèm biểu đồ
bot.command('test', async (ctx) => {
  await ctx.reply('🚀 Đang tạo và gửi bản tin giả lập 8:00 sáng kèm biểu đồ cho bạn...');
  try {
    const goldData = await goldService.getFullGoldData();
    const message = messageFormatter.formatDailyReport(goldData);
    await ctx.reply(message, { parse_mode: 'HTML' });

    // Gửi kèm biểu đồ 7 ngày
    const { buffer, meta } = await chartService.getChartBuffer(7, 'SJ9999');
    const caption = `📊 <b>Biểu đồ giá vàng 7 ngày qua</b> (${meta.trendText})\n<i>Bấm các nút bên dưới để chọn khung thời gian:</i>`;
    await ctx.replyWithPhoto(new InputFile(buffer, 'gold-chart.png'), {
      caption,
      parse_mode: 'HTML',
      reply_markup: createChartKeyboard(7, 'SJ9999')
    });
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
    `/chart - Xem biểu đồ biến động giá vàng (7d, 14d, 30d, 90d, 180d)\n` +
    `/giavang - Xem giá vàng nhẫn 9999 & SJC 9999 hiện tại\n` +
    `/thongke - Xem bảng so sánh % tăng/giảm (tuần, tháng, 3T, 6T)\n` +
    `/khuyennghi - Xem riêng nhận định MUA hay BÁN\n` +
    `/test - Bắn thử bản tin 08:00 sáng kèm biểu đồ tức thì\n` +
    `/stop - Tắt nhận tin tự động hàng ngày\n` +
    `/help - Xem trợ giúp này\n\n` +
    `💡 <i>Mẹo: Gõ <code>/chart 30</code> để xem ngay biểu đồ 1 tháng, hoặc <code>/chart sjc</code> để xem biểu đồ vàng miếng SJC.</i>\n` +
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
