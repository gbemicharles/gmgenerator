import { createCanvas } from '@napi-rs/canvas';

/**
 * Ultra-Aesthetic Web3 GM Photo Card Image Generator.
 * Features massive hero typography, vibrant aura mesh gradients, 
 * glassmorphic neon borders, and state-of-the-art social card aesthetics.
 * 
 * @param {string} quoteText - GM quote string
 * @param {object} categoryObj - { name: 'MOTIVATIONAL', icon: '🔥', color: '#F3BA2F' }
 * @returns {Promise<Buffer>} PNG Image Buffer
 */
export async function renderGMCardImage(quoteText, categoryObj = { name: 'MOTIVATIONAL', icon: '🔥', color: '#F59E0B' }) {
  const size = 1080;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  const accentColor = categoryObj.color || '#F59E0B';
  const categoryIcon = categoryObj.icon || '☀️';
  const categoryName = (categoryObj.name || 'DAILY GM').toUpperCase();

  // 1. Deep Obsidian Base
  ctx.fillStyle = '#05070E';
  ctx.fillRect(0, 0, size, size);

  // 2. Vibrant Mesh Aura Gradients
  ctx.save();
  // Top-Left Category Neon Glow
  const aura1 = ctx.createRadialGradient(220, 200, 20, 220, 200, 520);
  aura1.addColorStop(0, `${accentColor}44`);
  aura1.addColorStop(0.5, `${accentColor}18`);
  aura1.addColorStop(1, 'transparent');
  ctx.fillStyle = aura1;
  ctx.fillRect(0, 0, size, size);

  // Bottom-Right Purple/Cyan Cosmic Aura
  const aura2 = ctx.createRadialGradient(860, 860, 20, 860, 860, 560);
  aura2.addColorStop(0, 'rgba(153, 69, 255, 0.30)');
  aura2.addColorStop(0.6, 'rgba(56, 189, 248, 0.12)');
  aura2.addColorStop(1, 'transparent');
  ctx.fillStyle = aura2;
  ctx.fillRect(0, 0, size, size);
  ctx.restore();

  // 3. Subtle Cyber Grid Texture
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
  ctx.lineWidth = 1;
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

  // 4. Glassmorphic Outer Card Container
  const margin = 44;
  const cardSize = size - margin * 2;
  const borderRadius = 40;

  // Card Outer Neon Halo Glow
  ctx.save();
  ctx.shadowColor = `${accentColor}50`;
  ctx.shadowBlur = 35;
  ctx.shadowOffsetY = 10;

  // Card Glass Fill
  ctx.fillStyle = 'rgba(12, 17, 28, 0.88)';
  ctx.beginPath();
  ctx.roundRect(margin, margin, cardSize, cardSize, borderRadius);
  ctx.fill();
  ctx.restore();

  // Dual-Layer Glowing Border
  ctx.save();
  const borderGrad = ctx.createLinearGradient(margin, margin, size - margin, size - margin);
  borderGrad.addColorStop(0, accentColor);
  borderGrad.addColorStop(0.5, '#FFFFFF');
  borderGrad.addColorStop(1, '#9945FF');

  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.roundRect(margin, margin, cardSize, cardSize, borderRadius);
  ctx.stroke();
  ctx.restore();

  // 5. Header Row
  const headerY = margin + 50;

  // Brand Logo Pill (Top Left)
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(margin + 36, headerY, 240, 48, 24);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#F59E0B';
  ctx.font = '900 22px sans-serif';
  ctx.fillText('☀️', margin + 54, headerY + 31);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 17px "Trebuchet MS", "Arial Black", sans-serif';
  ctx.fillText('GM GENERATOR', margin + 86, headerY + 31);
  ctx.restore();

  // Category Tag Pill (Top Right)
  ctx.save();
  ctx.font = 'bold 16px "Trebuchet MS", monospace';
  const pillText = `${categoryIcon} ${categoryName}`;
  const pillWidth = ctx.measureText(pillText).width + 40;
  const pillX = size - margin - 36 - pillWidth;

  ctx.fillStyle = `${accentColor}25`;
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(pillX, headerY, pillWidth, 48, 24);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = accentColor;
  ctx.fillText(pillText, pillX + 20, headerY + 31);
  ctx.restore();

  // 6. MASSIVE Hero Typography (Quotes)
  const cleanQuote = quoteText.replace(/^["“]|["”]$/g, '').trim();

  // Huge Adaptive Font Size Logic
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

  const maxTextWidth = cardSize - 100; // Uses maximum card width
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

  // Big Watermark Quote Marks (" “ ") in background of text
  ctx.save();
  ctx.fillStyle = `${accentColor}12`;
  ctx.font = '900 180px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('“', size / 2, size / 2 - 40);
  ctx.restore();

  // Draw Massive Hero Text Lines with Shadow Glow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 25;
  ctx.shadowOffsetY = 8;
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
  const footerLineY = size - margin - 85;
  ctx.save();
  const lineGrad = ctx.createLinearGradient(margin + 40, 0, size - margin - 40, 0);
  lineGrad.addColorStop(0, accentColor);
  lineGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
  lineGrad.addColorStop(1, '#9945FF');

  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(margin + 40, footerLineY);
  ctx.lineTo(size - margin - 40, footerLineY);
  ctx.stroke();
  ctx.restore();

  // 8. Aesthetic Footer Bar
  const footerY = size - margin - 40;

  // Left Footer Brand Tag
  ctx.textAlign = 'left';
  ctx.fillStyle = '#94A3B8';
  ctx.font = '900 16px "Trebuchet MS", monospace';
  ctx.fillText('⚡ GM GENERATOR  •  @generategmbot', margin + 40, footerY);

  // Right Footer Mini App Link
  ctx.textAlign = 'right';
  ctx.fillStyle = accentColor;
  ctx.font = '900 16px "Trebuchet MS", monospace';
  ctx.fillText('t.me/generategmbot/app 🚀', size - margin - 40, footerY);

  return canvas.toBuffer('image/png');
}
