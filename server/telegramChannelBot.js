/**
 * Telegram Daily Broadcast Bot Script for @generategmbot
 * Posts high-energy TON / Gram ecosystem style GM messages to Telegram Channel or Group.
 * 
 * Features:
 * - TON / Gram memecoin templates ($REDO 🐕‍🦺, $PEDRO 🦝, $UTYA 🦆)
 * - Inline Keyboard with "☀️ Open App" and "📢 Join Channel" buttons
 * - Immediate test trigger endpoint & daily cron scheduler
 */

import 'dotenv/config';
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
                ? `✅ *GM Broadcast Sent to Channel!*\n\n*Message ID:* \`${result.messageId}\``
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
  console.log('🚀 Triggering immediate Telegram Channel Broadcast test...');
  sendDailyChannelPost().then(res => {
    console.log('Broadcast Result:', JSON.stringify(res, null, 2));
  });
}
