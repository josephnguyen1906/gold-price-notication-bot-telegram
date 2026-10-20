import { goldService } from './goldService.js';
import { analysisService } from './analysisService.js';

function getTrendIcon(pct) {
  if (pct > 0.05) return '🟢';
  if (pct < -0.05) return '🔴';
  return '⚪';
}

function formatDate(dateStr) {
  try {
    const d = dateStr ? new Date(dateStr) : new Date();
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayName = days[d.getDay()];
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dayName}, ${dd}/${mm}/${yyyy}`;
  } catch {
    return dateStr || '';
  }
}

export const messageFormatter = {
  /**
   * Tạo bản tin đầy đủ gửi vào 8:00 sáng hàng ngày
   */
  formatDailyReport(goldData) {
    const { ringStats, barStats, worldPrice } = goldData;
    const stats = ringStats || barStats;
    const analysis = analysisService.analyze(stats);

    const nowFormatted = formatDate(stats?.date);

    let msg = `👑 <b>BẢN TIN GIÁ VÀNG 9999 - 08:00 SÁNG</b>\n`;
    msg += `📅 <i>${nowFormatted} | Cập nhật tự động</i>\n`;
    msg += `────────────────────────\n\n`;

    // 1. GIÁ VÀNG HIỆN TẠI
    msg += `🥇 <b>1. GIÁ VÀNG 99 HIỆN TẠI:</b>\n`;
    if (ringStats) {
      msg += `💍 <b>Vàng Nhẫn 9999 (SJC Ring):</b>\n`;
      msg += `  ▫️ Mua vào: <b>${goldService.formatMillionVnd(ringStats.buy)} tr</b> | Bán ra: <b>${goldService.formatMillionVnd(ringStats.sell)} tr</b>\n`;
      msg += `  ▫️ Chênh lệch (Spread): <b>${goldService.formatMillionVnd(ringStats.spread)} tr/lượng</b>\n`;
    }
    if (barStats) {
      msg += `\n🧱 <b>Vàng Miếng SJC 9999:</b>\n`;
      msg += `  ▫️ Mua vào: <b>${goldService.formatMillionVnd(barStats.buy)} tr</b> | Bán ra: <b>${goldService.formatMillionVnd(barStats.sell)} tr</b>\n`;
      msg += `  ▫️ Chênh lệch (Spread): <b>${goldService.formatMillionVnd(barStats.spread)} tr/lượng</b>\n`;
    }
    if (worldPrice) {
      msg += `\n🌍 <b>Vàng Thế Giới (XAU/USD):</b> <b>$${worldPrice.buy.toLocaleString('en-US')} / oz</b>\n`;
    }

    msg += `\n────────────────────────\n`;

    // 2. THỐNG KÊ BIẾN ĐỘNG
    if (stats) {
      msg += `📊 <b>2. THỐNG KÊ TĂNG / GIẢM (%):</b>\n`;
      msg += `<i>(Căn cứ theo giá bán Vàng Nhẫn 9999)</i>\n`;
      msg += `  ▫️ <b>1 ngày qua:</b> ${getTrendIcon(stats.change1d.pct)} <b>${goldService.formatPct(stats.change1d.pct)}</b> (${goldService.formatDiffMillionVnd(stats.change1d.diff)})\n`;
      msg += `  ▫️ <b>1 tuần qua:</b> ${getTrendIcon(stats.change7d.pct)} <b>${goldService.formatPct(stats.change7d.pct)}</b> (${goldService.formatDiffMillionVnd(stats.change7d.diff)})\n`;
      msg += `  ▫️ <b>1 tháng qua:</b> ${getTrendIcon(stats.change30d.pct)} <b>${goldService.formatPct(stats.change30d.pct)}</b> (${goldService.formatDiffMillionVnd(stats.change30d.diff)})\n`;
      msg += `  ▫️ <b>3 tháng qua:</b> ${getTrendIcon(stats.change90d.pct)} <b>${goldService.formatPct(stats.change90d.pct)}</b> (${goldService.formatDiffMillionVnd(stats.change90d.diff)})\n`;
      msg += `  ▫️ <b>6 tháng qua:</b> ${getTrendIcon(stats.change180d.pct)} <b>${goldService.formatPct(stats.change180d.pct)}</b> (${goldService.formatDiffMillionVnd(stats.change180d.diff)})\n\n`;

      msg += `📌 <i>Khoảng giá 6 tháng: ${goldService.formatMillionVnd(stats.min6m)} tr - ${goldService.formatMillionVnd(stats.max6m)} tr</i>\n`;
      msg += `📌 <i>Vị thế hiện tại: <b>${stats.percentile}%</b> (0% đáy - 100% đỉnh)</i>\n`;
    }

    msg += `\n────────────────────────\n`;

    // 3. KẾT LUẬN & KHUYẾN NGHỊ MUA / BÁN
    msg += `🎯 <b>3. KẾT LUẬN & KHUYẾN NGHỊ:</b>\n`;
    msg += `👉 <b>${analysis.badge}</b>\n`;
    msg += `<b>${analysis.title}</b>\n\n`;

    if (analysis.reasons && analysis.reasons.length > 0) {
      msg += `<b>Căn cứ dữ liệu:</b>\n`;
      analysis.reasons.forEach(r => {
        msg += `  • ${r}\n`;
      });
      msg += `\n`;
    }

    msg += `💡 <b>Chiến lược hành động:</b>\n`;
    msg += `<i>${analysis.advice}</i>\n\n`;

    msg += `────────────────────────\n`;
    msg += `⚡ <i>Gõ /giavang xem ngay | /thongke xem biểu đồ | /help để trợ giúp</i>`;

    return msg;
  },

  /**
   * Tin nhắn nhanh khi gõ /giavang
   */
  formatQuickPrice(goldData) {
    const { ringStats, barStats, worldPrice } = goldData;
    const stats = ringStats || barStats;
    const analysis = analysisService.analyze(stats);

    let msg = `⚡ <b>CẬP NHẬT GIÁ VÀNG 9999 TỨC THÌ</b>\n`;
    msg += `📅 <i>${formatDate(stats?.date)}</i>\n\n`;

    if (ringStats) {
      msg += `💍 <b>Vàng Nhẫn 9999 (SJC):</b>\n`;
      msg += `  • Mua: <b>${goldService.formatMillionVnd(ringStats.buy)} tr</b> | Bán: <b>${goldService.formatMillionVnd(ringStats.sell)} tr</b>\n`;
      msg += `  • Biến động 24h: ${getTrendIcon(ringStats.change1d.pct)} ${goldService.formatPct(ringStats.change1d.pct)}\n\n`;
    }

    if (barStats) {
      msg += `🧱 <b>Vàng Miếng SJC 9999:</b>\n`;
      msg += `  • Mua: <b>${goldService.formatMillionVnd(barStats.buy)} tr</b> | Bán: <b>${goldService.formatMillionVnd(barStats.sell)} tr</b>\n`;
      msg += `  • Biến động 24h: ${getTrendIcon(barStats.change1d.pct)} ${goldService.formatPct(barStats.change1d.pct)}\n\n`;
    }

    if (worldPrice) {
      msg += `🌍 <b>Vàng Thế Giới:</b> $${worldPrice.buy.toLocaleString('en-US')}/oz\n\n`;
    }

    msg += `🎯 <b>Khuyến nghị hiện tại:</b> ${analysis.badge}\n`;
    msg += `💡 <i>${analysis.advice}</i>`;

    return msg;
  },

  /**
   * Tin nhắn thống kê chuyên sâu khi gõ /thongke
   */
  formatDetailedStats(goldData) {
    const { ringStats } = goldData;
    if (!ringStats) return 'Không có dữ liệu thống kê.';

    const analysis = analysisService.analyze(ringStats);

    let msg = `📊 <b>BẢNG THỐNG KÊ CHI TIẾT VÀNG NHẪN 9999</b>\n`;
    msg += `📅 <i>Tính đến ngày ${formatDate(ringStats.date)}</i>\n\n`;

    msg += `💰 <b>Giá bán hiện tại:</b> <b>${goldService.formatMillionVnd(ringStats.sell)} triệu đ/lượng</b>\n\n`;

    msg += `📈 <b>BẢNG SO SÁNH CÁC KỲ HẠN:</b>\n`;
    msg += `• <b>Hôm qua (1 ngày):</b>\n  Giá cũ: ${goldService.formatMillionVnd(ringStats.p1d)} tr ➔ ${getTrendIcon(ringStats.change1d.pct)} <b>${goldService.formatPct(ringStats.change1d.pct)}</b> (${goldService.formatDiffMillionVnd(ringStats.change1d.diff)})\n\n`;
    msg += `• <b>1 Tuần trước (7 ngày):</b>\n  Giá cũ: ${goldService.formatMillionVnd(ringStats.p7d)} tr ➔ ${getTrendIcon(ringStats.change7d.pct)} <b>${goldService.formatPct(ringStats.change7d.pct)}</b> (${goldService.formatDiffMillionVnd(ringStats.change7d.diff)})\n\n`;
    msg += `• <b>1 Tháng trước (30 ngày):</b>\n  Giá cũ: ${goldService.formatMillionVnd(ringStats.p30d)} tr ➔ ${getTrendIcon(ringStats.change30d.pct)} <b>${goldService.formatPct(ringStats.change30d.pct)}</b> (${goldService.formatDiffMillionVnd(ringStats.change30d.diff)})\n\n`;
    msg += `• <b>3 Tháng trước (90 ngày):</b>\n  Giá cũ: ${goldService.formatMillionVnd(ringStats.p90d)} tr ➔ ${getTrendIcon(ringStats.change90d.pct)} <b>${goldService.formatPct(ringStats.change90d.pct)}</b> (${goldService.formatDiffMillionVnd(ringStats.change90d.diff)})\n\n`;
    msg += `• <b>6 Tháng trước (180 ngày):</b>\n  Giá cũ: ${goldService.formatMillionVnd(ringStats.p180d)} tr ➔ ${getTrendIcon(ringStats.change180d.pct)} <b>${goldService.formatPct(ringStats.change180d.pct)}</b> (${goldService.formatDiffMillionVnd(ringStats.change180d.diff)})\n\n`;

    msg += `────────────────────────\n`;
    msg += `📐 <b>BIÊN ĐỘ 6 THÁNG:</b>\n`;
    msg += `  ▫️ Đáy thấp nhất: <b>${goldService.formatMillionVnd(ringStats.min6m)} tr</b>\n`;
    msg += `  ▫️ Đỉnh cao nhất: <b>${goldService.formatMillionVnd(ringStats.max6m)} tr</b>\n`;
    msg += `  ▫️ So với đỉnh: <b>${ringStats.dropFromPeak}%</b>\n`;
    msg += `  ▫️ So với đáy: <b>+${ringStats.riseFromBottom}%</b>\n`;
    msg += `  ▫️ Thước đo vị thế: <b>${ringStats.percentile}%</b>\n\n`;

    msg += `🎯 <b>KẾT LUẬN:</b> ${analysis.badge}\n`;
    msg += `<i>${analysis.advice}</i>`;

    return msg;
  }
};
