import { storageService } from './storageService.js';
import { config } from '../config.js';

export const GOLD_TYPES = {
  RING_9999: { code: 'SJ9999', name: 'Vàng Nhẫn SJC 9999' },
  BAR_9999: { code: 'SJL1L10', name: 'Vàng Miếng SJC 9999' },
  BT_9999: { code: 'BT9999NTT', name: 'Vàng Nhẫn BTMC 9999' },
  WORLD: { code: 'XAUUSD', name: 'Vàng Thế Giới (USD/oz)' }
};

export const goldService = {
  // Fetch API với timeout an toàn
  async fetchWithTimeout(url, timeoutMs = 10000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  },

  // Lấy dữ liệu lịch sử theo mã vàng
  async fetchHistory(typeCode, days = config.historyDays) {
    const url = `https://www.vang.today/api/prices?type=${typeCode}&days=${days}`;
    return await this.fetchWithTimeout(url);
  },

  // Lấy toàn bộ dữ liệu giá hiện tại
  async fetchCurrentPrices() {
    const url = 'https://www.vang.today/api/prices';
    return await this.fetchWithTimeout(url);
  },

  // Tính toán % thay đổi và chênh lệch tiền
  calculateChange(currentSell, pastSell) {
    if (!currentSell || !pastSell) {
      return { diff: 0, pct: 0, trend: 'stable' };
    }
    const diff = currentSell - pastSell;
    const pct = parseFloat(((diff / pastSell) * 100).toFixed(2));
    let trend = 'stable';
    if (pct > 0.05) trend = 'up';
    else if (pct < -0.05) trend = 'down';

    return { diff, pct, trend };
  },

  // Lấy giá trị trong lịch sử theo số ngày lùi về trước
  getPriceAtDaysAgo(historyList, typeCode, daysAgo) {
    if (!historyList || historyList.length === 0) return null;
    if (daysAgo >= historyList.length) {
      const last = historyList[historyList.length - 1];
      return last?.prices?.[typeCode] || null;
    }
    const item = historyList[daysAgo];
    return item?.prices?.[typeCode] || null;
  },

  // Phân tích chi tiết thống kê cho 1 loại vàng
  buildStatsForType(typeCode, typeName, historyList) {
    if (!historyList || historyList.length === 0) {
      return null;
    }

    const currentItem = historyList[0]?.prices?.[typeCode];
    if (!currentItem) return null;

    const currentSell = currentItem.sell;
    const currentBuy = currentItem.buy;
    const spread = currentSell - currentBuy;

    // Các mốc thời gian: 1 ngày, 7 ngày (1 tuần), 30 ngày (1 tháng), 90 ngày (3 tháng), 180 ngày (6 tháng)
    const p1d = this.getPriceAtDaysAgo(historyList, typeCode, 1);
    const p7d = this.getPriceAtDaysAgo(historyList, typeCode, 7);
    const p30d = this.getPriceAtDaysAgo(historyList, typeCode, 30);
    const p90d = this.getPriceAtDaysAgo(historyList, typeCode, 90);
    const p180d = this.getPriceAtDaysAgo(historyList, typeCode, 179) || historyList[historyList.length - 1]?.prices?.[typeCode];

    const change1d = this.calculateChange(currentSell, p1d?.sell);
    const change7d = this.calculateChange(currentSell, p7d?.sell);
    const change30d = this.calculateChange(currentSell, p30d?.sell);
    const change90d = this.calculateChange(currentSell, p90d?.sell);
    const change180d = this.calculateChange(currentSell, p180d?.sell);

    // Tính Min, Max trong 180 ngày (6 tháng)
    const allSellPrices = historyList
      .map(h => h.prices?.[typeCode]?.sell)
      .filter(p => typeof p === 'number' && p > 0);

    const min6m = allSellPrices.length > 0 ? Math.min(...allSellPrices) : currentSell;
    const max6m = allSellPrices.length > 0 ? Math.max(...allSellPrices) : currentSell;

    // Vị thế hiện tại trong thang đo 6 tháng (0% = Đáy, 100% = Đỉnh)
    const range = max6m - min6m;
    const percentile = range > 0 ? parseFloat((((currentSell - min6m) / range) * 100).toFixed(1)) : 50;

    // % sụt giảm so với đỉnh 6 tháng
    const dropFromPeak = parseFloat((((currentSell - max6m) / max6m) * 100).toFixed(2));
    // % tăng so với đáy 6 tháng
    const riseFromBottom = parseFloat((((currentSell - min6m) / min6m) * 100).toFixed(2));

    return {
      typeCode,
      typeName,
      date: historyList[0]?.date,
      buy: currentBuy,
      sell: currentSell,
      spread,
      p1d: p1d?.sell,
      p7d: p7d?.sell,
      p30d: p30d?.sell,
      p90d: p90d?.sell,
      p180d: p180d?.sell,
      change1d,
      change7d,
      change30d,
      change90d,
      change180d,
      min6m,
      max6m,
      percentile,
      dropFromPeak,
      riseFromBottom
    };
  },

  // Tổng hợp dữ liệu đầy đủ cho thông báo
  async getFullGoldData() {
    try {
      // Gọi song song các API lịch sử của Vàng Nhẫn 9999 và Vàng Miếng SJC 9999
      const [ringData, barData, currentAll] = await Promise.all([
        this.fetchHistory(GOLD_TYPES.RING_9999.code, config.historyDays),
        this.fetchHistory(GOLD_TYPES.BAR_9999.code, config.historyDays),
        this.fetchCurrentPrices().catch(() => null)
      ]);

      const ringStats = this.buildStatsForType(
        GOLD_TYPES.RING_9999.code,
        GOLD_TYPES.RING_9999.name,
        ringData?.history || []
      );

      const barStats = this.buildStatsForType(
        GOLD_TYPES.BAR_9999.code,
        GOLD_TYPES.BAR_9999.name,
        barData?.history || []
      );

      const worldPrice = currentAll?.prices?.XAUUSD || null;

      const result = {
        updatedAt: new Date().toISOString(),
        date: ringStats?.date || new Date().toISOString().split('T')[0],
        ringStats, // Vàng nhẫn 9999
        barStats,  // Vàng miếng SJC 9999
        worldPrice // Vàng thế giới
      };

      // Lưu cache đề phòng lúc mất mạng
      storageService.saveGoldCache(result);

      return result;
    } catch (error) {
      console.error('Lỗi khi fetch dữ liệu giá vàng trực tuyến:', error.message);
      // Fallback về cache nếu có
      const cached = storageService.getGoldCache();
      if (cached) {
        console.log('Sử dụng dữ liệu giá vàng từ bộ nhớ đệm cache');
        cached.isCached = true;
        return cached;
      }
      throw error;
    }
  },

  // Định dạng tiền tệ VND triệu đồng/lượng
  formatMillionVnd(amount) {
    if (!amount && amount !== 0) return '0.00';
    return (amount / 1000000).toLocaleString('vi-VN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  },

  // Định dạng số tiền chênh lệch có dấu +/-
  formatDiffMillionVnd(amount) {
    const prefix = amount > 0 ? '+' : '';
    return `${prefix}${this.formatMillionVnd(amount)} tr`;
  },

  // Định dạng % có dấu +/-
  formatPct(pct) {
    const prefix = pct > 0 ? '+' : '';
    return `${prefix}${pct}%`;
  }
};
