/**
 * Telegram Daily Broadcast Bot Script for @generategmbot
 * Posts the exact Pedro Mascot Card Image from the app along with the GM quote text as caption.
 */

import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { STATIC_TEMPLATES } from '../src/data/contentLibrary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Exact Pedro Mascot Card Images from the web app
const PEDRO_MASCOT_CARDS = [
  { file: 'pedro_astronaut.png', name: 'Pedro Astronaut' },
  { file: 'pedro_king.png', name: 'Pedro King' },
  { file: 'pedro_dj.png', name: 'Pedro DJ' },
  { file: 'pedro_diamond.png', name: 'Pedro Diamond' },
  { file: 'pedro_rocket.png', name: 'Pedro Rocket' },
  { file: 'pedro_rockstar.png', name: 'Pedro Rockstar' },
  { file: 'pedro_wizard.png', name: 'Pedro Wizard' },
  { file: 'pedro_copium.png', name: 'Pedro Copium' },
  { file: 'pedro_rekt.png', name: 'Pedro Rekt' },
  { file: 'pedro_clown.png', name: 'Pedro Clown' }
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

  // Pick quote
  let rawQuote = '';
  if (customText) {
    rawQuote = customText;
  } else {
    const categoryKeys = Object.keys(STATIC_TEMPLATES);
    const randomCat = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    const list = STATIC_TEMPLATES[randomCat];
    rawQuote = list[Math.floor(Math.random() * list.length)];
  }

  const cleanQuote = stripEmojis(rawQuote);

  // Caption contains the GM quote text underneath the card photo
  const caption = 
`DAILY GM BROADCAST

“${cleanQuote}”

Generate your daily GM post with @generategmbot`;

  // Select random Pedro Card Image from app public directory
  const selectedCard = PEDRO_MASCOT_CARDS[Math.floor(Math.random() * PEDRO_MASCOT_CARDS.length)];
  const rawGithubUrl = `https://raw.githubusercontent.com/gbemicharles/gmgenerator/main/public/pedro_characters/${selectedCard.file}`;

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
    let result = null;
    const localImgPath = path.join(__dirname, '..', 'public', 'pedro_characters', selectedCard.file);

    // Try sending local image file buffer if available via Blob FormData
    if (fs.existsSync(localImgPath)) {
      const fileBuffer = fs.readFileSync(localImgPath);
      const photoBlob = new Blob([fileBuffer], { type: 'image/png' });

      const formData = new FormData();
      formData.append('chat_id', channelId);
      formData.append('photo', photoBlob, selectedCard.file);
      formData.append('caption', caption);
      formData.append('parse_mode', 'Markdown');
      formData.append('reply_markup', JSON.stringify(inlineKeyboard));

      const photoApiUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
      const response = await fetch(photoApiUrl, {
        method: 'POST',
        body: formData
      });
      result = await response.json();
    }

    // Fallback to sending RAW URL if local buffer sending fails
    if (!result || !result.ok) {
      const photoApiUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
      const photoPayload = {
        chat_id: channelId,
        photo: rawGithubUrl,
        caption: caption,
        parse_mode: 'Markdown',
        reply_markup: inlineKeyboard
      };

      const response = await fetch(photoApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(photoPayload)
      });
      result = await response.json();
    }

    // Secondary fallback to sendMessage if sendPhoto fails
    if (!result.ok) {
      console.warn('sendPhoto fallback to sendMessage:', result.description);
      const msgApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const msgPayload = {
        chat_id: channelId,
        text: caption,
        parse_mode: 'Markdown',
        reply_markup: inlineKeyboard
      };

      const response = await fetch(msgApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgPayload)
      });
      result = await response.json();
    }

    if (result.ok) {
      console.log('✅ Pedro Card Photo Broadcast posted to Telegram!', result.result.message_id);
      return {
        success: true,
        messageId: result.result.message_id,
        chat: channelId,
        card: selectedCard.name,
        quote: cleanQuote
      };
    } else {
      console.error('❌ Failed to post to Telegram:', result.description);
      return {
        success: false,
        error: result.description
      };
    }
  } catch (err) {
    console.error('❌ Error sending Pedro Card broadcast:', err);
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
                ? `✅ *Pedro Card Photo GM Sent to Channel!*\n\n*Message ID:* \`${result.messageId}\``
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
  console.log('🚀 Triggering immediate Pedro Card Photo GM Broadcast test...');
  sendDailyChannelPost().then(res => {
    console.log('Broadcast Result:', JSON.stringify(res, null, 2));
  });
}
