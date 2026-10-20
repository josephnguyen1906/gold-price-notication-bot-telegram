import { goldService, GOLD_TYPES } from './goldService.js';

export const chartService = {
  /**
   * Tạo cấu hình và URL ảnh biểu đồ bằng QuickChart API
   * @param {number} days - Số ngày (mặc định 7 ngày)
   * @param {string} typeCode - Mã loại vàng ('SJ9999' hoặc 'SJL1L10')
   */
  async generateChartUrl(days = 7, typeCode = 'SJ9999') {
    const validDays = Math.min(Math.max(parseInt(days) || 7, 3), 180);

    const historyData = await goldService.fetchHistory(typeCode, validDays);
    const historyList = historyData?.history || [];

    if (historyList.length === 0) {
      throw new Error('Không có dữ liệu lịch sử để vẽ biểu đồ');
    }

    const sliced = historyList.slice(0, validDays).reverse();

    const labels = sliced.map(h => {
      const parts = h.date.split('-');
      return `${parts[2]}/${parts[1]}`;
    });

    const sellPrices = sliced.map(h => {
      const val = h.prices?.[typeCode]?.sell;
      return val ? parseFloat((val / 1000000).toFixed(2)) : null;
    });

    const buyPrices = sliced.map(h => {
      const val = h.prices?.[typeCode]?.buy;
      return val ? parseFloat((val / 1000000).toFixed(2)) : null;
    });

    const validSell = sellPrices.filter(p => p !== null);
    const minVal = Math.min(...validSell);
    const maxVal = Math.max(...validSell);
    const startVal = validSell[0];
    const currentVal = validSell[validSell.length - 1];
    const diff = parseFloat((currentVal - startVal).toFixed(2));
    const pct = parseFloat(((diff / startVal) * 100).toFixed(2));
    const diffChiK = Math.round((diff * 1000) / 10);
    const diffChiText = diffChiK >= 0 ? `+${diffChiK}k/chỉ` : `${diffChiK}k/chỉ`;
    const trendText = diff >= 0 
      ? `+${diff} tr/cây (${diffChiText}, +${pct}%)` 
      : `${diff} tr/cây (${diffChiText}, ${pct}%)`;

    const minChi = parseFloat((minVal / 10).toFixed(2));
    const maxChi = parseFloat((maxVal / 10).toFixed(2));
    const currentChi = parseFloat((currentVal / 10).toFixed(2));

    const typeTitle = typeCode === 'SJL1L10' ? 'VÀNG MIẾNG SJC 9999' : 'VÀNG NHẪN SJC 9999';

    // Cấu hình Chart.js an toàn (100% JSON compliant)
    const chartConfig = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Giá Bán (tr/lượng)',
            data: sellPrices,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            borderWidth: 3,
            pointBackgroundColor: '#fbbf24',
            pointBorderColor: '#ffffff',
            pointRadius: validDays <= 14 ? 5 : 2,
            fill: true,
            tension: 0.3
          },
          {
            label: 'Giá Mua (tr/lượng)',
            data: buyPrices,
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.05)',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: validDays <= 14 ? 4 : 1,
            fill: false,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: `BIỂU ĐỒ ${typeTitle} (${validDays} NGÀY) | Biến động: ${trendText}`,
          fontColor: '#ffffff',
          fontSize: 16,
          fontStyle: 'bold',
          padding: 15
        },
        legend: {
          display: true,
          position: 'top',
          labels: {
            fontColor: '#e2e8f0',
            fontSize: 12,
            boxWidth: 15
          }
        },
        scales: {
          xAxes: [{
            gridLines: {
              color: 'rgba(255, 255, 255, 0.08)',
              zeroLineColor: 'rgba(255, 255, 255, 0.15)'
            },
            ticks: {
              fontColor: '#94a3b8',
              fontSize: 11,
              maxTicksLimit: validDays > 30 ? 12 : validDays
            }
          }],
          yAxes: [{
            gridLines: {
              color: 'rgba(255, 255, 255, 0.08)',
              zeroLineColor: 'rgba(255, 255, 255, 0.15)'
            },
            ticks: {
              fontColor: '#94a3b8',
              fontSize: 11,
              min: Math.floor(minVal - 0.5),
              max: Math.ceil(maxVal + 0.5)
            }
          }]
        }
      }
    };

    const baseUrl = 'https://quickchart.io/chart';
    const params = new URLSearchParams({
      c: JSON.stringify(chartConfig),
      w: '850',
      h: '460',
      bkg: '#121826',
      devicePixelRatio: '2'
    });

    const chartUrl = `${baseUrl}?${params.toString()}`;

    return {
      chartUrl,
      days: validDays,
      typeCode,
      typeTitle,
      minVal,
      maxVal,
      currentVal,
      minChi,
      maxChi,
      currentChi,
      diff,
      pct,
      diffChiText,
      trendText
    };
  },

  /**
   * Tải buffer hình ảnh biểu đồ
   */
  async getChartBuffer(days = 7, typeCode = 'SJ9999') {
    const meta = await this.generateChartUrl(days, typeCode);
    const res = await fetch(meta.chartUrl);
    if (!res.ok) {
      throw new Error(`Lỗi tải hình ảnh biểu đồ: HTTP ${res.status}`);
    }
    const arrayBuffer = await res.arrayBuffer();
    return {
      buffer: Buffer.from(arrayBuffer),
      meta
    };
  }
};
