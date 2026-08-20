/**
 * Telegram Daily Dynamic GM Photo Card Broadcast Bot Script for @generategmbot
 * Renders high-def GM Photo Card PNGs (with quote text inside card) and uploads to Telegram.
 */

import 'dotenv/config';
import { STATIC_TEMPLATES, CATEGORIES } from '../src/data/contentLibrary.js';
import { renderGMCardImage } from './generateCardImage.js';

// Pedro Mascot Character PNG files
const PEDRO_CHARACTER_FILES = [
  "pedro_king.png",
  "pedro_astronaut.png",
  "pedro_dj.png",
  "pedro_diamond.png",
  "pedro_rocket.png",
  "pedro_rockstar.png",
  "pedro_wizard.png",
  "pedro_copium.png",
  "pedro_rekt.png"
];

// Clean text helper to strip emojis for pure clean text output
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
  const miniAppUrl = process.env.TELEGRAM_MINI_APP_URL || 'https://t.me/generategmbot/app';

  if (!botToken || botToken === 'YOUR_BOT_TOKEN_HERE') {
    return {
      success: false,
      error: 'TELEGRAM_BOT_TOKEN environment variable is not configured. Please add your Bot Token from @BotFather in Railway.'
    };
  }

  // Pick category and quote
  let rawQuote = '';
  let categoryLabel = 'DAILY GM';
  let randomCat = 'motivational';

  if (customText) {
    rawQuote = customText;
  } else {
    const categoryKeys = Object.keys(STATIC_TEMPLATES);
    randomCat = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    const list = STATIC_TEMPLATES[randomCat];
    rawQuote = list[Math.floor(Math.random() * list.length)];

    const catObj = CATEGORIES.find(c => c.id === randomCat);
    if (catObj) {
      categoryLabel = catObj.name;
    }
  }

  const cleanQuote = stripEmojis(rawQuote);

  // Pick random Pedro Mascot image for the photo card
  const pedroFile = PEDRO_CHARACTER_FILES[Math.floor(Math.random() * PEDRO_CHARACTER_FILES.length)];

  // Clean caption & clean inline buttons (no emojis)
  const caption = 
`DAILY GM BROADCAST

“${cleanQuote}”

Generate your daily GM post with @generategmbot`;

  const cleanChannel = channelId.startsWith('@') ? channelId : `@${channelId}`;
  const inlineKeyboard = {
    inline_keyboard: [
      [
        {
          text: 'Open GM Generator App',
          url: miniAppUrl
        }
      ],
      [
        {
          text: 'Join @generategm Channel',
          url: `https://t.me/${cleanChannel.replace('@', '')}`
        }
      ]
    ]
  };

  try {
    // 1. Render the dynamic HD GM Photo Card PNG Buffer (quote inside image)
    const imageBuffer = await renderGMCardImage(cleanQuote, categoryLabel, pedroFile);

    // 2. Upload PNG Photo File Buffer via Telegram sendPhoto API with FormData
    const photoApiUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
    const formData = new FormData();
    formData.append('chat_id', channelId);
    formData.append('photo', new Blob([imageBuffer], { type: 'image/png' }), 'gm_card_generated.png');
    formData.append('caption', caption);
    formData.append('parse_mode', 'Markdown');
    formData.append('reply_markup', JSON.stringify(inlineKeyboard));

    let response = await fetch(photoApiUrl, {
      method: 'POST',
      body: formData
    });

    let result = await response.json();

    // Fallback to text sendMessage if image upload fails
    if (!result.ok) {
      console.warn('sendPhoto upload failed, falling back to sendMessage:', result.description);
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
      console.log('✅ Generated GM Photo Card Broadcast posted to Telegram!', result.result.message_id);
      return {
        success: true,
        messageId: result.result.message_id,
        chat: channelId,
        quote: cleanQuote,
        category: categoryLabel
      };
    } else {
      console.error('❌ Failed to post to Telegram:', result.description);
      return {
        success: false,
        error: result.description
      };
    }
  } catch (err) {
    console.error('❌ Error sending GM Card broadcast:', err);
    return {
      success: false,
      error: err.message || 'Network error sending broadcast'
    };
  }
}

/**
 * Long-polling Telegram Bot Command Listener
 * Listens for /postgm, /gm, /broadcast, /dropgm commands in Telegram chat
 */
export function startTelegramBotListener() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.log('ℹ️ Telegram Bot Listener standby (TELEGRAM_BOT_TOKEN not set).');
    return;
  }

  console.log('🤖 Telegram Bot Command Listener active! Send /postgm or /gm in Telegram chat to trigger.');
  let offset = 0;

  const pollUpdates = async () => {
    try {
      const url = `https://api.telegram.org/bot${botToken}/getUpdates?offset=${offset}&timeout=10`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          offset = update.update_id + 1;
          const msg = update.message || update.channel_post;
          if (!msg || !msg.text) continue;

          const text = msg.text.trim();
          if (text.startsWith('/postgm') || text.startsWith('/gm') || text.startsWith('/broadcast') || text.startsWith('/dropgm')) {
            console.log(`📩 Command '${text}' received from chat ${msg.chat.id}`);

            // Extract optional custom quote written after command
            const customText = text.replace(/^\/(postgm|gm|broadcast|dropgm)(@\w+)?\s*/i, '').trim();
            const result = await sendDailyChannelPost(customText || null);

            // Send confirmation reply back to the sender
            if (msg.chat && msg.chat.id) {
              const replyUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
              const replyText = result.success
                ? `✅ *Generated GM Photo Card Sent to Channel!*\n\n*Message ID:* \`${result.messageId}\``
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
      }
    } catch (err) {
      // Background poll retry
    } finally {
      setTimeout(pollUpdates, 2000);
    }
  };

  pollUpdates();
}

// Execute immediately if executed directly via node CLI
const isDirectRun = process.argv[1] && (
  process.argv[1].includes('telegramChannelBot.js') || 
  import.meta.url.endsWith('telegramChannelBot.js')
);

if (isDirectRun) {
  console.log('🚀 Triggering immediate Generated GM Photo Card Broadcast test...');
  sendDailyChannelPost().then(res => {
    console.log('Broadcast Result:', JSON.stringify(res, null, 2));
  });
}
