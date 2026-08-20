import { createCanvas } from '@napi-rs/canvas';

/**
 * Dynamically renders an exact 1:1 1000x1000 Square GM Card Image 
 * matching the user's exact uploaded design example.
 * 
 * @param {string} quoteText - e.g. "GM. Watching green candles while the rest of the house sleeps peacefully."
 * @param {object} categoryObj - { name: '3AM GM', icon: '🌙', color: '#38BDF8' }
 * @returns {Promise<Buffer>} PNG Image Buffer
 */
export async function renderGMCardImage(quoteText, categoryObj = { name: '3AM GM', icon: '🌙', color: '#38BDF8' }) {
  const size = 1000;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  const borderColor = categoryObj.color || '#38BDF8';
  const categoryIcon = categoryObj.icon || '☀️';
  const categoryName = (categoryObj.name || 'DAILY GM').toUpperCase();

  // 1. Dark Midnight Blue Gradient Background
  const bgGrad = ctx.createLinearGradient(0, 0, size, size);
  bgGrad.addColorStop(0, '#0B1528');
  bgGrad.addColorStop(0.5, '#070D1A');
  bgGrad.addColorStop(1, '#03060C');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // 2. Ambient Radial Background Glow
  ctx.save();
  ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
  ctx.beginPath();
  ctx.arc(500, 500, 450, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3. Rounded Card Outer Frame with Accent Glow Border
  const margin = 35;
  const cardSize = size - margin * 2;
  const borderRadius = 32;

  ctx.save();
  ctx.fillStyle = 'rgba(11, 21, 40, 0.95)';
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.roundRect(margin, margin, cardSize, cardSize, borderRadius);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // 4. Header Row
  const headerY = margin + 75;

  // Left side: ☀️ GM
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 48px sans-serif';
  ctx.fillText('☀️  GM', margin + 50, headerY);

  // Right side: Category Badge Pill (e.g. 🌙 3AM GM)
  ctx.font = 'bold 22px monospace';
  const pillText = `${categoryIcon} ${categoryName}`;
  const pillWidth = ctx.measureText(pillText).width + 44;
  const pillHeight = 48;
  const pillX = size - margin - 50 - pillWidth;
  const pillY = margin + 45;

  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 24);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#CBD5E1';
  ctx.fillText(pillText, pillX + 22, pillY + 32);
  ctx.restore();

  // 5. Center Centered Quote Text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 46px sans-serif';
  ctx.textAlign = 'center';

  const maxTextWidth = 780;
  const centerX = size / 2;

  // Clean quote text
  const cleanQuote = quoteText.replace(/^["“]|["”]$/g, '').trim();
  const formattedQuote = `“${cleanQuote}”`;

  // Calculate word wrapping
  const words = formattedQuote.split(' ');
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
  if (currentLine) {
    lines.push(currentLine);
  }

  // Draw centered text lines
  const lineHeight = 66;
  const totalTextHeight = lines.length * lineHeight;
  let startY = (size / 2) - (totalTextHeight / 2) + 35;

  for (let j = 0; j < lines.length; j++) {
    ctx.fillText(lines[j], centerX, startY + (j * lineHeight));
  }

  // 6. Horizontal Thin Divider Line above footer
  const footerLineY = size - margin - 120;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(margin + 50, footerLineY);
  ctx.lineTo(size - margin - 50, footerLineY);
  ctx.stroke();

  // 7. Footer Watermark Row
  ctx.textAlign = 'left';
  ctx.fillStyle = '#64748B';
  ctx.font = 'bold 20px monospace';
  const footerText = '✨  GM GENERATOR   •   @generategmbot   •   POWERED BY PEDRO TEAM 🦝';
  ctx.fillText(footerText, margin + 50, size - margin - 60);

  return canvas.toBuffer('image/png');
}
