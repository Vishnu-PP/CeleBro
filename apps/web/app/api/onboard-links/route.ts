import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const link = await prisma.onboardLink.create({ data: { expiresAt } });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  return NextResponse.json({ token: link.token, url: `${baseUrl}/onboard/${link.token}`, expiresAt });
}
