import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Dynamically renders a 1200x675 HD GM Photo Card PNG Buffer
 * @param {string} quoteText - The GM quote text to embed inside the card photo
 * @param {string} categoryLabel - e.g. "MOTIVATIONAL", "UNHINGED", "CRYPTO"
 * @param {string} characterFileName - e.g. "pedro_king.png", "pedro_astronaut.png"
 * @returns {Promise<Buffer>} PNG Image Buffer
 */
export async function renderGMCardImage(quoteText, categoryLabel = 'DAILY GM', characterFileName = 'pedro_king.png') {
  const width = 1200;
  const height = 675;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 1. Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0B0E14');
  bgGrad.addColorStop(0.5, '#121722');
  bgGrad.addColorStop(1, '#07090E');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Glowing background ambient circles
  ctx.save();
  ctx.fillStyle = 'rgba(243, 186, 47, 0.08)';
  ctx.beginPath();
  ctx.arc(200, 150, 300, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(0, 136, 204, 0.08)';
  ctx.beginPath();
  ctx.arc(1000, 500, 350, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3. Main Glass Card Container Box
  const margin = 40;
  const cardW = width - margin * 2;
  const cardH = height - margin * 2;

  ctx.save();
  ctx.fillStyle = 'rgba(18, 24, 38, 0.85)';
  ctx.strokeStyle = 'rgba(243, 186, 47, 0.35)';
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.roundRect(margin, margin, cardW, cardH, 24);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // 4. Header Bar inside Card
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText('☀️ GM GENERATOR', margin + 35, margin + 60);

  // Category Badge (Top Right)
  const categoryText = (categoryLabel || 'DAILY GM').toUpperCase();
  ctx.font = 'bold 18px monospace';
  const catWidth = ctx.measureText(categoryText).width + 30;

  ctx.fillStyle = 'rgba(243, 186, 47, 0.15)';
  ctx.strokeStyle = 'rgba(243, 186, 47, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(width - margin - 35 - catWidth, margin + 35, catWidth, 38, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#F3BA2F';
  ctx.fillText(categoryText, width - margin - 35 - catWidth + 15, margin + 61);

  // 5. Draw Pedro Mascot Image (Right Side)
  try {
    const localImgPath = path.join(__dirname, '..', 'public', 'pedro_characters', characterFileName);
    if (fs.existsSync(localImgPath)) {
      const pedroImg = await loadImage(localImgPath);
      const imgSize = 340;
      ctx.drawImage(pedroImg, width - margin - 380, margin + 120, imgSize, imgSize);
    }
  } catch (err) {
    console.warn('Pedro image load warning:', err.message);
  }

  // 6. Draw GM Quote Text (Left Side with Word Wrap)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px sans-serif';

  const maxTextWidth = 620;
  const startX = margin + 40;
  let startY = margin + 180;
  const lineHeight = 50;

  // Clean quote text without quotes
  const cleanQuote = quoteText.replace(/^["“]|["”]$/g, '').trim();
  const words = cleanQuote.split(' ');
  let currentLine = '“';

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxTextWidth && i > 0) {
      ctx.fillText(currentLine, startX, startY);
      currentLine = words[i] + ' ';
      startY += lineHeight;
    } else {
      currentLine = testLine;
    }
  }
  currentLine = currentLine.trim() + '”';
  ctx.fillText(currentLine, startX, startY);

  // 7. Footer Watermark inside Card
  const footerY = height - margin - 35;
  ctx.fillStyle = '#94A3B8';
  ctx.font = '20px sans-serif';
  ctx.fillText('⚡ Created with @generategmbot  •  t.me/generategmbot/app', startX, footerY);

  return canvas.toBuffer('image/png');
}
