import fs from 'fs';
import path from 'path';
import { config } from '../config.js';

const subscribersFile = path.join(config.dataDir, 'subscribers.json');
const historyFile = path.join(config.dataDir, 'gold_history.json');

// Đảm bảo thư mục data tồn tại
if (!fs.existsSync(config.dataDir)) {
  fs.mkdirSync(config.dataDir, { recursive: true });
}

function readJsonFile(filePath, defaultValue = {}) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error(`Lỗi đọc file ${filePath}:`, error.message);
  }
  return defaultValue;
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Lỗi ghi file ${filePath}:`, error.message);
    return false;
  }
}

export const storageService = {
  // Lấy danh sách chat ID đăng ký nhận tin
  getSubscribers() {
    const data = readJsonFile(subscribersFile, { subscribers: [] });
    let list = data.subscribers || [];

    // Nếu có config DEFAULT_CHAT_ID trong .env mà chưa có trong danh sách thì tự thêm
    if (config.defaultChatId && !list.some(s => String(s.chatId) === String(config.defaultChatId))) {
      list.push({
        chatId: config.defaultChatId,
        firstName: 'Default Admin',
        subscribedAt: new Date().toISOString()
      });
      this.saveSubscribers(list);
    }

    return list;
  },

  saveSubscribers(subscribers) {
    return writeJsonFile(subscribersFile, { subscribers });
  },

  addSubscriber(chatId, userInfo = {}) {
    const subscribers = this.getSubscribers();
    const index = subscribers.findIndex(s => String(s.chatId) === String(chatId));

    const record = {
      chatId: String(chatId),
      username: userInfo.username || '',
      firstName: userInfo.first_name || '',
      subscribedAt: new Date().toISOString(),
      active: true
    };

    if (index >= 0) {
      subscribers[index] = { ...subscribers[index], ...record };
    } else {
      subscribers.push(record);
    }

    this.saveSubscribers(subscribers);
    return true;
  },

  removeSubscriber(chatId) {
    const subscribers = this.getSubscribers();
    const filtered = subscribers.filter(s => String(s.chatId) !== String(chatId));
    this.saveSubscribers(filtered);
    return true;
  },

  isSubscribed(chatId) {
    const subscribers = this.getSubscribers();
    return subscribers.some(s => String(s.chatId) === String(chatId));
  },

  saveGoldCache(data) {
    return writeJsonFile(historyFile, {
      lastUpdated: new Date().toISOString(),
      ...data
    });
  },

  getGoldCache() {
    return readJsonFile(historyFile, null);
  }
};
