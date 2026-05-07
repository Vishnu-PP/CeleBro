import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const employeeSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  dob: z.string(),
  doj: z.string(),
  department: z.string().optional(),
  role: z.string().optional(),
  discordId: z.string().optional(),
  discordUsername: z.string().optional(),
  active: z.boolean().default(true),
});

export async function GET() {
  const employees = await prisma.employee.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(employees);
}

export async function POST(request: Request) {
  const parsed = employeeSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid employee data.' }, { status: 400 });
  const employee = await prisma.employee.create({ data: { ...parsed.data, dob: new Date(parsed.data.dob), doj: new Date(parsed.data.doj), email: parsed.data.email.toLowerCase() } });
  return NextResponse.json(employee, { status: 201 });
}
