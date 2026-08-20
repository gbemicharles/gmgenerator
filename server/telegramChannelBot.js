/**
 * Telegram Daily Broadcast, Command Listener & User Reminder Bot Script for @generategmbot
 * Handles automated channel broadcasts, daily morning user GM reminders,
 * /start welcome messages, and Telegram Mini App launching.
 */

import 'dotenv/config';
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { STATIC_TEMPLATES, CATEGORIES } from '../src/data/contentLibrary.js';
import { renderGMCardImage } from './generateCardImage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE_PATH = path.join(__dirname, 'data', 'subscribedUsers.json');

// Ensure data directory exists
const dataDir = path.dirname(USERS_FILE_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// User Subscription Storage Helpers
function getSubscribedUsers() {
  try {
    if (fs.existsSync(USERS_FILE_PATH)) {
      const data = fs.readFileSync(USERS_FILE_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading subscribed users file:', e);
  }
  return [];
}

function saveSubscribedUser(chatObj) {
  if (!chatObj || !chatObj.id || chatObj.type !== 'private') return;
  const users = getSubscribedUsers();
  const existing = users.find(u => u.id === chatObj.id);

  if (!existing) {
    const newUser = {
      id: chatObj.id,
      username: chatObj.username || '',
      first_name: chatObj.first_name || '',
      joinedAt: new Date().toISOString(),
      remindersEnabled: true
    };
    users.push(newUser);
    try {
      fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf8');
      console.log(`Registered new user for daily GM reminders: ${chatObj.id} (${chatObj.username || 'user'})`);
    } catch (e) {
      console.error('Error saving subscribed user:', e);
    }
  }
}

function toggleUserReminders(chatId, enable = true) {
  const users = getSubscribedUsers();
  const userIndex = users.findIndex(u => u.id === chatId);
  if (userIndex !== -1) {
    users[userIndex].remindersEnabled = enable;
  } else {
    users.push({
      id: chatId,
      username: '',
      first_name: '',
      joinedAt: new Date().toISOString(),
      remindersEnabled: enable
    });
  }
  try {
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf8');
  } catch (e) {}
}

// Clean text helper to strip emojis for pure clean text output
function stripEmojis(str) {
  if (!str) return '';
  return str
    .replace(/[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F1E6}-\u{1F1FF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * 1. Channel Broadcast Post Generator
 */
export async function sendDailyChannelPost(customText = null) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
  const channelId = process.env.TELEGRAM_CHANNEL_ID || process.env.TELEGRAM_CHANNEL_USERNAME || '@generategm';
  const miniAppUrl = process.env.TELEGRAM_MINI_APP_URL || 'https://t.me/generategmbot';

  if (!botToken || botToken === 'YOUR_BOT_TOKEN_HERE') {
    return {
      success: false,
      error: 'TELEGRAM_BOT_TOKEN environment variable is not configured. Please add your Bot Token from @BotFather in Railway.'
    };
  }

  let rawQuote = '';
  let categoryObj = { name: 'MOTIVATIONAL', icon: '👑', color: '#F3BA2F' };

  if (customText) {
    rawQuote = customText;
  } else {
    const categoryKeys = Object.keys(STATIC_TEMPLATES);
    const randomCatKey = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    const list = STATIC_TEMPLATES[randomCatKey];
    rawQuote = list[Math.floor(Math.random() * list.length)];

    const foundCat = CATEGORIES.find(c => c.id === randomCatKey);
    if (foundCat) {
      categoryObj = foundCat;
    }
  }

  const cleanQuote = stripEmojis(rawQuote);

  const caption = 
`\`“${cleanQuote}”\`

Generate your preferred daily GM post with @generategmbot`;

  const inlineKeyboard = {
    inline_keyboard: [
      [
        {
          text: 'Open GM Generator App',
          url: miniAppUrl
        }
      ]
    ]
  };

  try {
    const cardPngBuffer = await renderGMCardImage(cleanQuote, categoryObj);

    const photoApiUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
    const photoBlob = new Blob([cardPngBuffer], { type: 'image/png' });

    const formData = new FormData();
    formData.append('chat_id', channelId);
    formData.append('photo', photoBlob, 'gm_card_16by9.png');
    formData.append('caption', caption);
    formData.append('parse_mode', 'Markdown');
    formData.append('reply_markup', JSON.stringify(inlineKeyboard));

    let response = await fetch(photoApiUrl, {
      method: 'POST',
      body: formData
    });

    let result = await response.json();

    if (!result.ok) {
      console.warn('sendPhoto fallback to sendMessage:', result.description);
      const msgApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const msgPayload = {
        chat_id: channelId,
        text: caption,
        parse_mode: 'Markdown',
        reply_markup: inlineKeyboard
      };

      response = await fetch(msgApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgPayload)
      });
      result = await response.json();
    }

    if (result.ok) {
      console.log('✅ 16:9 GM Photo Card Broadcast posted to Telegram!', result.result.message_id);
      return {
        success: true,
        messageId: result.result.message_id,
        chat: channelId,
        quote: cleanQuote,
        category: categoryObj.name
      };
    } else {
      console.error('❌ Failed to post to Telegram:', result.description);
      return {
        success: false,
        error: result.description
      };
    }
  } catch (err) {
    console.error('❌ Error sending GM Photo Card broadcast:', err);
    return {
      success: false,
      error: err.message || 'Network error sending broadcast'
    };
  }
}

/**
 * 2. Daily Morning User GM Reminder Broadcast Generator (Clean, Zero Emojis)
 */
export async function sendDailyUserReminders() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
  const webAppDirectUrl = process.env.WEBAPP_URL || process.env.VITE_APP_URL || 'https://gmgenerator-production.up.railway.app';

  if (!botToken) return;

  const users = getSubscribedUsers().filter(u => u.remindersEnabled !== false);
  console.log(`Sending daily morning GM reminders to ${users.length} user(s)...`);

  const reminderText = 
`*Good Morning! Time to generate your GM post!*

Keep your streak alive, level up your GM rank, and drop today's GM quote to your channel & groups!

Tap below to launch the Mini App:`;

  const inlineKeyboard = {
    inline_keyboard: [
      [
        {
          text: 'Open GM Generator App',
          web_app: { url: webAppDirectUrl }
        }
      ]
    ]
  };

  let count = 0;
  for (const u of users) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: u.id,
          text: reminderText,
          parse_mode: 'Markdown',
          reply_markup: inlineKeyboard
        })
      });
      const data = await res.json();
      if (data.ok) count++;
    } catch (e) {}
  }

  console.log(`Daily user GM reminders sent to ${count}/${users.length} user(s)!`);
}

/**
 * 3. Long-polling Telegram Bot Command Listener
 */
export function startTelegramBotListener() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
  const webAppDirectUrl = process.env.WEBAPP_URL || process.env.VITE_APP_URL || 'https://gmgenerator-production.up.railway.app';

  if (!botToken) {
    console.log('Telegram Bot Listener standby (TELEGRAM_BOT_TOKEN not set).');
    return;
  }

  console.log('Telegram Bot Command Listener active! Listening for /start, /postgm or /gm in Telegram chat.');

  // Clear Webhooks on startup to prevent conflict error 409
  fetch(`https://api.telegram.org/bot${botToken}/deleteWebhook?drop_pending_updates=false`)
    .catch(() => {});

  // Set Telegram Native Bottom Left Menu Button to open Mini App
  try {
    fetch(`https://api.telegram.org/bot${botToken}/setChatMenuButton`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        menu_button: {
          type: 'web_app',
          text: 'Open App',
          web_app: { url: webAppDirectUrl }
        }
      })
    }).then(res => res.json()).then(data => {
      if (data.ok) {
        console.log('Telegram Chat Menu Button set to Open App!');
      }
    }).catch(() => {});
  } catch (e) {}

  let offset = 0;

  const pollUpdates = async () => {
    try {
      const url = `https://api.telegram.org/bot${botToken}/getUpdates?offset=${offset}&timeout=20`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          offset = Math.max(offset, update.update_id + 1);

          const msg = update.message || update.channel_post;
          if (!msg || !msg.text) continue;

          // Register user for daily reminders
          if (msg.chat && msg.chat.type === 'private') {
            saveSubscribedUser(msg.chat);
          }

          const text = msg.text.trim();

          // Handle /start or /help command (Clean, Zero Emojis)
          if (text.startsWith('/start') || text.startsWith('/help')) {
            console.log(`/start command received from chat ${msg.chat.id}`);

            const welcomeText = 
`*Welcome to GM Generator!*

Generate your preferred daily GM posts, level up your streak, unlock achievements, and post GM cards in one tap!

Tap below to launch the Mini App:`;

            const inlineKeyboard = {
              inline_keyboard: [
                [
                  {
                    text: 'Open GM Generator App',
                    web_app: { url: webAppDirectUrl }
                  }
                ],
                [
                  {
                    text: 'Join @generategm Channel',
                    url: 'https://t.me/generategm'
                  }
                ]
              ]
            };

            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: msg.chat.id,
                text: welcomeText,
                parse_mode: 'Markdown',
                reply_markup: inlineKeyboard
              })
            });
            continue;
          }

          // Handle /stopremind or /remind commands
          if (text.startsWith('/stopremind')) {
            toggleUserReminders(msg.chat.id, false);
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: msg.chat.id,
                text: '*Daily GM Reminders muted.* Send /remind anytime to re-enable!',
                parse_mode: 'Markdown'
              })
            });
            continue;
          }

          if (text.startsWith('/remind')) {
            toggleUserReminders(msg.chat.id, true);
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: msg.chat.id,
                text: '*Daily GM Reminders activated!* You will receive your daily morning GM alert!',
                parse_mode: 'Markdown'
              })
            });
            continue;
          }

          // Handle /postgm, /gm, /broadcast, /dropgm commands
          if (text.startsWith('/postgm') || text.startsWith('/gm') || text.startsWith('/broadcast') || text.startsWith('/dropgm')) {
            console.log(`Command '${text}' received from chat ${msg.chat.id}`);

            const customText = text.replace(/^\/(postgm|gm|broadcast|dropgm)(@\w+)?\s*/i, '').trim();
            const result = await sendDailyChannelPost(customText || null);

            if (msg.chat && msg.chat.id) {
              const replyUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
              const replyText = result.success
                ? `*GM Photo Card Sent to Channel!*\n\n*Message ID:* \`${result.messageId}\``
                : `*Broadcast Failed:* ${result.error}`;

              await fetch(replyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: msg.chat.id,
                  text: replyText,
                  parse_mode: 'Markdown'
                })
              });
            }
          }
        }
      }
    } catch (err) {
      console.error('Error in polling loop:', err.message);
    } finally {
      setTimeout(pollUpdates, 1000);
    }
  };

  pollUpdates();
}

/**
 * 4. Daily Morning GM Broadcast Scheduler & User Reminders
 */
export function startDailyBroadcastScheduler() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.log('Daily Broadcast Scheduler standby (TELEGRAM_BOT_TOKEN not set).');
    return;
  }

  // 1. Daily Channel Photo Card Broadcast (Default: 8:00 AM UTC)
  const channelCronPattern = process.env.BROADCAST_CRON_SCHEDULE || '0 8 * * *';
  console.log(`Daily Channel GM Broadcast active! Schedule pattern: '${channelCronPattern}'`);

  cron.schedule(channelCronPattern, async () => {
    console.log('Running automated daily morning GM broadcast to Telegram Channel...');
    try {
      const result = await sendDailyChannelPost();
      console.log('Daily Channel Broadcast Result:', result);
    } catch (err) {
      console.error('Error in channel broadcast job:', err);
    }
  });

  // 2. Daily User Morning GM Reminder Broadcast (Default: 9:00 AM UTC)
  const userReminderCronPattern = process.env.REMINDER_CRON_SCHEDULE || '0 9 * * *';
  console.log(`Daily User GM Reminder Scheduler active! Schedule pattern: '${userReminderCronPattern}'`);

  cron.schedule(userReminderCronPattern, async () => {
    console.log('Running automated daily user GM reminder broadcast...');
    try {
      await sendDailyUserReminders();
    } catch (err) {
      console.error('Error in user reminder job:', err);
    }
  });
}

// Execute immediately if executed directly via node CLI
const isDirectRun = process.argv[1] && (
  process.argv[1].includes('telegramChannelBot.js') || 
  import.meta.url.endsWith('telegramChannelBot.js')
);

if (isDirectRun) {
  console.log('Triggering immediate 16:9 GM Photo Card Broadcast test...');
  sendDailyChannelPost().then(res => {
    console.log('Broadcast Result:', JSON.stringify(res, null, 2));
  });
}
