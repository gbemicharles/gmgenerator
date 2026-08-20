import { createCanvas } from '@napi-rs/canvas';

/**
 * Ultra-Sleek, High-Legibility Web3 GM Photo Card Image Generator.
 * Features ultra-clear headers, prominent category badges, highly visible footers,
 * and massive hero typography designed for 100% readability on mobile screens.
 * 
 * @param {string} quoteText - GM quote string
 * @param {object} categoryObj - { name: 'MOTIVATIONAL', icon: '🔥', color: '#F59E0B' }
 * @returns {Promise<Buffer>} PNG Image Buffer
 */
export async function renderGMCardImage(quoteText, categoryObj = { name: 'MOTIVATIONAL', icon: '🔥', color: '#F59E0B' }) {
  const size = 1080;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  const accentColor = categoryObj.color || '#F59E0B';
  const categoryIcon = categoryObj.icon || '☀️';
  const categoryName = (categoryObj.name || 'DAILY GM').toUpperCase();

  // 1. Deep Obsidian Base Background
  ctx.fillStyle = '#060812';
  ctx.fillRect(0, 0, size, size);

  // 2. Vibrant Dual Cosmic Aura Mesh Glows
  ctx.save();
  // Top-Left Neon Category Aura
  const aura1 = ctx.createRadialGradient(240, 220, 30, 240, 220, 560);
  aura1.addColorStop(0, `${accentColor}50`);
  aura1.addColorStop(0.5, `${accentColor}20`);
  aura1.addColorStop(1, 'transparent');
  ctx.fillStyle = aura1;
  ctx.fillRect(0, 0, size, size);

  // Bottom-Right Cyan/Purple Aura
  const aura2 = ctx.createRadialGradient(840, 840, 30, 840, 840, 580);
  aura2.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
  aura2.addColorStop(0.5, 'rgba(153, 69, 255, 0.20)');
  aura2.addColorStop(1, 'transparent');
  ctx.fillStyle = aura2;
  ctx.fillRect(0, 0, size, size);
  ctx.restore();

  // 3. Cyber Tech Grid Overlay
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
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
  ctx.restore();

  // 4. Glassmorphic Main Card Container
  const margin = 42;
  const cardSize = size - margin * 2;
  const borderRadius = 40;

  // Outer Neon Glow Shadow
  ctx.save();
  ctx.shadowColor = `${accentColor}60`;
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 12;

  // Glass Card Fill
  ctx.fillStyle = 'rgba(13, 19, 32, 0.92)';
  ctx.beginPath();
  ctx.roundRect(margin, margin, cardSize, cardSize, borderRadius);
  ctx.fill();
  ctx.restore();

  // Dual Neon Gradient Border
  ctx.save();
  const borderGrad = ctx.createLinearGradient(margin, margin, size - margin, size - margin);
  borderGrad.addColorStop(0, accentColor);
  borderGrad.addColorStop(0.5, '#FFFFFF');
  borderGrad.addColorStop(1, '#38BDF8');

  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(margin, margin, cardSize, cardSize, borderRadius);
  ctx.stroke();
  ctx.restore();

  // 5. Highly Visible Top Header Row
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

  // Sun Icon
  ctx.fillStyle = '#F59E0B';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('☀️', margin + 54, headerY + 38);

  // Title Text (Bright White & Clear)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 21px "Trebuchet MS", "Arial Black", sans-serif';
  ctx.fillText('GM GENERATOR', margin + 96, headerY + 37);
  ctx.restore();

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
  ctx.shadowBlur = 10;
  ctx.fillText(pillText, pillX + 24, headerY + 37);
  ctx.restore();

  // 6. MASSIVE Hero Typography (Quotes)
  const cleanQuote = quoteText.replace(/^["“]|["”]$/g, '').trim();

  // Dynamic Font Size Scaling
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
  ctx.fillStyle = `${accentColor}18`;
  ctx.font = '900 200px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('“', size / 2, size / 2 - 35);
  ctx.restore();

  // Draw Hero Text Lines with Crisp Drop Shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = fontStack;

  const totalTextHeight = lines.length * lineHeight;
  const textAreaCenterY = size / 2 + 15;
  let startY = textAreaCenterY - (totalTextHeight / 2) + (fontSize * 0.7);

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

  // 8. HIGH-CONTRAST Glass Footer Bar (Crystal Clear Text on Mobile)
  const footerBarY = size - margin - 80;
  const footerBarHeight = 56;

  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
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
