export const analysisService = {
  /**
   * Phân tích và đưa ra kết luận mua/bán cho 1 loại vàng
   * @param {Object} stats - Dữ liệu thống kê từ goldService
   */
  analyze(stats) {
    if (!stats) {
      return {
        action: 'HOLD',
        badge: '⚪ CHỜ DỮ LIỆU',
        title: 'Chưa đủ dữ liệu phân tích',
        assessment: 'Không có dữ liệu',
        reasons: [],
        advice: 'Vui lòng thử lại sau.'
      };
    }

    const {
      change1d,
      change7d,
      change30d,
      change90d,
      change180d,
      percentile,
      dropFromPeak,
      riseFromBottom
    } = stats;

    const reasonsBuy = [];
    const reasonsSell = [];

    // --- 1. KIỂM TRA TÍN HIỆU TĂNG MẠNH -> NÊN BÁN / CHỐT LỜI ---
    if (change7d.pct >= 2.5) {
      reasonsSell.push(`Giá tuần tăng mạnh: +${change7d.pct}% (${(change7d.diff / 1000000).toFixed(2)} tr/lượng)`);
    }
    if (change30d.pct >= 5.0) {
      reasonsSell.push(`Giá tháng tăng nóng: +${change30d.pct}% (${(change30d.diff / 1000000).toFixed(2)} tr/lượng)`);
    }
    if (change90d.pct >= 9.0) {
      reasonsSell.push(`Giá 3 tháng tăng trưởng mạnh: +${change90d.pct}% (${(change90d.diff / 1000000).toFixed(2)} tr/lượng)`);
    }
    if (change180d.pct >= 14.0) {
      reasonsSell.push(`Giá 6 tháng tăng vượt trội: +${change180d.pct}% (${(change180d.diff / 1000000).toFixed(2)} tr/lượng)`);
    }
    if (percentile >= 90) {
      reasonsSell.push(`Giá đang ở sát đỉnh 6 tháng (Vị thế: ${percentile}%, cách đỉnh chỉ ${Math.abs(dropFromPeak)}%)`);
    }

    // --- 2. KIỂM TRA TÍN HIỆU GIẢM SÂU -> NÊN MUA / TÍCH LŨY ---
    if (change1d.pct <= -1.2) {
      reasonsBuy.push(`Giá ngày sụt giảm bất ngờ: ${change1d.pct}% (${(change1d.diff / 1000000).toFixed(2)} tr/lượng)`);
    }
    if (change7d.pct <= -2.0) {
      reasonsBuy.push(`Giá tuần giảm sâu: ${change7d.pct}% (${(change7d.diff / 1000000).toFixed(2)} tr/lượng)`);
    }
    if (change30d.pct <= -4.0) {
      reasonsBuy.push(`Giá 1 tháng giảm đáng kể: ${change30d.pct}% (${(change30d.diff / 1000000).toFixed(2)} tr/lượng)`);
    }
    if (change90d.pct <= -7.0) {
      reasonsBuy.push(`Giá 3 tháng giảm sâu: ${change90d.pct}% (${(change90d.diff / 1000000).toFixed(2)} tr/lượng)`);
    }
    if (change180d.pct <= -10.0) {
      reasonsBuy.push(`Giá 6 tháng giảm sâu mạnh: ${change180d.pct}% (${(change180d.diff / 1000000).toFixed(2)} tr/lượng)`);
    }
    if (dropFromPeak <= -8.0) {
      reasonsBuy.push(`Đã chiết khấu sâu ${dropFromPeak}% so với mức đỉnh 6 tháng`);
    }
    if (percentile <= 25) {
      reasonsBuy.push(`Giá đang neo gần vùng đáy 6 tháng (Vị thế: ${percentile}%, cách đáy chỉ +${riseFromBottom}%)`);
    }

    // --- 3. TỔNG HỢP VÀ KẾT LUẬN CHIẾN LƯỢC ---
    const sellScore = reasonsSell.length;
    const buyScore = reasonsBuy.length;

    let action = 'HOLD';
    let badge = '🟡 NẮM GIỮ / THEO DÕI';
    let title = 'Thị trường đi ngang - Giữ vị thế quan sát';
    let assessment = 'Bình ổn / Tích lũy';
    let reasons = [];
    let advice = '';

    if (sellScore > buyScore && sellScore >= 1) {
      action = 'SELL';
      badge = '🔴 NÊN BÁN / CHỐT LỜI';
      title = sellScore >= 3 ? '🚨 TĂNG RẤT NÓNG - NÊN CHỐT LỜI MẠNH' : '⚠️ TĂNG MẠNH - CÂN NHẮC CHỐT LỜI TỪNG PHẦN';
      assessment = 'Tăng trưởng nóng / Chạm vùng đỉnh';
      reasons = reasonsSell;
      advice = 'Giá đang ở vùng kháng cự cao hoặc có chuỗi tăng dài. Nhà đầu tư nên hiện thực hóa lợi nhuận (bán 30% - 50% lượng vàng nắm giữ) để bảo toàn thành quả. Tránh tuyệt đối tâm lý FOMO mua đuổi.';
    } else if (buyScore > sellScore && buyScore >= 1) {
      action = 'BUY';
      badge = '🟢 NÊN MUA / TÍCH LŨY';
      title = buyScore >= 3 ? '💎 GIẢM RẤT SÂU - CƠ HỘI MUA VÀNG GIÁ TỐT' : '🛒 ĐIỀU CHỈNH GIẢM - NÊN MUA GOM DẦN';
      assessment = 'Chiết khấu sâu / Vùng đáy hỗ trợ';
      reasons = reasonsBuy;
      advice = 'Giá vàng đã giảm sâu tạo biên độ an toàn và mức giá chiết khấu hấp dẫn. Rất thích hợp cho chiến lược mua tích sản dài hạn. Khuyến nghị chia vốn gom dần (DCA 2-3 đợt) thay vì dồn tiền mua một lần.';
    } else {
      action = 'HOLD';
      badge = '🟡 NẮM GIỮ / QUAN SÁT';
      title = 'Thị trường cân bằng - Tiếp tục nắm giữ';
      assessment = 'Dao động biên độ hẹp / Sideway';
      reasons = [
        `Biến động tuần (${change7d.pct > 0 ? '+' : ''}${change7d.pct}%) và tháng (${change30d.pct > 0 ? '+' : ''}${change30d.pct}%) ở mức vừa phải`,
        `Giá đang ở vùng trung vị 6 tháng (Vị thế: ${percentile}%)`
      ];
      advice = 'Thị trường chưa xuất hiện tín hiệu giảm sâu để gom rẻ cũng như chưa tăng nóng để chốt lời. Nhà đầu tư nên tiếp tục nắm giữ số vàng hiện có và theo dõi thêm phản ứng tại các mốc cản.';
    }

    return {
      action,
      badge,
      title,
      assessment,
      reasons,
      advice,
      scores: { buyScore, sellScore }
    };
  }
};
