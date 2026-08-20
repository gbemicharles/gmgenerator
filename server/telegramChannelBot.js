/**
 * Telegram Channel Daily GM Broadcast Bot Script for @generategmbot
 * Automatically generates a daily GM post with promo write-up and an "Open App" inline button.
 * 
 * Setup Instructions:
 * 1. Set environment variables:
 *    export TELEGRAM_BOT_TOKEN="your_bot_token_from_botfather"
 *    export TELEGRAM_CHANNEL_ID="@your_channel_username" # e.g. @generategm_channel
 *    export TELEGRAM_MINI_APP_URL="https://t.me/generategmbot/app"
 * 
 * 2. Run manually:
 *    node server/telegramChannelBot.js
 * 
 * 3. Or schedule with cron (every morning at 8:00 AM):
 *    0 8 * * * node /path/to/server/telegramChannelBot.js
 */

import fetch from 'node-fetch';
import { CATEGORIES, STATIC_TEMPLATES, generateTokenGM } from '../src/data/contentLibrary.js';
import { PEDRO_CHARACTERS } from '../src/data/pedroCharacters.js';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '@generategm_channel';
const MINI_APP_URL = process.env.TELEGRAM_MINI_APP_URL || 'https://t.me/generategmbot/app';

// Pick a random GM write-up
function generateDailyBroadcast() {
  const isPedro = Math.random() < 0.4;

  if (isPedro) {
    const char = PEDRO_CHARACTERS[Math.floor(Math.random() * PEDRO_CHARACTERS.length)];
    const quote = char.gms[Math.floor(Math.random() * char.gms.length)];
    return {
      text: quote,
      character: char,
      type: 'pedro'
    };
  }

  const categoryKeys = Object.keys(STATIC_TEMPLATES);
  const randomCat = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
  const list = STATIC_TEMPLATES[randomCat];
  const quote = list[Math.floor(Math.random() * list.length)];

  return {
    text: quote,
    character: null,
    type: randomCat
  };
}

export async function sendDailyChannelPost() {
  if (BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
    console.error('⚠️ Please provide TELEGRAM_BOT_TOKEN environment variable.');
    return;
  }

  const gm = generateDailyBroadcast();

  // Construct caption with promo write-up and @generategmbot credit
  const caption = 
`☀️ *DAILY GM BROADCAST* ☀️

“${gm.text}”

🚀 *Generate your GM post today with @generategmbot!*`;

  // Inline Button launching the Telegram Mini App
  const inlineKeyboard = {
    inline_keyboard: [
      [
        {
          text: '☀️ Open App',
          url: MINI_APP_URL
        }
      ]
    ]
  };

  const payload = {
    chat_id: CHANNEL_ID,
    text: caption,
    parse_mode: 'Markdown',
    reply_markup: inlineKeyboard
  };

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (result.ok) {
      console.log('✅ Daily GM Broadcast successfully posted to Telegram Channel!', result.result.message_id);
    } else {
      console.error('❌ Failed to post to Telegram Channel:', result.description);
    }
  } catch (err) {
    console.error('❌ Error sending Telegram broadcast:', err);
  }
}

// Run script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  sendDailyChannelPost();
}
