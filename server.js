import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Serve static frontend files from dist
app.use(express.static(path.join(__dirname, 'dist')));

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
    const url = `https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${encodeURIComponent(cleanChannel)}&user_id=${userId}`;
    
    const response = await fetch(url);
    const data = await response.json();

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
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 GM Generator server running on port ${PORT}`);
});
