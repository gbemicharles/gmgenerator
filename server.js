import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

import { sendDailyChannelPost, startTelegramBotListener, startDailyBroadcastScheduler } from './server/telegramChannelBot.js';

// Health check endpoint for Railway / deployment platform checks
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

/**
 * Telegram Webhook Receiver (Handles /start and /gm commands via Webhook)
 */
app.post(['/api/telegram-webhook', '/telegram-webhook'], async (req, res) => {
  res.status(200).send('OK');
  try {
    const update = req.body;
    if (!update) return;

    const msg = update.message || update.channel_post;
    if (!msg || !msg.text) return;

    const text = msg.text.trim();
    const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
    const webAppDirectUrl = process.env.WEBAPP_URL || process.env.VITE_APP_URL || 'https://gmgenerator-production.up.railway.app';
    const tmeAppUrl = 'https://t.me/generategmbot/app';

    if (text.startsWith('/start') || text.startsWith('/help')) {
      console.log(`📩 Webhook /start command received from chat ${msg.chat.id}`);

      const welcomeText = 
`☀️ *Welcome to GM Generator!* 🚀

Generate your preferred daily GM posts, level up your streak, unlock achievements, and share custom GM cards to your groups & channel!

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
              text: '⚡ Launch Mini App',
              url: tmeAppUrl
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
    }
  } catch (err) {
    console.error('Error handling Telegram Webhook:', err.message);
  }
});

/**
 * Instant Telegram Channel Broadcast Test API
 * GET /api/test-post
 */
app.get('/api/test-post', async (req, res) => {
  try {
    const text = req.query.text || null;
    const result = await sendDailyChannelPost(text);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Serve static frontend files from dist if dist exists
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

/**
 * Verify Telegram Channel Subscription API
 * GET /api/verify-sub?userId=12345678
 */
app.get('/api/verify-sub', async (req, res) => {
  const userId = req.query.userId;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const channelUsername = process.env.TELEGRAM_CHANNEL_USERNAME || '@generategm';

  if (!userId) {
    return res.status(400).json({ isSubscribed: false, error: 'Missing userId parameter' });
  }

  // If bot token is not set yet in server environment variables
  if (!botToken) {
    console.warn('TELEGRAM_BOT_TOKEN environment variable is not configured on server.');
    return res.json({ 
      isSubscribed: false, 
      warning: 'TELEGRAM_BOT_TOKEN variable missing on Railway server settings.',
      requiresBotToken: true 
    });
  }

  try {
    const cleanChannel = channelUsername.startsWith('@') ? channelUsername : `@${channelUsername}`;
    const apiUrl = `https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${encodeURIComponent(cleanChannel)}&user_id=${userId}`;

    // Helper using native https module for 100% Node compatibility
    const data = await new Promise((resolve, reject) => {
      https.get(apiUrl, (telegramRes) => {
        let body = '';
        telegramRes.on('data', (chunk) => body += chunk);
        telegramRes.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', (err) => reject(err));
    });

    if (data.ok && data.result) {
      const status = data.result.status; // 'creator' | 'administrator' | 'member' | 'restricted' | 'left' | 'kicked'
      const isSubscribed = ['creator', 'administrator', 'member', 'restricted'].includes(status);

      return res.json({
        isSubscribed,
        status,
        channel: cleanChannel
      });
    } else {
      return res.json({
        isSubscribed: false,
        status: 'left',
        error: data.description || 'Not a channel member'
      });
    }
  } catch (err) {
    console.error('Error verifying Telegram subscription:', err);
    return res.status(500).json({ isSubscribed: false, error: 'Failed to verify with Telegram API' });
  }
});

// Fallback all SPA routes to dist/index.html
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send('GM Generator app is building...');
  }
});

// CRITICAL FOR RAILWAY: Must bind to '0.0.0.0' host
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 GM Generator server running on http://0.0.0.0:${PORT}`);
  startTelegramBotListener();
  startDailyBroadcastScheduler();
});
