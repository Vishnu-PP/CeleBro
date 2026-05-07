import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const onboardSchema = z.object({
  token: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  dob: z.string().min(1),
  doj: z.string().min(1),
  department: z.string().optional(),
  role: z.string().optional(),
  discordUsername: z.string().optional(),
  preferredLang: z.enum(['en', 'ml', 'both']).default('en'),
});

export async function POST(request: Request) {
  const parsed = onboardSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid onboarding form data.' }, { status: 400 });

  const dob = new Date(parsed.data.dob);
  const doj = new Date(parsed.data.doj);
  const now = new Date();
  if (Number.isNaN(dob.getTime()) || dob >= now) return NextResponse.json({ error: 'DOB must be in the past.' }, { status: 400 });
  if (Number.isNaN(doj.getTime()) || doj > now) return NextResponse.json({ error: 'DOJ must not be in the future.' }, { status: 400 });

  const link = await prisma.onboardLink.findUnique({ where: { token: parsed.data.token } });
  if (!link || link.used || (link.expiresAt && link.expiresAt < now)) return NextResponse.json({ error: 'Onboarding link is invalid or expired.' }, { status: 400 });

  try {
    const employee = await prisma.$transaction(async (tx) => {
      const created = await tx.employee.create({
        data: {
          name: parsed.data.name,
          email: parsed.data.email.toLowerCase(),
          dob,
          doj,
          department: parsed.data.department || null,
          role: parsed.data.role || null,
          discordUsername: parsed.data.discordUsername || null,
          preferredLang: parsed.data.preferredLang,
        },
      });
      await tx.onboardLink.update({ where: { id: link.id }, data: { used: true, usedBy: created.id } });
      return created;
    });
    return NextResponse.json({ employeeId: employee.id });
  } catch (error) {
    return NextResponse.json({ error: 'Email address is already registered.' }, { status: 409 });
  }
}
