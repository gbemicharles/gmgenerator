/**
 * Telegram Daily Broadcast Bot Script for @generategmbot
 * Renders the exact Web App Shareable GM Photo Card (with quote text inside card) 
 * and attaches quote text caption + inline buttons.
 */

import 'dotenv/config';
import { STATIC_TEMPLATES, CATEGORIES } from '../src/data/contentLibrary.js';
import { renderGMCardImage } from './generateCardImage.js';

// Pedro Mascot Characters list
const PEDRO_CHARACTERS = [
  { name: 'Pedro King', file: 'pedro_king.png' },
  { name: 'Pedro Astronaut', file: 'pedro_astronaut.png' },
  { name: 'Pedro DJ', file: 'pedro_dj.png' },
  { name: 'Pedro Diamond', file: 'pedro_diamond.png' },
  { name: 'Pedro Rocket', file: 'pedro_rocket.png' },
  { name: 'Pedro Rockstar', file: 'pedro_rockstar.png' },
  { name: 'Pedro Wizard', file: 'pedro_wizard.png' },
  { name: 'Pedro Copium', file: 'pedro_copium.png' },
  { name: 'Pedro Rekt', file: 'pedro_rekt.png' },
  { name: 'Pedro Clown', file: 'pedro_clown.png' }
];

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
  const miniAppUrl = process.env.TELEGRAM_MINI_APP_URL || 'https://t.me/generategmbot/app';

  if (!botToken || botToken === 'YOUR_BOT_TOKEN_HERE') {
    return {
      success: false,
      error: 'TELEGRAM_BOT_TOKEN environment variable is not configured. Please add your Bot Token from @BotFather in Railway.'
    };
  }

  // Pick category and quote
  let rawQuote = '';
  let categoryObj = { name: 'MOTIVATIONAL', color: '#F59E0B' };

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
  const selectedPedro = PEDRO_CHARACTERS[Math.floor(Math.random() * PEDRO_CHARACTERS.length)];

  // Caption underneath photo card
  const caption = 
`DAILY GM BROADCAST

“${cleanQuote}”

Generate your daily GM post with @generategmbot`;

  // Clean inline buttons (no emojis)
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
    // 1. Render exact Web App GM Photo Card PNG Buffer with embedded quote inside image
    const cardPngBuffer = await renderGMCardImage(cleanQuote, categoryObj, selectedPedro);

    // 2. Upload PNG Photo File Buffer via Telegram sendPhoto API using Blob FormData
    const photoApiUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
    const photoBlob = new Blob([cardPngBuffer], { type: 'image/png' });

    const formData = new FormData();
    formData.append('chat_id', channelId);
    formData.append('photo', photoBlob, 'gm_card_image.png');
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
      console.log('✅ GM Photo Card Broadcast posted to Telegram!', result.result.message_id);
      return {
        success: true,
        messageId: result.result.message_id,
        chat: channelId,
        quote: cleanQuote,
        card: selectedPedro.name
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
  console.log('🚀 Triggering immediate Web App GM Photo Card Broadcast test...');
  sendDailyChannelPost().then(res => {
    console.log('Broadcast Result:', JSON.stringify(res, null, 2));
  });
}
