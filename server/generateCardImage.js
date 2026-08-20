import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PEDRO_MASCOT_FILES = [
  'pedro_king.png',
  'pedro_astronaut.png',
  'pedro_dj.png',
  'pedro_diamond.png',
  'pedro_rocket.png',
  'pedro_rockstar.png',
  'pedro_wizard.png',
  'pedro_copium.png',
  'pedro_rekt.png'
];

/**
 * Dynamically renders an ULTRA-PREMIUM 1000x1000 Square GM Photo Card
 * matching modern Web3 aesthetic with glassmorphism, dynamic Pedro mascot art,
 * glowing neon accents, and adaptive typography scaling.
 * 
 * @param {string} quoteText - The GM quote string
 * @param {object} categoryObj - { name: '3AM GM', icon: '🌙', color: '#38BDF8' }
 * @returns {Promise<Buffer>} PNG Image Buffer
 */
export async function renderGMCardImage(quoteText, categoryObj = { name: 'MOTIVATIONAL', icon: '🔥', color: '#F3BA2F' }) {
  const size = 1000;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  const accentColor = categoryObj.color || '#F3BA2F';
  const categoryIcon = categoryObj.icon || '☀️';
  const categoryName = (categoryObj.name || 'DAILY GM').toUpperCase();

  // 1. Deep Midnight Web3 Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, size, size);
  bgGrad.addColorStop(0, '#0B0F19');
  bgGrad.addColorStop(0.4, '#111827');
  bgGrad.addColorStop(0.8, '#080C14');
  bgGrad.addColorStop(1, '#030509');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // 2. Multi-layered Neon Ambient Radial Glows
  ctx.save();
  // Primary category accent glow (top-left)
  const glow1 = ctx.createRadialGradient(250, 200, 10, 250, 200, 450);
  glow1.addColorStop(0, `${accentColor}33`);
  glow1.addColorStop(1, 'transparent');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, size, size);

  // Secondary purple/gold glow (bottom-right)
  const glow2 = ctx.createRadialGradient(800, 800, 10, 800, 800, 500);
  glow2.addColorStop(0, 'rgba(153, 69, 255, 0.2)');
  glow2.addColorStop(1, 'transparent');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, size, size);
  ctx.restore();

  // 3. Glassmorphic Outer Card Container
  const margin = 40;
  const cardSize = size - margin * 2;
  const borderRadius = 36;

  ctx.save();
  // Card Shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 20;

  // Glass Card Background Fill
  ctx.fillStyle = 'rgba(17, 24, 39, 0.85)';
  ctx.beginPath();
  ctx.roundRect(margin, margin, cardSize, cardSize, borderRadius);
  ctx.fill();
  ctx.restore();

  // Glass Border with Accent Gradient
  ctx.save();
  const borderGrad = ctx.createLinearGradient(margin, margin, size - margin, size - margin);
  borderGrad.addColorStop(0, accentColor);
  borderGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
  borderGrad.addColorStop(1, '#9945FF');

  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.roundRect(margin, margin, cardSize, cardSize, borderRadius);
  ctx.stroke();
  ctx.restore();

  // 4. Header Bar
  const headerY = margin + 65;

  // Sun Icon & Brand Title
  ctx.fillStyle = '#F3BA2F';
  ctx.font = '900 42px sans-serif';
  ctx.fillText('☀️', margin + 45, headerY);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 36px sans-serif';
  ctx.fillText('GM GENERATOR', margin + 105, headerY - 5);

  // Category Tag Pill (Top Right)
  ctx.font = 'bold 18px monospace';
  const pillText = `${categoryIcon} ${categoryName}`;
  const pillWidth = ctx.measureText(pillText).width + 40;
  const pillHeight = 44;
  const pillX = size - margin - 45 - pillWidth;
  const pillY = margin + 36;

  ctx.save();
  ctx.fillStyle = `${accentColor}20`;
  ctx.strokeStyle = `${accentColor}80`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 22);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = accentColor;
  ctx.fillText(pillText, pillX + 20, pillY + 28);
  ctx.restore();

  // 5. Draw Pedro Mascot Artwork Integration (Right Side Watermark Art)
  try {
    const randomPedroFile = PEDRO_MASCOT_FILES[Math.floor(Math.random() * PEDRO_MASCOT_FILES.length)];
    const localImgPath = path.join(__dirname, '..', 'public', 'pedro_characters', randomPedroFile);

    if (fs.existsSync(localImgPath)) {
      const pedroImg = await loadImage(localImgPath);
      const imgSize = 280;
      const imgX = size - margin - 310;
      const imgY = size - margin - 350;

      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.drawImage(pedroImg, imgX, imgY, imgSize, imgSize);
      ctx.restore();
    }
  } catch (err) {
    console.warn('Pedro mascot load warning:', err.message);
  }

  // 6. Watermark Large Quotes (" “ ")
  ctx.save();
  ctx.fillStyle = `${accentColor}15`;
  ctx.font = '900 240px Georgia, serif';
  ctx.fillText('“', margin + 30, margin + 250);
  ctx.restore();

  // 7. Adaptive Main Quote Text Box (Left-Aligned Centered Vertical Block)
  const cleanQuote = quoteText.replace(/^["“]|["”]$/g, '').trim();
  
  // Calculate dynamic font size based on text length
  let fontSize = 42;
  let lineHeight = 58;
  if (cleanQuote.length > 120) {
    fontSize = 32;
    lineHeight = 46;
  } else if (cleanQuote.length > 80) {
    fontSize = 36;
    lineHeight = 52;
  }

  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.fillStyle = '#F8FAFC';

  const maxTextWidth = 580; // Leaves space for Pedro mascot art on right
  const startX = margin + 55;
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

  // Vertical Centering for Quote Block
  const totalTextHeight = lines.length * lineHeight;
  let textStartY = (size / 2) - (totalTextHeight / 2) + 20;

  for (let j = 0; j < lines.length; j++) {
    const isFirst = j === 0;
    const isLast = j === lines.length - 1;
    let lineStr = lines[j];

    if (lines.length === 1) {
      lineStr = `“${lineStr}”`;
    } else if (isFirst) {
      lineStr = `“${lineStr}`;
    } else if (isLast) {
      lineStr = `${lineStr}”`;
    }

    ctx.fillText(lineStr, startX, textStartY + (j * lineHeight));
  }

  // 8. Divider Line with Glow Accent
  const footerLineY = size - margin - 90;
  ctx.save();
  const lineGrad = ctx.createLinearGradient(margin + 50, 0, size - margin - 50, 0);
  lineGrad.addColorStop(0, `${accentColor}80`);
  lineGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
  lineGrad.addColorStop(1, 'transparent');

  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(margin + 45, footerLineY);
  ctx.lineTo(size - margin - 45, footerLineY);
  ctx.stroke();
  ctx.restore();

  // 9. Footer Metadata Row
  ctx.fillStyle = '#94A3B8';
  ctx.font = 'bold 18px monospace';
  const footerText = '✨ GM GENERATOR  •  @generategmbot  •  POWERED BY PEDRO TEAM 🦝';
  ctx.fillText(footerText, margin + 45, size - margin - 45);

  return canvas.toBuffer('image/png');
}
