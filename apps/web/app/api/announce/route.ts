import { NextResponse } from 'next/server';
import { z } from 'zod';
import { postDiscordAnnouncement } from '@/lib/discord';
import { sendAnnouncementEmail } from '@/lib/mail';
import { prisma } from '@/lib/prisma';

const announceSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  channels: z.array(z.string()).default([]),
  sendEmail: z.boolean().default(false),
  emailList: z.array(z.string().email()).default([]),
  scheduledAt: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  const parsed = announceSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid announcement data.' }, { status: 400 });
  const scheduledAt = parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : null;
  const sendNow = !scheduledAt || scheduledAt <= new Date();
  const announcement = await prisma.announcement.create({ data: { ...parsed.data, scheduledAt, sentAt: sendNow ? new Date() : null } });

  if (sendNow) {
    await Promise.allSettled(parsed.data.channels.map((channelId) => postDiscordAnnouncement(channelId, parsed.data.title, parsed.data.message)));
    if (parsed.data.sendEmail) {
      const recipients = parsed.data.emailList.length > 0 ? parsed.data.emailList : (await prisma.employee.findMany({ where: { active: true }, select: { email: true } })).map((employee) => employee.email);
      await sendAnnouncementEmail(parsed.data.title, parsed.data.message, recipients);
    }
  }

  return NextResponse.json(announcement, { status: 201 });
}
