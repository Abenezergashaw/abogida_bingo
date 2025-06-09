// index.js
const TelegramBot = require("node-telegram-bot-api");

// Replace with your actual token
const token = "8179655944:AAFlo0LestD3nO2EWYiC0iM1fSOHwMftyzU";

// Create bot instance with polling
const bot = new TelegramBot(token, { polling: true });

let telegramId;

// /start command
bot.onText(/\/start/, (msg) => {
  telegramId = msg.from.id.toString();
  console.log("Telegram ID: ", telegramId);
  bot.sendMessage(msg.chat.id, "👋 Welcome back!");
});
