import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Dynamically renders the exact Shareable GM Card PNG Image matching the web app modal canvas
 * @param {string} quoteText - GM quote string
 * @param {object} categoryObj - { name: 'MOTIVATIONAL', icon: '🔥', color: '#34D399' }
 * @param {object} pedroObj - { name: 'Pedro King', file: 'pedro_king.png' }
 * @returns {Promise<Buffer>} PNG Image Buffer
 */
export async function renderGMCardImage(quoteText, categoryObj = { name: 'MOTIVATIONAL', color: '#F59E0B' }, pedroObj = { name: 'Pedro King', file: 'pedro_king.png' }) {
  const width = 1200;
  const height = 675;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const accentColor = categoryObj.color || '#38BDF8';

  // 1. Dark Futuristic Cyber Gradient Background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0F172A');
  bgGrad.addColorStop(0.5, '#090D16');
  bgGrad.addColorStop(1, '#020617');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Ambient Radial Glow Effects
  ctx.save();
  ctx.fillStyle = `${accentColor}18`;
  ctx.beginPath();
  ctx.arc(220, 180, 320, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(153, 69, 255, 0.12)';
  ctx.beginPath();
  ctx.arc(1000, 520, 380, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3. Card Frame Box with Accent Border
  const margin = 35;
  const cardW = width - margin * 2;
  const cardH = height - margin * 2;

  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.roundRect(margin, margin, cardW, cardH, 24);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // 4. Header Row: Logo & Brand Title
  const headerY = margin + 55;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 34px sans-serif';
  ctx.fillText('☀️ GM GENERATOR', margin + 40, headerY);

  // Category Tag Badge (Top Right)
  const categoryName = (categoryObj.name || 'GM').toUpperCase();
  ctx.font = 'bold 18px monospace';
  const tagWidth = ctx.measureText(categoryName).width + 36;

  ctx.save();
  ctx.fillStyle = `${accentColor}25`;
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(width - margin - 40 - tagWidth, margin + 30, tagWidth, 38, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = accentColor;
  ctx.fillText(categoryName, width - margin - 40 - tagWidth + 18, margin + 55);
  ctx.restore();

  // 5. Pedro Mascot Image & Character Name Badge (Right Column)
  try {
    const charFile = pedroObj.file || 'pedro_king.png';
    const localImgPath = path.join(__dirname, '..', 'public', 'pedro_characters', charFile);

    if (fs.existsSync(localImgPath)) {
      const pedroImg = await loadImage(localImgPath);
      const imgSize = 310;
      const imgX = width - margin - 350;
      const imgY = margin + 120;

      ctx.drawImage(pedroImg, imgX, imgY, imgSize, imgSize);

      // Pedro Character Name Tag below image
      const charName = (pedroObj.name || 'Pedro Mascot').toUpperCase();
      ctx.font = 'bold 14px monospace';
      const nameWidth = ctx.measureText(charName).width + 24;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(imgX + imgSize / 2 - nameWidth / 2, imgY + imgSize + 10, nameWidth, 26, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#CBD5E1';
      ctx.fillText(charName, imgX + imgSize / 2 - nameWidth / 2 + 12, imgY + imgSize + 28);
    }
  } catch (err) {
    console.warn('Pedro character image load warning:', err.message);
  }

  // 6. Center Quote Text (Left Column with Line Wrapping)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px sans-serif';

  const maxTextWidth = 630;
  const startX = margin + 45;
  let startY = margin + 180;
  const lineHeight = 52;

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
  ctx.font = '18px sans-serif';
  ctx.fillText('✨ GM GENERATOR  •  @generategmbot  •  POWERED BY PEDRO TEAM', startX, footerY);

  return canvas.toBuffer('image/png');
}
