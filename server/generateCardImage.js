import { createCanvas } from '@napi-rs/canvas';

/**
 * 16:9 Widescreen (1200x675) Royal Gold & Black GM Photo Card Image Generator.
 * Clean, high-impact Web3 landscape card format matching Twitter/Telegram banner standards.
 * 
 * @param {string} quoteText - GM quote string
 * @param {object} categoryObj - { name: 'MOTIVATIONAL', icon: '👑', color: '#F3BA2F' }
 * @returns {Promise<Buffer>} PNG Image Buffer
 */
export async function renderGMCardImage(quoteText, categoryObj = { name: 'MOTIVATIONAL', icon: '👑', color: '#F3BA2F' }) {
  const width = 1200;
  const height = 675;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const goldPrimary = '#F3BA2F';
  const goldLight = '#FFD700';
  const categoryIcon = categoryObj.icon || '☀️';
  const categoryName = (categoryObj.name || 'DAILY GM').toUpperCase();

  // 1. Pure Obsidian Black Base Background
  ctx.fillStyle = '#050507';
  ctx.fillRect(0, 0, width, height);

  // 2. Royal Gold Ambient Radial Glow
  ctx.save();
  const centerGlow = ctx.createRadialGradient(width / 2, height / 2, 30, width / 2, height / 2, 450);
  centerGlow.addColorStop(0, 'rgba(243, 186, 47, 0.22)');
  centerGlow.addColorStop(0.6, 'rgba(184, 134, 11, 0.08)');
  centerGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = centerGlow;
  ctx.fillRect(0, 0, width, height);

  const topLeftGlow = ctx.createRadialGradient(180, 140, 10, 180, 140, 320);
  topLeftGlow.addColorStop(0, 'rgba(255, 215, 0, 0.20)');
  topLeftGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = topLeftGlow;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // 3. Subtle Gold Sparkles Background Graphics
  ctx.save();
  const sparkles = [
    { x: 100, y: 100, char: '✦', s: 20 },
    { x: 1100, y: 120, char: '✦', s: 24 },
    { x: 120, y: 580, char: '✦', s: 22 },
    { x: 1080, y: 560, char: '✦', s: 26 },
    { x: 600, y: 65, char: '✨', s: 26 }
  ];
  ctx.fillStyle = 'rgba(243, 186, 47, 0.4)';
  for (const sp of sparkles) {
    ctx.font = `${sp.s}px sans-serif`;
    ctx.fillText(sp.char, sp.x, sp.y);
  }
  ctx.restore();

  // 4. Dark Obsidian Glass Card Container (Margin 36px)
  const margin = 36;
  const cardW = width - margin * 2;
  const cardH = height - margin * 2;
  const borderRadius = 32;

  // Outer Gold Halo Shadow
  ctx.save();
  ctx.shadowColor = 'rgba(243, 186, 47, 0.45)';
  ctx.shadowBlur = 35;
  ctx.shadowOffsetY = 10;

  ctx.fillStyle = 'rgba(12, 11, 10, 0.94)';
  ctx.beginPath();
  ctx.roundRect(margin, margin, cardW, cardH, borderRadius);
  ctx.fill();
  ctx.restore();

  // Metallic Gold Border
  ctx.save();
  const goldBorderGrad = ctx.createLinearGradient(margin, margin, width - margin, height - margin);
  goldBorderGrad.addColorStop(0, goldLight);
  goldBorderGrad.addColorStop(0.5, '#FFFFFF');
  goldBorderGrad.addColorStop(0.85, goldPrimary);
  goldBorderGrad.addColorStop(1, '#B8860B');

  ctx.strokeStyle = goldBorderGrad;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.roundRect(margin, margin, cardW, cardH, borderRadius);
  ctx.stroke();

  // Corner Gold Stars (✦)
  ctx.fillStyle = goldLight;
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('✦', margin + 14, margin + 26);
  ctx.fillText('✦', width - margin - 26, margin + 26);
  ctx.fillText('✦', margin + 14, height - margin - 14);
  ctx.fillText('✦', width - margin - 26, height - margin - 14);
  ctx.restore();

  // 5. Header Row
  const headerY = margin + 35;
  const headerHeight = 48;

  // Left Brand Logo Pill ("☀️ GM GENERATOR")
  ctx.save();
  ctx.fillStyle = 'rgba(243, 186, 47, 0.12)';
  ctx.strokeStyle = 'rgba(243, 186, 47, 0.4)';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(margin + 30, headerY, 250, headerHeight, 24);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = goldLight;
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('☀️', margin + 46, headerY + 33);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 19px "Trebuchet MS", "Arial Black", sans-serif';
  ctx.fillText('GM GENERATOR', margin + 84, headerY + 32);
  ctx.restore();

  // Right Category Tag Pill ("👑 MOTIVATIONAL")
  ctx.save();
  ctx.font = 'bold 18px "Trebuchet MS", monospace';
  const pillText = `${categoryIcon} ${categoryName}`;
  const pillWidth = ctx.measureText(pillText).width + 42;
  const pillX = width - margin - 30 - pillWidth;

  ctx.fillStyle = 'rgba(243, 186, 47, 0.22)';
  ctx.strokeStyle = goldPrimary;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(pillX, headerY, pillWidth, headerHeight, 24);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = goldLight;
  ctx.shadowColor = goldPrimary;
  ctx.shadowBlur = 10;
  ctx.fillText(pillText, pillX + 21, headerY + 32);
  ctx.restore();

  // 6. Center Hero Metallic Gold Typography
  const cleanQuote = quoteText.replace(/^["“]|["”]$/g, '').trim();

  let fontSize = 54;
  let lineHeight = 72;

  if (cleanQuote.length > 130) {
    fontSize = 36;
    lineHeight = 50;
  } else if (cleanQuote.length > 80) {
    fontSize = 42;
    lineHeight = 58;
  } else if (cleanQuote.length > 45) {
    fontSize = 48;
    lineHeight = 64;
  }

  const fontStack = `900 ${fontSize}px "Trebuchet MS", "Arial Black", "Impact", sans-serif`;
  ctx.font = fontStack;
  ctx.textAlign = 'center';

  const maxTextWidth = cardW - 100;
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
  ctx.font = '900 180px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('“', width / 2, height / 2 - 20);
  ctx.restore();

  // Text Metallic Gold Gradient Fill
  const totalTextHeight = lines.length * lineHeight;
  const textAreaCenterY = height / 2 + 10;
  let startY = textAreaCenterY - (totalTextHeight / 2) + (fontSize * 0.7);

  const textGrad = ctx.createLinearGradient(0, startY - fontSize, 0, startY + totalTextHeight);
  textGrad.addColorStop(0, '#FFFFFF');
  textGrad.addColorStop(0.35, '#FFF6D6');
  textGrad.addColorStop(0.85, goldLight);
  textGrad.addColorStop(1, goldPrimary);

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 6;
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

    ctx.fillText(lineStr, width / 2, startY + (j * lineHeight));
  }
  ctx.restore();

  // 7. Metallic Gold Divider Line
  const footerLineY = height - margin - 75;
  ctx.save();
  const lineGrad = ctx.createLinearGradient(margin + 30, 0, width - margin - 30, 0);
  lineGrad.addColorStop(0, 'transparent');
  lineGrad.addColorStop(0.2, goldPrimary);
  lineGrad.addColorStop(0.5, goldLight);
  lineGrad.addColorStop(0.8, goldPrimary);
  lineGrad.addColorStop(1, 'transparent');

  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(margin + 30, footerLineY);
  ctx.lineTo(width - margin - 30, footerLineY);
  ctx.stroke();
  ctx.restore();

  // 8. High-Contrast Footer Bar
  const footerBarY = height - margin - 62;
  const footerBarHeight = 48;

  ctx.save();
  ctx.fillStyle = 'rgba(243, 186, 47, 0.08)';
  ctx.strokeStyle = 'rgba(243, 186, 47, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(margin + 30, footerBarY, cardW - 60, footerBarHeight, 14);
  ctx.fill();
  ctx.stroke();

  // Left Footer
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px "Trebuchet MS", monospace';
  ctx.fillText('⚡ GM GENERATOR  •  @generategmbot', margin + 50, footerBarY + 31);

  // Right Footer Link
  ctx.textAlign = 'right';
  ctx.fillStyle = goldLight;
  ctx.font = 'bold 18px "Trebuchet MS", monospace';
  ctx.fillText('t.me/generategmbot/app 👑', width - margin - 50, footerBarY + 31);
  ctx.restore();

  return canvas.toBuffer('image/png');
}
