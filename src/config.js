import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const config = {
  botToken: process.env.BOT_TOKEN || '',
  cronSchedule: process.env.CRON_SCHEDULE || '0 8 * * *', // 8h sáng hàng ngày
  timezone: process.env.TIMEZONE || 'Asia/Ho_Chi_Minh',
  defaultChatId: process.env.DEFAULT_CHAT_ID || '',
  dataDir: path.resolve(__dirname, '../data'),
  historyDays: 180, // Lấy lịch sử 6 tháng (180 ngày)
};
