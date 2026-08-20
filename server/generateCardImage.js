import { createCanvas } from '@napi-rs/canvas';

/**
 * Canva-Grade Professional Gold & Black Web3 GM Photo Card Image Generator.
 * Features 3D double glass bevels, metallic gold gradient typography,
 * geometric mesh lines, sparkle accents, and high-impact mobile legibility.
 * 
 * @param {string} quoteText - GM quote string
 * @param {object} categoryObj - { name: 'MOTIVATIONAL', icon: '👑', color: '#F5B800' }
 * @returns {Promise<Buffer>} PNG Image Buffer
 */
export async function renderGMCardImage(quoteText, categoryObj = { name: 'MOTIVATIONAL', icon: '👑', color: '#F5B800' }) {
  const size = 1080;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Canva Gold Color Palette
  const goldLight = '#FFE899';
  const goldMain = '#F5B800';
  const goldDark = '#B8860B';

  // 1. Deep Obsidian Black Background
  ctx.fillStyle = '#050507';
  ctx.fillRect(0, 0, size, size);

  // 2. Canva Radial Gold Ambient Light Beams
  ctx.save();
  const centerGlow = ctx.createRadialGradient(size / 2, size / 2, 50, size / 2, size / 2, 540);
  centerGlow.addColorStop(0, 'rgba(245, 184, 0, 0.28)');
  centerGlow.addColorStop(0.5, 'rgba(184, 134, 11, 0.10)');
  centerGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = centerGlow;
  ctx.fillRect(0, 0, size, size);

  const topGlow = ctx.createRadialGradient(200, 180, 20, 200, 180, 480);
  topGlow.addColorStop(0, 'rgba(255, 232, 153, 0.25)');
  topGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = topGlow;
  ctx.fillRect(0, 0, size, size);
  ctx.restore();

  // 3. Canva Geometric Mesh / Wireframe Pattern Lines
  ctx.save();
  ctx.strokeStyle = 'rgba(245, 184, 0, 0.04)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < size; i += 70) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(size, size - i);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(size - i, size);
    ctx.stroke();
  }
  ctx.restore();

  // 4. Floating Canva Sparkle Graphics (✨ ✦ 👑 💎)
  ctx.save();
  const sparkles = [
    { x: 100, y: 130, char: '✦', size: 24, opacity: 0.5 },
    { x: 970, y: 150, char: '✦', size: 28, opacity: 0.5 },
    { x: 120, y: 960, char: '✦', size: 26, opacity: 0.5 },
    { x: 960, y: 940, char: '✦', size: 30, opacity: 0.5 },
    { x: 540, y: 85, char: '👑', size: 32, opacity: 0.8 }
  ];
  for (const s of sparkles) {
    ctx.fillStyle = `rgba(255, 232, 153, ${s.opacity})`;
    ctx.font = `${s.size}px sans-serif`;
    ctx.fillText(s.char, s.x, s.y);
  }
  ctx.restore();

  // 5. 3D Beveled Canva Card Container (Double Layer Glass)
  const margin = 44;
  const cardSize = size - margin * 2;
  const borderRadius = 42;

  // Layer A: Drop Shadow & Ambient Glow
  ctx.save();
  ctx.shadowColor = 'rgba(245, 184, 0, 0.5)';
  ctx.shadowBlur = 50;
  ctx.shadowOffsetY = 16;

  ctx.fillStyle = 'rgba(12, 11, 10, 0.95)';
  ctx.beginPath();
  ctx.roundRect(margin, margin, cardSize, cardSize, borderRadius);
  ctx.fill();
  ctx.restore();

  // Layer B: Inner Metallic Gold Gradient Border
  ctx.save();
  const goldBorderGrad = ctx.createLinearGradient(margin, margin, size - margin, size - margin);
  goldBorderGrad.addColorStop(0, goldLight);
  goldBorderGrad.addColorStop(0.3, '#FFFFFF');
  goldBorderGrad.addColorStop(0.7, goldMain);
  goldBorderGrad.addColorStop(1, goldDark);

  ctx.strokeStyle = goldBorderGrad;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.roundRect(margin, margin, cardSize, cardSize, borderRadius);
  ctx.stroke();

  // Layer C: Subtle Inset Gold Border Line
  ctx.strokeStyle = 'rgba(255, 232, 153, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(margin + 12, margin + 12, cardSize - 24, cardSize - 24, borderRadius - 8);
  ctx.stroke();
  ctx.restore();

  // 6. Header Bar (Canva Style Pill Badges)
  const headerY = margin + 45;
  const headerHeight = 56;

  // Left Brand Pill: "☀️ GM GENERATOR"
  ctx.save();
  const brandGrad = ctx.createLinearGradient(margin + 36, headerY, margin + 316, headerY + headerHeight);
  brandGrad.addColorStop(0, 'rgba(245, 184, 0, 0.25)');
  brandGrad.addColorStop(1, 'rgba(15, 13, 10, 0.8)');

  ctx.fillStyle = brandGrad;
  ctx.strokeStyle = 'rgba(255, 232, 153, 0.45)';
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

  // Right Category Badge Pill: "👑 MOTIVATIONAL"
  ctx.save();
  const categoryName = (categoryObj.name || 'DAILY GM').toUpperCase();
  const categoryIcon = categoryObj.icon || '👑';
  ctx.font = 'bold 20px "Trebuchet MS", monospace';
  const pillText = `${categoryIcon} ${categoryName}`;
  const pillWidth = ctx.measureText(pillText).width + 48;
  const pillX = size - margin - 36 - pillWidth;

  const catGrad = ctx.createLinearGradient(pillX, headerY, pillX + pillWidth, headerY + headerHeight);
  catGrad.addColorStop(0, 'rgba(245, 184, 0, 0.35)');
  catGrad.addColorStop(1, 'rgba(184, 134, 11, 0.20)');

  ctx.fillStyle = catGrad;
  ctx.strokeStyle = goldMain;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(pillX, headerY, pillWidth, headerHeight, 28);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = goldLight;
  ctx.shadowColor = goldMain;
  ctx.shadowBlur = 12;
  ctx.fillText(pillText, pillX + 24, headerY + 37);
  ctx.restore();

  // 7. Background Giant Watermark Quote Mark (" “ ")
  ctx.save();
  ctx.fillStyle = 'rgba(245, 184, 0, 0.14)';
  ctx.font = '900 240px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('“', size / 2, size / 2 - 30);
  ctx.restore();

  // 8. Canva-Grade Hero Quote Typography (Metallic Gold Gradient & Crisp Drop Shadow)
  const cleanQuote = quoteText.replace(/^["“]|["”]$/g, '').trim();

  let fontSize = 72;
  let lineHeight = 94;

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

  const totalTextHeight = lines.length * lineHeight;
  const textAreaCenterY = size / 2 + 15;
  let startY = textAreaCenterY - (totalTextHeight / 2) + (fontSize * 0.7);

  // Metallic Gold Gradient Text Fill
  const textGrad = ctx.createLinearGradient(0, startY - fontSize, 0, startY + totalTextHeight);
  textGrad.addColorStop(0, '#FFFFFF');
  textGrad.addColorStop(0.35, '#FFF8E0');
  textGrad.addColorStop(0.80, goldLight);
  textGrad.addColorStop(1, goldMain);

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 28;
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

  // 9. Metallic Gold Beveled Divider Line
  const footerLineY = size - margin - 95;
  ctx.save();
  const lineGrad = ctx.createLinearGradient(margin + 36, 0, size - margin - 36, 0);
  lineGrad.addColorStop(0, 'transparent');
  lineGrad.addColorStop(0.2, goldMain);
  lineGrad.addColorStop(0.5, '#FFFFFF');
  lineGrad.addColorStop(0.8, goldMain);
  lineGrad.addColorStop(1, 'transparent');

  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(margin + 36, footerLineY);
  ctx.lineTo(size - margin - 36, footerLineY);
  ctx.stroke();
  ctx.restore();

  // 10. Canva-Grade Glass Footer Bar
  const footerBarY = size - margin - 80;
  const footerBarHeight = 56;

  ctx.save();
  ctx.fillStyle = 'rgba(245, 184, 0, 0.08)';
  ctx.strokeStyle = 'rgba(255, 232, 153, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(margin + 36, footerBarY, cardSize - 72, footerBarHeight, 16);
  ctx.fill();
  ctx.stroke();

  // Left Footer
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
