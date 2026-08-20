/**
 * Telegram Daily Broadcast & Command Listener Bot Script for @generategmbot
 * Handles automated channel broadcasts, /start command welcome messages,
 * and Telegram Mini App button launching with channel join link.
 */

import 'dotenv/config';
import cron from 'node-cron';
import { STATIC_TEMPLATES, CATEGORIES } from '../src/data/contentLibrary.js';
import { renderGMCardImage } from './generateCardImage.js';

// Clean text helper to strip emojis for pure clean caption text output
function stripEmojis(str) {
  if (!str) return '';
  return str
    .replace(/[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F1E6}-\u{1F1FF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

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

  // Pick category and quote
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

  // Caption text: Code-formatted (`“quote”`) for Telegram native ONE-CLICK-COPY
  const caption = 
`\`“${cleanQuote}”\`

Generate your preferred daily GM post with @generategmbot`;

  // Inline keyboard button for Telegram Channel Posts (Must use URL property for Telegram Channel API compliance)
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
    // 1. Render 16:9 Widescreen GM Card PNG Buffer with high legibility fonts
    const cardPngBuffer = await renderGMCardImage(cleanQuote, categoryObj);

    // 2. Upload PNG Photo File Buffer via Telegram sendPhoto API using Blob FormData
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

    // Fallback to text sendMessage if sendPhoto fails
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
 * Long-polling Telegram Bot Command Listener
 * Listens for /start, /postgm, /gm, /broadcast, /dropgm commands in Telegram chat
 */
export function startTelegramBotListener() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
  const webAppDirectUrl = process.env.WEBAPP_URL || process.env.VITE_APP_URL || 'https://gmgenerator-production.up.railway.app';

  if (!botToken) {
    console.log('ℹ️ Telegram Bot Listener standby (TELEGRAM_BOT_TOKEN not set).');
    return;
  }

  console.log('🤖 Telegram Bot Command Listener active! Listening for /start, /postgm or /gm in Telegram chat.');

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
        console.log('✅ Telegram Chat Menu Button set to Open App!');
      }
    }).catch(() => {});
  } catch (e) {}

  let offset = 0;

  const pollUpdates = async () => {
    try {
      const url = `https://api.telegram.org/bot${botToken}/getUpdates?offset=${offset}&timeout=20`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.ok && Array.isArray(data.result) && data.result.length > 0) {
        for (const update of data.result) {
          offset = Math.max(offset, update.update_id + 1);

          const msg = update.message || update.channel_post;
          if (!msg || !msg.text) continue;

          const text = msg.text.trim();

          // Handle /start or /help command
          if (text.startsWith('/start') || text.startsWith('/help')) {
            console.log(`📩 /start command received from chat ${msg.chat.id}`);

            const welcomeText = 
`☀️ *Welcome to GM Generator!* 🚀

Generate your preferred daily GM posts, level up your streak, unlock achievements, and post GM cards in one tap!

👇 *Tap below to launch the Mini App:*`;

            const inlineKeyboard = {
              inline_keyboard: [
                [
                  {
                    text: '🚀 Open GM Generator App',
                    web_app: { url: webAppDirectUrl }
                  }
                ],
                [
                  {
                    text: '📢 Join @generategm Channel',
                    url: 'https://t.me/generategm'
                  }
                ]
              ]
            };

            const sendRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: msg.chat.id,
                text: welcomeText,
                parse_mode: 'Markdown',
                reply_markup: inlineKeyboard
              })
            });

            const sendJson = await sendRes.json();
            console.log(`✅ Sent /start response to chat ${msg.chat.id}:`, sendJson.ok);
            continue;
          }

          // Handle /postgm, /gm, /broadcast, /dropgm commands
          if (text.startsWith('/postgm') || text.startsWith('/gm') || text.startsWith('/broadcast') || text.startsWith('/dropgm')) {
            console.log(`📩 Command '${text}' received from chat ${msg.chat.id}`);

            const customText = text.replace(/^\/(postgm|gm|broadcast|dropgm)(@\w+)?\s*/i, '').trim();
            const result = await sendDailyChannelPost(customText || null);

            if (msg.chat && msg.chat.id) {
              const replyUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
              const replyText = result.success
                ? `✅ *GM Photo Card Sent to Channel!*\n\n*Message ID:* \`${result.messageId}\``
                : `❌ *Broadcast Failed:* ${result.error}`;

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
      } else if (!data.ok) {
        console.warn('Telegram polling warning:', data.description);
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
 * Daily Morning GM Broadcast Scheduler
 * Automatically runs every morning at 8:00 AM UTC (or custom cron pattern from BROADCAST_CRON_SCHEDULE)
 */
export function startDailyBroadcastScheduler() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.log('ℹ️ Daily Broadcast Scheduler standby (TELEGRAM_BOT_TOKEN not set).');
    return;
  }

  const cronPattern = process.env.BROADCAST_CRON_SCHEDULE || '0 8 * * *'; // Default 8:00 AM daily
  console.log(`⏰ Daily Morning GM Broadcast Scheduler active! Schedule pattern: '${cronPattern}'`);

  cron.schedule(cronPattern, async () => {
    console.log('⏰ Running automated daily morning GM broadcast to Telegram Channel...');
    try {
      const result = await sendDailyChannelPost();
      console.log('Daily Morning Broadcast Result:', result);
    } catch (err) {
      console.error('Error in daily morning broadcast job:', err);
    }
  });
}

// Execute immediately if executed directly via node CLI
const isDirectRun = process.argv[1] && (
  process.argv[1].includes('telegramChannelBot.js') || 
  import.meta.url.endsWith('telegramChannelBot.js')
);

if (isDirectRun) {
  console.log('🚀 Triggering immediate 16:9 GM Photo Card Broadcast test...');
  sendDailyChannelPost().then(res => {
    console.log('Broadcast Result:', JSON.stringify(res, null, 2));
  });
}
