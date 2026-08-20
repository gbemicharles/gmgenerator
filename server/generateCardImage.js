import { createCanvas } from '@napi-rs/canvas';

/**
 * Renders a standard, ultra-premium 1080x1080 Square GM Photo Card.
 * Clean, bold, centered Web3 design without mascot artwork or awkward empty spaces.
 * 
 * @param {string} quoteText - The GM quote string
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

  // 1. Sleek Cyber Dark Gradient Background
  const bgGrad = ctx.createLinearGradient(0, 0, size, size);
  bgGrad.addColorStop(0, '#0A0E17');
  bgGrad.addColorStop(0.5, '#111726');
  bgGrad.addColorStop(1, '#060910');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // 2. Subtle Radial Background Glow (Centered behind text)
  ctx.save();
  const radialGlow = ctx.createRadialGradient(size / 2, size / 2, 50, size / 2, size / 2, 480);
  radialGlow.addColorStop(0, `${accentColor}1C`);
  radialGlow.addColorStop(0.7, 'rgba(0, 136, 204, 0.08)');
  radialGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = radialGlow;
  ctx.fillRect(0, 0, size, size);
  ctx.restore();

  // 3. Card Container Box (Padding 48px around)
  const margin = 48;
  const cardSize = size - margin * 2;
  const borderRadius = 32;

  // Glass Container Fill
  ctx.save();
  ctx.fillStyle = 'rgba(15, 22, 35, 0.9)';
  ctx.beginPath();
  ctx.roundRect(margin, margin, cardSize, cardSize, borderRadius);
  ctx.fill();

  // Glass Border with Gradient Accent
  const borderGrad = ctx.createLinearGradient(margin, margin, size - margin, size - margin);
  borderGrad.addColorStop(0, `${accentColor}CC`);
  borderGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
  borderGrad.addColorStop(1, `${accentColor}40`);

  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  // 4. Clean Header Row
  const headerY = margin + 50;

  // Left Header Brand Pill: "☀️ GM GENERATOR"
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(margin + 40, headerY, 230, 44, 22);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#F3BA2F';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('☀️', margin + 56, headerY + 28);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('GM GENERATOR', margin + 86, headerY + 28);
  ctx.restore();

  // Right Header Category Pill: "🔥 MOTIVATIONAL"
  ctx.save();
  ctx.font = 'bold 16px monospace';
  const pillText = `${categoryIcon} ${categoryName}`;
  const pillWidth = ctx.measureText(pillText).width + 36;
  const pillX = size - margin - 40 - pillWidth;

  ctx.fillStyle = `${accentColor}20`;
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(pillX, headerY, pillWidth, 44, 22);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = accentColor;
  ctx.fillText(pillText, pillX + 18, headerY + 28);
  ctx.restore();

  // 5. Main Hero Centered Quote Text Block
  const cleanQuote = quoteText.replace(/^["“]|["”]$/g, '').trim();
  const fullQuote = `“${cleanQuote}”`;

  // Dynamic Typography Scaling to maximize space & readability
  let fontSize = 54;
  let lineHeight = 72;

  if (cleanQuote.length > 150) {
    fontSize = 38;
    lineHeight = 54;
  } else if (cleanQuote.length > 100) {
    fontSize = 44;
    lineHeight = 62;
  } else if (cleanQuote.length > 60) {
    fontSize = 48;
    lineHeight = 66;
  }

  ctx.font = `900 ${fontSize}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFFFFF';

  const maxTextWidth = cardSize - 120; // Utilizes full width with comfortable margins
  const words = fullQuote.split(' ');
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

  // Perfect Vertical Centering for Quote Block
  const totalTextHeight = lines.length * lineHeight;
  const textAreaTop = margin + 110;
  const textAreaBottom = size - margin - 110;
  const textAreaCenterY = (textAreaTop + textAreaBottom) / 2;
  let startY = textAreaCenterY - (totalTextHeight / 2) + (fontSize * 0.75);

  for (let j = 0; j < lines.length; j++) {
    ctx.fillText(lines[j], size / 2, startY + (j * lineHeight));
  }

  // 6. Clean Divider Line
  const footerLineY = size - margin - 85;
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(margin + 40, footerLineY);
  ctx.lineTo(size - margin - 40, footerLineY);
  ctx.stroke();
  ctx.restore();

  // 7. Standard Footer Bar (Clean, uncluttered, left/right aligned)
  const footerY = size - margin - 42;

  // Left Footer: @generategmbot
  ctx.textAlign = 'left';
  ctx.fillStyle = '#94A3B8';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('GM GENERATOR  •  @generategmbot', margin + 40, footerY);

  // Right Footer: t.me/generategmbot/app
  ctx.textAlign = 'right';
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 16px monospace';
  ctx.fillText('t.me/generategmbot/app', size - margin - 40, footerY);

  return canvas.toBuffer('image/png');
}
