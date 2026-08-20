import { createCanvas } from '@napi-rs/canvas';

/**
 * Royal Gold & Black Web3 GM Photo Card Image Generator.
 * Features deep obsidian black base, metallic gold glowing borders, 
 * gold ambient lighting, massive white-to-gold gradient typography, 
 * and sharp high-contrast mobile legibility.
 * 
 * @param {string} quoteText - GM quote string
 * @param {object} categoryObj - { name: 'MOTIVATIONAL', icon: '👑', color: '#F3BA2F' }
 * @returns {Promise<Buffer>} PNG Image Buffer
 */
export async function renderGMCardImage(quoteText, categoryObj = { name: 'MOTIVATIONAL', icon: '👑', color: '#F3BA2F' }) {
  const size = 1080;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  const goldPrimary = '#F3BA2F';
  const goldLight = '#FFD700';
  const categoryIcon = categoryObj.icon || '☀️';
  const categoryName = (categoryObj.name || 'DAILY GM').toUpperCase();

  // 1. Pure Obsidian Black Base Background
  ctx.fillStyle = '#050507';
  ctx.fillRect(0, 0, size, size);

  // 2. Royal Gold Ambient Lighting Gradients
  ctx.save();
  // Central Gold Aura
  const centerGlow = ctx.createRadialGradient(size / 2, size / 2, 40, size / 2, size / 2, 580);
  centerGlow.addColorStop(0, 'rgba(243, 186, 47, 0.22)');
  centerGlow.addColorStop(0.5, 'rgba(184, 134, 11, 0.08)');
  centerGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = centerGlow;
  ctx.fillRect(0, 0, size, size);

  // Top-Left Gold Corner Accent Glow
  const topLeftGlow = ctx.createRadialGradient(180, 180, 10, 180, 180, 420);
  topLeftGlow.addColorStop(0, 'rgba(255, 215, 0, 0.25)');
  topLeftGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = topLeftGlow;
  ctx.fillRect(0, 0, size, size);
  ctx.restore();

  // 3. Subtle Gold Sparkles Background Graphics
  ctx.save();
  const sparkles = [
    { x: 120, y: 140, char: '✦', s: 22 },
    { x: 960, y: 160, char: '✦', s: 26 },
    { x: 140, y: 940, char: '✦', s: 24 },
    { x: 940, y: 920, char: '✦', s: 28 },
    { x: 540, y: 90, char: '✨', s: 30 }
  ];
  ctx.fillStyle = 'rgba(243, 186, 47, 0.4)';
  for (const sp of sparkles) {
    ctx.font = `${sp.s}px sans-serif`;
    ctx.fillText(sp.char, sp.x, sp.y);
  }
  ctx.restore();

  // 4. Dark Obsidian Glass Card Container
  const margin = 44;
  const cardSize = size - margin * 2;
  const borderRadius = 40;

  // Card Outer Gold Halo Shadow
  ctx.save();
  ctx.shadowColor = 'rgba(243, 186, 47, 0.45)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 12;

  ctx.fillStyle = 'rgba(12, 11, 10, 0.94)';
  ctx.beginPath();
  ctx.roundRect(margin, margin, cardSize, cardSize, borderRadius);
  ctx.fill();
  ctx.restore();

  // Metallic Gold Border
  ctx.save();
  const goldBorderGrad = ctx.createLinearGradient(margin, margin, size - margin, size - margin);
  goldBorderGrad.addColorStop(0, goldLight);
  goldBorderGrad.addColorStop(0.5, '#FFFFFF');
  goldBorderGrad.addColorStop(0.8, goldPrimary);
  goldBorderGrad.addColorStop(1, '#B8860B');

  ctx.strokeStyle = goldBorderGrad;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(margin, margin, cardSize, cardSize, borderRadius);
  ctx.stroke();

  // Corner Gold Stars (✦)
  ctx.fillStyle = goldLight;
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('✦', margin + 18, margin + 34);
  ctx.fillText('✦', size - margin - 32, margin + 34);
  ctx.fillText('✦', margin + 18, size - margin - 16);
  ctx.fillText('✦', size - margin - 32, size - margin - 16);
  ctx.restore();

  // 5. Header Row
  const headerY = margin + 45;
  const headerHeight = 56;

  // Left Brand Logo Pill ("☀️ GM GENERATOR")
  ctx.save();
  ctx.fillStyle = 'rgba(243, 186, 47, 0.12)';
  ctx.strokeStyle = 'rgba(243, 186, 47, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(margin + 36, headerY, 280, headerHeight, 28);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = goldLight;
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('☀️', margin + 54, headerY + 38);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 21px "Trebuchet MS", "Arial Black", sans-serif';
  ctx.fillText('GM GENERATOR', margin + 96, headerY + 37);
  ctx.restore();

  // Right Category Tag Pill ("👑 MOTIVATIONAL")
  ctx.save();
  ctx.font = 'bold 20px "Trebuchet MS", monospace';
  const pillText = `${categoryIcon} ${categoryName}`;
  const pillWidth = ctx.measureText(pillText).width + 48;
  const pillX = size - margin - 36 - pillWidth;

  ctx.fillStyle = 'rgba(243, 186, 47, 0.22)';
  ctx.strokeStyle = goldPrimary;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(pillX, headerY, pillWidth, headerHeight, 28);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = goldLight;
  ctx.shadowColor = goldPrimary;
  ctx.shadowBlur = 10;
  ctx.fillText(pillText, pillX + 24, headerY + 37);
  ctx.restore();

  // 6. MASSIVE Hero Metallic Gold Typography
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
  ctx.fillStyle = 'rgba(243, 186, 47, 0.12)';
  ctx.font = '900 220px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('“', size / 2, size / 2 - 35);
  ctx.restore();

  // Text Metallic Gold Gradient Fill
  const totalTextHeight = lines.length * lineHeight;
  const textAreaCenterY = size / 2 + 15;
  let startY = textAreaCenterY - (totalTextHeight / 2) + (fontSize * 0.7);

  const textGrad = ctx.createLinearGradient(0, startY - fontSize, 0, startY + totalTextHeight);
  textGrad.addColorStop(0, '#FFFFFF');
  textGrad.addColorStop(0.35, '#FFF6D6');
  textGrad.addColorStop(0.85, goldLight);
  textGrad.addColorStop(1, goldPrimary);

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 25;
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

  // 7. Metallic Gold Divider Line
  const footerLineY = size - margin - 95;
  ctx.save();
  const lineGrad = ctx.createLinearGradient(margin + 36, 0, size - margin - 36, 0);
  lineGrad.addColorStop(0, 'transparent');
  lineGrad.addColorStop(0.2, goldPrimary);
  lineGrad.addColorStop(0.5, goldLight);
  lineGrad.addColorStop(0.8, goldPrimary);
  lineGrad.addColorStop(1, 'transparent');

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
  ctx.fillStyle = 'rgba(243, 186, 47, 0.08)';
  ctx.strokeStyle = 'rgba(243, 186, 47, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(margin + 36, footerBarY, cardSize - 72, footerBarHeight, 16);
  ctx.fill();
  ctx.stroke();

  // Left Footer Brand & Bot Tag
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 20px "Trebuchet MS", monospace';
  ctx.fillText('⚡ GM GENERATOR  •  @generategmbot', margin + 56, footerBarY + 36);

  // Right Footer Link
  ctx.textAlign = 'right';
  ctx.fillStyle = goldLight;
  ctx.font = 'bold 20px "Trebuchet MS", monospace';
  ctx.fillText('t.me/generategmbot/app 👑', size - margin - 56, footerBarY + 36);
  ctx.restore();

  return canvas.toBuffer('image/png');
}
