import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PEDRO_MASCOTS = [
  'pedro_king.png',
  'pedro_rocket.png',
  'pedro_astronaut.png',
  'pedro_dj.png',
  'pedro_diamond.png'
];

/**
 * Ultra-Dynamic, Graphic-Rich Web3 GM Photo Card Image Generator.
 * Features tech corner brackets, gradient hero quotes, floating Web3 sparkles/coins,
 * Pedro mascot stamp badges, and rich cosmic background textures.
 * 
 * @param {string} quoteText - GM quote string
 * @param {object} categoryObj - { name: 'MOTIVATIONAL', icon: '🔥', color: '#F3BA2F' }
 * @returns {Promise<Buffer>} PNG Image Buffer
 */
export async function renderGMCardImage(quoteText, categoryObj = { name: 'MOTIVATIONAL', icon: '🔥', color: '#F3BA2F' }) {
  const size = 1080;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  const accentColor = categoryObj.color || '#F3BA2F';
  const categoryIcon = categoryObj.icon || '☀️';
  const categoryName = (categoryObj.name || 'DAILY GM').toUpperCase();

  // 1. Deep Obsidian Base
  ctx.fillStyle = '#060812';
  ctx.fillRect(0, 0, size, size);

  // 2. Rich Multi-layered Mesh Aura Gradients
  ctx.save();
  const aura1 = ctx.createRadialGradient(260, 220, 40, 260, 220, 600);
  aura1.addColorStop(0, `${accentColor}60`);
  aura1.addColorStop(0.5, `${accentColor}22`);
  aura1.addColorStop(1, 'transparent');
  ctx.fillStyle = aura1;
  ctx.fillRect(0, 0, size, size);

  const aura2 = ctx.createRadialGradient(840, 840, 40, 840, 840, 620);
  aura2.addColorStop(0, 'rgba(153, 69, 255, 0.40)');
  aura2.addColorStop(0.5, 'rgba(56, 189, 248, 0.22)');
  aura2.addColorStop(1, 'transparent');
  ctx.fillStyle = aura2;
  ctx.fillRect(0, 0, size, size);
  ctx.restore();

  // 3. Cyber Tech Grid & Floating Particle Graphics
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1.5;
  const gridSize = 60;
  for (let x = 0; x < size; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }
  for (let y = 0; y < size; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

  // Floating Sparkles Graphics (Background Details)
  const sparkles = [
    { x: 120, y: 150, char: '✨', s: 32 },
    { x: 960, y: 180, char: '⚡', s: 36 },
    { x: 140, y: 920, char: '💎', s: 30 },
    { x: 940, y: 900, char: '🪙', s: 34 },
    { x: 540, y: 100, char: '🌟', s: 28 }
  ];
  for (const sp of sparkles) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.font = `${sp.s}px sans-serif`;
    ctx.fillText(sp.char, sp.x, sp.y);
  }
  ctx.restore();

  // 4. Glassmorphic Main Card Container
  const margin = 42;
  const cardSize = size - margin * 2;
  const borderRadius = 40;

  // Card Halo Glow
  ctx.save();
  ctx.shadowColor = `${accentColor}70`;
  ctx.shadowBlur = 45;
  ctx.shadowOffsetY = 14;

  ctx.fillStyle = 'rgba(12, 17, 29, 0.93)';
  ctx.beginPath();
  ctx.roundRect(margin, margin, cardSize, cardSize, borderRadius);
  ctx.fill();
  ctx.restore();

  // Dual Neon Gradient Border
  ctx.save();
  const borderGrad = ctx.createLinearGradient(margin, margin, size - margin, size - margin);
  borderGrad.addColorStop(0, accentColor);
  borderGrad.addColorStop(0.5, '#FFFFFF');
  borderGrad.addColorStop(1, '#9945FF');

  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(margin, margin, cardSize, cardSize, borderRadius);
  ctx.stroke();

  // Decorative Cyber Corner Accents (+)
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 24px monospace';
  ctx.fillText('+', margin + 15, margin + 30);
  ctx.fillText('+', size - margin - 25, margin + 30);
  ctx.fillText('+', margin + 15, size - margin - 15);
  ctx.fillText('+', size - margin - 25, size - margin - 15);
  ctx.restore();

  // 5. Header Row with Pedro Mascot Stamp & Category Tag
  const headerY = margin + 45;
  const headerHeight = 56;

  // Left Brand Logo Pill ("☀️ GM GENERATOR")
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.09)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(margin + 36, headerY, 280, headerHeight, 28);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#F59E0B';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('☀️', margin + 54, headerY + 38);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 21px "Trebuchet MS", "Arial Black", sans-serif';
  ctx.fillText('GM GENERATOR', margin + 96, headerY + 37);
  ctx.restore();

  // Pedro Mascot Emblem Badge (Middle Header Graphic)
  try {
    const randomMascot = PEDRO_MASCOTS[Math.floor(Math.random() * PEDRO_MASCOTS.length)];
    const localImgPath = path.join(__dirname, '..', 'public', 'pedro_characters', randomMascot);

    if (fs.existsSync(localImgPath)) {
      const mascotImg = await loadImage(localImgPath);
      const mSize = 64;
      const mX = size / 2 - mSize / 2;
      const mY = headerY - 4;

      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(size / 2, headerY + headerHeight / 2, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.drawImage(mascotImg, mX, mY, mSize, mSize);
      ctx.restore();
    }
  } catch (e) {
    // Ignore emblem image error
  }

  // Right Category Tag Pill ("🔥 MOTIVATIONAL")
  ctx.save();
  ctx.font = 'bold 20px "Trebuchet MS", monospace';
  const pillText = `${categoryIcon} ${categoryName}`;
  const pillWidth = ctx.measureText(pillText).width + 48;
  const pillX = size - margin - 36 - pillWidth;

  ctx.fillStyle = `${accentColor}35`;
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(pillX, headerY, pillWidth, headerHeight, 28);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = accentColor;
  ctx.shadowBlur = 12;
  ctx.fillText(pillText, pillX + 24, headerY + 37);
  ctx.restore();

  // 6. MASSIVE Gradient Hero Typography (Quote)
  const cleanQuote = quoteText.replace(/^["“]|["”]$/g, '').trim();

  let fontSize = 72;
  let lineHeight = 92;

  if (cleanQuote.length > 130) {
    fontSize = 48;
    lineHeight = 66;
  } else if (cleanQuote.length > 80) {
    fontSize = 58;
    lineHeight = 78;
  } else if (cleanQuote.length > 45) {
    fontSize = 66;
    lineHeight = 86;
  }

  const fontStack = `900 ${fontSize}px "Trebuchet MS", "Arial Black", "Impact", sans-serif`;
  ctx.font = fontStack;
  ctx.textAlign = 'center';

  const maxTextWidth = cardSize - 90;
  const words = cleanQuote.split(' ');
  const lines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxTextWidth && i > 0) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);

  // Background Quotation Mark Watermark (" “ ")
  ctx.save();
  ctx.fillStyle = `${accentColor}22`;
  ctx.font = '900 220px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('“', size / 2, size / 2 - 35);
  ctx.restore();

  // Text Gradient Fill (Bright White to Golden Accent Gradient)
  const totalTextHeight = lines.length * lineHeight;
  const textAreaCenterY = size / 2 + 15;
  let startY = textAreaCenterY - (totalTextHeight / 2) + (fontSize * 0.7);

  const textGrad = ctx.createLinearGradient(0, startY - fontSize, 0, startY + totalTextHeight);
  textGrad.addColorStop(0, '#FFFFFF');
  textGrad.addColorStop(0.7, '#FFFFFF');
  textGrad.addColorStop(1, accentColor);

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = textGrad;
  ctx.font = fontStack;

  for (let j = 0; j < lines.length; j++) {
    let lineStr = lines[j];
    if (lines.length === 1) {
      lineStr = `“${lineStr}”`;
    } else if (j === 0) {
      lineStr = `“${lineStr}`;
    } else if (j === lines.length - 1) {
      lineStr = `${lineStr}”`;
    }

    ctx.fillText(lineStr, size / 2, startY + (j * lineHeight));
  }
  ctx.restore();

  // 7. Glowing Accent Footer Divider
  const footerLineY = size - margin - 95;
  ctx.save();
  const lineGrad = ctx.createLinearGradient(margin + 36, 0, size - margin - 36, 0);
  lineGrad.addColorStop(0, accentColor);
  lineGrad.addColorStop(0.5, '#FFFFFF');
  lineGrad.addColorStop(1, '#38BDF8');

  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(margin + 36, footerLineY);
  ctx.lineTo(size - margin - 36, footerLineY);
  ctx.stroke();
  ctx.restore();

  // 8. HIGH-CONTRAST Glass Footer Bar
  const footerBarY = size - margin - 80;
  const footerBarHeight = 56;

  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(margin + 36, footerBarY, cardSize - 72, footerBarHeight, 16);
  ctx.fill();
  ctx.stroke();

  // Left Footer Brand & Bot Tag
  ctx.textAlign = 'left';
  ctx.fillStyle = '#E2E8F0';
  ctx.font = 'bold 20px "Trebuchet MS", monospace';
  ctx.fillText('⚡ GM GENERATOR  •  @generategmbot', margin + 56, footerBarY + 36);

  // Right Footer Link
  ctx.textAlign = 'right';
  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 20px "Trebuchet MS", monospace';
  ctx.fillText('t.me/generategmbot/app 🚀', size - margin - 56, footerBarY + 36);
  ctx.restore();

  return canvas.toBuffer('image/png');
}
