import type { Employee } from '@prisma/client';
import sharp from 'sharp';

const SIZE = 800;

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char] ?? char);
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'CB';
}

function confetti() {
  const colors = ['#f97316', '#facc15', '#38bdf8', '#a78bfa', '#22c55e'];
  return Array.from({ length: 80 }, (_, index) => {
    const x = (index * 97) % SIZE;
    const y = (index * 53) % SIZE;
    const rotate = (index * 29) % 180;
    return `<rect x="${x}" y="${y}" width="18" height="6" rx="3" fill="${colors[index % colors.length]}" opacity="0.45" transform="rotate(${rotate} ${x} ${y})" />`;
  }).join('');
}

async function avatarDataUri(employee: Employee) {
  if (!employee.avatarUrl) return null;
  try {
    const response = await fetch(employee.avatarUrl);
    if (!response.ok) return null;
    const input = Buffer.from(await response.arrayBuffer());
    const png = await sharp(input).resize(290, 290).png().toBuffer();
    return `data:image/png;base64,${png.toString('base64')}`;
  } catch (error) {
    console.warn(`Avatar fetch failed for ${employee.name}:`, error);
    return null;
  }
}

async function generatePoster(employee: Employee, headline: string, subtitle: string) {
  const avatar = await avatarDataUri(employee);
  const safeName = escapeXml(employee.name);
  const safeHeadline = escapeXml(headline);
  const safeSubtitle = escapeXml(subtitle);
  const avatarMarkup = avatar
    ? `<defs><clipPath id="avatarClip"><circle cx="400" cy="330" r="145" /></clipPath></defs><image href="${avatar}" x="255" y="185" width="290" height="290" clip-path="url(#avatarClip)" />`
    : `<circle cx="400" cy="330" r="145" fill="url(#avatarGradient)" /><text x="400" y="355" text-anchor="middle" font-family="Arial, sans-serif" font-size="92" font-weight="800" fill="#fff">${escapeXml(initials(employee.name))}</text>`;

  const svg = `
  <svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fb923c"/><stop offset="0.52" stop-color="#ec4899"/><stop offset="1" stop-color="#7c3aed"/></linearGradient>
      <linearGradient id="avatarGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fb923c"/><stop offset="1" stop-color="#7c3aed"/></linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-opacity="0.25"/></filter>
    </defs>
    <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)" />
    ${confetti()}
    <text x="400" y="105" text-anchor="middle" font-family="Arial, sans-serif" font-size="54" font-weight="800" fill="#fff">${safeHeadline}</text>
    <g filter="url(#shadow)">${avatarMarkup}<circle cx="400" cy="330" r="150" fill="none" stroke="rgba(255,255,255,0.92)" stroke-width="10" /></g>
    <text x="400" y="545" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="800" fill="#fff">${safeName}</text>
    <text x="400" y="605" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#fff">${safeSubtitle}</text>
    <text x="42" y="748" font-family="Arial, sans-serif" font-size="22" font-weight="800" fill="#fff">CelebrateBot</text>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

export async function generateBirthdayPoster(employee: Employee): Promise<Buffer> {
  return generatePoster(employee, 'Happy Birthday!', 'Wishing you joy, success, and cake 🎂');
}

export async function generateAnniversaryPoster(employee: Employee, years: number): Promise<Buffer> {
  return generatePoster(employee, 'Happy Work Anniversary!', `${years} Year${years === 1 ? '' : 's'} with us 🎊`);
}
