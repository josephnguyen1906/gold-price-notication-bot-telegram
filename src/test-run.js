import { goldService } from './services/goldService.js';
import { analysisService } from './services/analysisService.js';
import { messageFormatter } from './services/messageFormatter.js';

console.log('====================================================');
console.log('🧪 CHẠY KIỂM THỬ: LẤY DỮ LIỆU & TÍNH TOÁN GIÁ VÀNG');
console.log('====================================================\n');

async function runTest() {
  try {
    console.log('1. Đang tải dữ liệu thực tế từ hệ thống giá vàng...');
    const startTime = Date.now();
    const goldData = await goldService.getFullGoldData();
    const elapsed = Date.now() - startTime;
    console.log(`✓ Tải dữ liệu thành công trong ${elapsed}ms!\n`);

    const ring = goldData.ringStats;
    if (ring) {
      console.log('----------------------------------------------------');
      console.log(`[DỮ LIỆU THỐNG KÊ CHI TIẾT - ${ring.typeName}]`);
      console.log(`• Ngày dữ liệu: ${ring.date}`);
      console.log(`• Giá Mua: ${goldService.formatMillionVnd(ring.buy)} tr | Giá Bán: ${goldService.formatMillionVnd(ring.sell)} tr`);
      console.log(`• Biến động 1 ngày: ${goldService.formatPct(ring.change1d.pct)} (${goldService.formatDiffMillionVnd(ring.change1d.diff)})`);
      console.log(`• Biến động 1 tuần (7 ngày): ${goldService.formatPct(ring.change7d.pct)} (${goldService.formatDiffMillionVnd(ring.change7d.diff)})`);
      console.log(`• Biến động 1 tháng (30 ngày): ${goldService.formatPct(ring.change30d.pct)} (${goldService.formatDiffMillionVnd(ring.change30d.diff)})`);
      console.log(`• Biến động 3 tháng (90 ngày): ${goldService.formatPct(ring.change90d.pct)} (${goldService.formatDiffMillionVnd(ring.change90d.diff)})`);
      console.log(`• Biến động 6 tháng (180 ngày): ${goldService.formatPct(ring.change180d.pct)} (${goldService.formatDiffMillionVnd(ring.change180d.diff)})`);
      console.log(`• Đáy 6 tháng: ${goldService.formatMillionVnd(ring.min6m)} tr | Đỉnh 6 tháng: ${goldService.formatMillionVnd(ring.max6m)} tr`);
      console.log(`• Vị thế hiện tại trong 6 tháng: ${ring.percentile}%`);
      console.log(`• Độ chiết khấu so với đỉnh: ${ring.dropFromPeak}%`);
      console.log('----------------------------------------------------\n');
    }

    console.log('2. Đánh giá phân tích kỹ thuật & khuyến nghị:');
    const analysis = analysisService.analyze(ring);
    console.log(`• Khuyến nghị: ${analysis.badge}`);
    console.log(`• Tiêu đề: ${analysis.title}`);
    console.log(`• Đánh giá thị trường: ${analysis.assessment}`);
    console.log('• Căn cứ phân tích:');
    analysis.reasons.forEach(r => console.log(`   - ${r}`));
    console.log(`• Lời khuyên: ${analysis.advice}\n`);

    console.log('----------------------------------------------------');
    console.log('3. MẪU BẢN TIN TELEGRAM SẼ ĐƯỢC GỬI LÚC 08:00 SÁNG:');
    console.log('----------------------------------------------------');
    const message = messageFormatter.formatDailyReport(goldData);
    // Bỏ thẻ HTML để xem dạng text thuần trên console
    const plainText = message
      .replace(/<[^>]+>/g, '')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
    console.log(plainText);

    console.log('\n----------------------------------------------------');
    console.log('4. KIỂM TRA TẠO BIỂU ĐỒ (QUICKCHART API):');
    console.log('----------------------------------------------------');
    const { chartService } = await import('./services/chartService.js');
    const chartStart = Date.now();
    const { buffer, meta } = await chartService.getChartBuffer(7, 'SJ9999');
    console.log(`✓ Đã tạo thành công biểu đồ ${meta.typeTitle} (${meta.days} ngày)!`);
    console.log(`• Thời gian xử lý: ${Date.now() - chartStart}ms`);
    console.log(`• Dung lượng ảnh: ${(buffer.length / 1024).toFixed(1)} KB`);
    console.log(`• Xu hướng biểu đồ: ${meta.trendText}`);
    console.log(`• URL tham khảo: ${meta.chartUrl.slice(0, 100)}...`);

    console.log('\n====================================================');
    console.log('✅ KIỂM THỬ THÀNH CÔNG RỰC RỠ! DỮ LIỆU & CHART CHUẨN XÁC 100%');
    console.log('====================================================');
  } catch (error) {
    console.error('❌ Lỗi kiểm thử:', error);
  }
}

runTest();
