/**
 * Telegram Daily Broadcast Bot Script for @generategmbot
 * Posts high-energy TON / Gram ecosystem style GM messages to Telegram Channel or Group.
 * 
 * Features:
 * - TON / Gram memecoin templates ($REDO 🐕‍🦺, $PEDRO 🦝, $UTYA 🦆)
 * - Inline Keyboard with "☀️ Open App" and "📢 Join Channel" buttons
 * - Immediate test trigger endpoint & daily cron scheduler
 */

import { PEDRO_CHARACTERS } from '../src/data/pedroCharacters.js';

const TON_GRAM_TEMPLATES = [
  {
    header: "☀️ *GRAM MORNING TON FAMILY!* ☀️",
    body: "“GM to all TON memecoin holders! Resistance Dog $REDO 🐕‍🦺, Pedro 🦝, and Utya 🦆 cooking parabolic gains on Telegram!”",
    footer: "🚀 *Generate your GM post today with @generategmbot!*\n💎 *Powered by Pedro Team*"
  },
  {
    header: "💎 *GRAM MORNING MEMECOIN ARMY!* 💎",
    body: "“Gram morning ser! Telegram ecosystem tokens printing parabolic green candles on TON! Holding $REDO 🐕‍🦺, $PEDRO 🦝, and $UTYA 🦆 with maximum gigachad conviction!”",
    footer: "🚀 *Create your unhinged GM post now with @generategmbot!*"
  },
  {
    header: "🦝 *PEDRO MASCOT DAILY GM DROP* 🦝",
    body: "“GM to the TON believers! Hooded dog, trash bandit Pedro, and yellow duck taking over Web3! 100x vibes only!”",
    footer: "🔥 *Generate custom Pedro GM cards on @generategmbot!*"
  },
  {
    header: "⚡ *TELEGRAM SUPERCYCLE ACTIVATED* ⚡",
    body: "“GM! 99% of my timeline is Telegram Mini Apps and TON memecoins cooking. We are so insanely early!”",
    footer: "☀️ *Start your morning right with @generategmbot!*"
  }
];

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

  // Choose template or use Pedro character quote
  let postContent = '';
  const isPedroChar = Math.random() < 0.4;

  if (customText) {
    postContent = 
`☀️ *DAILY GM BROADCAST* ☀️

“${customText}”

🚀 *Generate your GM post today with @generategmbot!*
💎 *Powered by Pedro Team*`;
  } else if (isPedroChar) {
    const char = PEDRO_CHARACTERS[Math.floor(Math.random() * PEDRO_CHARACTERS.length)];
    const quote = char.gms[Math.floor(Math.random() * char.gms.length)];

    postContent = 
`🦝 *${char.name.toUpperCase()} GM DROP* 🦝

“${quote}”

🚀 *Generate Pedro mascot GM posts today with @generategmbot!*
💎 *Powered by Pedro Team*`;
  } else {
    const tmpl = TON_GRAM_TEMPLATES[Math.floor(Math.random() * TON_GRAM_TEMPLATES.length)];
    postContent = 
`${tmpl.header}

${tmpl.body}

${tmpl.footer}`;
  }

  // Construct Inline Keyboard buttons
  const cleanChannel = channelId.startsWith('@') ? channelId : `@${channelId}`;
  const inlineKeyboard = {
    inline_keyboard: [
      [
        {
          text: '☀️ Open GM Generator App',
          url: miniAppUrl
        }
      ],
      [
        {
          text: '📢 Join @generategm Channel',
          url: `https://t.me/${cleanChannel.replace('@', '')}`
        }
      ]
    ]
  };

  const payload = {
    chat_id: channelId,
    text: postContent,
    parse_mode: 'Markdown',
    reply_markup: inlineKeyboard
  };

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.ok) {
      console.log('✅ Daily TON/Gram GM Broadcast posted to Telegram!', result.result.message_id);
      return {
        success: true,
        messageId: result.result.message_id,
        chat: channelId,
        content: postContent
      };
    } else {
      console.error('❌ Failed to post to Telegram:', result.description);
      return {
        success: false,
        error: result.description
      };
    }
  } catch (err) {
    console.error('❌ Error sending Telegram broadcast:', err);
    return {
      success: false,
      error: err.message || 'Network error sending broadcast'
    };
  }
}

// Execute immediately if executed directly via node CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Triggering immediate Telegram Channel Broadcast test...');
  sendDailyChannelPost().then(res => {
    console.log('Broadcast Result:', res);
  });
}
