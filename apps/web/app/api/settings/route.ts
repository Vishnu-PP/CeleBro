import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const settingsSchema = z.object({
  birthdayChannelId: z.string().optional(),
  anniversaryChannelId: z.string().optional(),
  announcementChannelId: z.string().optional(),
  birthdayTemplate: z.string().min(1),
  anniversaryTemplate: z.string().min(1),
  sendTime: z.string().regex(/^\d{2}:\d{2}$/),
  timezone: z.string().min(1),
});

export async function GET() {
  const config = await prisma.botConfig.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } });
  return NextResponse.json(config);
}

export async function PUT(request: Request) {
  const parsed = settingsSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid settings.' }, { status: 400 });
  const config = await prisma.botConfig.upsert({ where: { id: 'default' }, create: { id: 'default', ...parsed.data }, update: parsed.data });
  return NextResponse.json(config);
}
