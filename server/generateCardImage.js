import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * AI-Powered Masterpiece GM Photo Card Image Generator.
 * Uses Gemini AI Luxury Gold & Black Card Background Artwork combined with
 * dynamic hero typography rendering.
 * 
 * @param {string} quoteText - GM quote string
 * @param {object} categoryObj - { name: 'MOTIVATIONAL', icon: '👑', color: '#F5B800' }
 * @returns {Promise<Buffer>} PNG Image Buffer
 */
export async function renderGMCardImage(quoteText, categoryObj = { name: 'MOTIVATIONAL', icon: '👑', color: '#F5B800' }) {
  const size = 1080;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  const goldLight = '#FFE899';
  const goldMain = '#F5B800';
  const categoryIcon = categoryObj.icon || '👑';
  const categoryName = (categoryObj.name || 'DAILY GM').toUpperCase();

  // 1. Load AI-Generated Masterpiece Card Background Artwork
  const aiMasterpiecePath = path.join(__dirname, '..', 'public', 'gm_card_masterpiece.png');
  let loadedBg = false;

  try {
    if (fs.existsSync(aiMasterpiecePath)) {
      const bgImg = await loadImage(aiMasterpiecePath);
      ctx.drawImage(bgImg, 0, 0, size, size);
      loadedBg = true;
    }
  } catch (err) {
    console.warn('AI card background load fallback:', err.message);
  }

  // Fallback dark gradient background if AI image loading fails
  if (!loadedBg) {
    ctx.fillStyle = '#050507';
    ctx.fillRect(0, 0, size, size);

    const centerGlow = ctx.createRadialGradient(size / 2, size / 2, 50, size / 2, size / 2, 540);
    centerGlow.addColorStop(0, 'rgba(245, 184, 0, 0.28)');
    centerGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = centerGlow;
    ctx.fillRect(0, 0, size, size);
  }

  // 2. Translucent Dark Glass Overlay Panel for Text Readability
  const margin = 50;
  const cardW = size - margin * 2;
  const cardH = size - margin * 2;

  ctx.save();
  ctx.fillStyle = 'rgba(7, 8, 12, 0.78)';
  ctx.beginPath();
  ctx.roundRect(margin, margin, cardW, cardH, 36);
  ctx.fill();

  // Glowing Gold Accent Border
  const goldBorderGrad = ctx.createLinearGradient(margin, margin, size - margin, size - margin);
  goldBorderGrad.addColorStop(0, '#FFE899');
  goldBorderGrad.addColorStop(0.5, '#F5B800');
  goldBorderGrad.addColorStop(1, '#B8860B');

  ctx.strokeStyle = goldBorderGrad;
  ctx.lineWidth = 3.5;
  ctx.stroke();
  ctx.restore();

  // 3. Header Row: Category Badge (Top Right)
  const headerY = margin + 40;
  const headerHeight = 52;

  ctx.save();
  ctx.font = 'bold 20px "Trebuchet MS", monospace';
  const pillText = `${categoryIcon} ${categoryName}`;
  const pillWidth = ctx.measureText(pillText).width + 48;
  const pillX = size - margin - 36 - pillWidth;

  ctx.fillStyle = 'rgba(245, 184, 0, 0.35)';
  ctx.strokeStyle = goldMain;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(pillX, headerY, pillWidth, headerHeight, 26);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = goldLight;
  ctx.shadowColor = goldMain;
  ctx.shadowBlur = 12;
  ctx.fillText(pillText, pillX + 24, headerY + 34);
  ctx.restore();

  // 4. Hero Quote Typography (Center)
  const cleanQuote = quoteText.replace(/^["“]|["”]$/g, '').trim();

  let fontSize = 68;
  let lineHeight = 88;

  if (cleanQuote.length > 130) {
    fontSize = 46;
    lineHeight = 64;
  } else if (cleanQuote.length > 80) {
    fontSize = 56;
    lineHeight = 76;
  } else if (cleanQuote.length > 45) {
    fontSize = 62;
    lineHeight = 82;
  }

  const fontStack = `900 ${fontSize}px "Trebuchet MS", "Arial Black", "Impact", sans-serif`;
  ctx.font = fontStack;
  ctx.textAlign = 'center';

  const maxTextWidth = cardW - 90;
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
  ctx.fillStyle = 'rgba(245, 184, 0, 0.16)';
  ctx.font = '900 240px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('“', size / 2, size / 2 - 25);
  ctx.restore();

  // Metallic Gold Gradient Text Fill with Strong Drop Shadow
  const totalTextHeight = lines.length * lineHeight;
  const textAreaCenterY = size / 2 + 15;
  let startY = textAreaCenterY - (totalTextHeight / 2) + (fontSize * 0.7);

  const textGrad = ctx.createLinearGradient(0, startY - fontSize, 0, startY + totalTextHeight);
  textGrad.addColorStop(0, '#FFFFFF');
  textGrad.addColorStop(0.35, '#FFF8E0');
  textGrad.addColorStop(0.85, goldLight);
  textGrad.addColorStop(1, goldMain);

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.98)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 10;
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

  // 5. Metallic Gold Footer Bar
  const footerBarY = size - margin - 75;
  const footerBarHeight = 54;

  ctx.save();
  ctx.fillStyle = 'rgba(245, 184, 0, 0.12)';
  ctx.strokeStyle = 'rgba(255, 232, 153, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(margin + 36, footerBarY, cardW - 72, footerBarHeight, 16);
  ctx.fill();
  ctx.stroke();

  // Left Footer Brand & Bot
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 20px "Trebuchet MS", monospace';
  ctx.fillText('⚡ GM GENERATOR  •  @generategmbot', margin + 56, footerBarY + 34);

  // Right Footer Link
  ctx.textAlign = 'right';
  ctx.fillStyle = goldLight;
  ctx.font = 'bold 20px "Trebuchet MS", monospace';
  ctx.fillText('t.me/generategmbot/app 👑', size - margin - 56, footerBarY + 34);
  ctx.restore();

  return canvas.toBuffer('image/png');
}
