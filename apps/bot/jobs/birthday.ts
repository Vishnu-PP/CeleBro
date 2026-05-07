import type { Client } from 'discord.js';
import { EmbedBuilder } from 'discord.js';
import { prisma } from '../utils/prisma';
import { dateKey, isMonthDayToday } from '../utils/date';
import { mentionOrName, sendPosterToChannel } from '../utils/discord';
import { sendBirthdayEmail } from '../utils/mail';
import { generateBirthdayPoster } from '../poster/generate';

export async function runBirthdayJob(client: Client) {
  const config = await prisma.botConfig.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } });
  const key = dateKey(config.timezone);
  const employees = (await prisma.employee.findMany({ where: { active: true } })).filter((employee) => isMonthDayToday(employee.dob, config.timezone));

  for (const employee of employees) {
    const createdLog = await prisma.celebrationLog.create({ data: { employeeId: employee.id, type: 'birthday', dateKey: key } }).catch(() => null);
    if (!createdLog) continue;
    const poster = await generateBirthdayPoster(employee);
    const message = config.birthdayTemplate.replaceAll('{name}', mentionOrName(employee));
    const embed = new EmbedBuilder().setColor(0xf97316).setTitle('🎉 Birthday Celebration!').setDescription(`${message}\n\n— From the whole team ❤️`);
    await sendPosterToChannel(client, config.birthdayChannelId, embed, poster, `birthday-${employee.id}.png`);
    await sendBirthdayEmail(employee).catch((error) => console.error(`Birthday email failed for ${employee.email}:`, error));
  }
}
