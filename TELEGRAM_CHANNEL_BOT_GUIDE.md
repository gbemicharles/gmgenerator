# 🤖 Telegram Channel Daily GM Broadcast Setup Guide

This guide explains how to set up `@generategmbot` to post automated daily GM write-ups to your Telegram Channel every morning with an **"☀️ Open App"** button!

---

## 📋 What the Bot Post Contains
Every morning, the bot automatically posts:
1. **Fresh GM Quote / Write-Up** (Pedro audio memecoin quotes, TON memes, or unhinged degens).
2. **Promotional Call-to-Action**: `"🚀 Generate your GM post today with @generategmbot!"`
3. **Inline Telegram Button**: `[ ☀️ Open App ]` linking directly to `https://t.me/generategmbot/app`.

---

## 🛠️ Step-by-Step Setup

### Step 1: Add Bot to Your Telegram Channel
1. Open your Telegram Channel.
2. Go to **Channel Settings** ➔ **Administrators**.
3. Tap **Add Administrator** and search for `@generategmbot`.
4. Grant the bot permission to **Post Messages**.

---

### Step 2: Configure Environment Variables
Set the following environment variables on your server or hosting provider:

```bash
export TELEGRAM_BOT_TOKEN="your_bot_token_from_botfather"
export TELEGRAM_CHANNEL_ID="@your_channel_username"
export TELEGRAM_MINI_APP_URL="https://t.me/generategmbot/app"
```

---

### Step 3: Run the Broadcast Script
To post a daily broadcast manually or test the setup:

```bash
node server/telegramChannelBot.js
```

---

### Step 4: Automate Daily Post (Cron Job / GitHub Actions / Vercel)

#### Option A: Linux Cron Job (Runs every morning at 8:00 AM)
```bash
0 8 * * * cd /path/to/gmgenerator && /usr/bin/node server/telegramChannelBot.js >> /var/log/gmbot.log 2>&1
```

#### Option B: Free GitHub Actions Workflow (`.github/workflows/daily_gm_broadcast.yml`)
You can use GitHub Actions to run the script for FREE every day at 8:00 AM UTC without needing your PC running:

```yaml
name: Daily GM Broadcast

on:
  schedule:
    - cron: '0 8 * * *' # Every morning at 8:00 AM UTC
  workflow_dispatch:

jobs:
  broadcast:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install node-fetch
      - run: node server/telegramChannelBot.js
        env:
          TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          TELEGRAM_CHANNEL_ID: ${{ secrets.TELEGRAM_CHANNEL_ID }}
          TELEGRAM_MINI_APP_URL: ${{ secrets.TELEGRAM_MINI_APP_URL }}
```

---

## ☀️ Post Format Preview

```text
☀️ DAILY GM BROADCAST ☀️

“GM! Spinning Pedro the Trash Bandit on loop while checking $PEDRO candles. Peak audio memecoin culture!”

🚀 Generate your GM post today with @generategmbot!

[ ☀️ Open App ]
```
