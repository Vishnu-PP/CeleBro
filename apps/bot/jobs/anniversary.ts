import type { Client } from 'discord.js';
import { EmbedBuilder } from 'discord.js';
import { prisma } from '../utils/prisma';
import { dateKey, isMonthDayToday, yearsSince } from '../utils/date';
import { mentionOrName, sendPosterToChannel } from '../utils/discord';
import { sendAnniversaryEmail } from '../utils/mail';
import { generateAnniversaryPoster } from '../poster/generate';

export async function runAnniversaryJob(client: Client) {
  const config = await prisma.botConfig.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } });
  const key = dateKey(config.timezone);
  const employees = (await prisma.employee.findMany({ where: { active: true } }))
    .map((employee) => ({ employee, years: yearsSince(employee.doj, config.timezone) }))
    .filter(({ employee, years }) => years > 0 && isMonthDayToday(employee.doj, config.timezone));

  for (const { employee, years } of employees) {
    const createdLog = await prisma.celebrationLog.create({ data: { employeeId: employee.id, type: 'anniversary', dateKey: key } }).catch(() => null);
    if (!createdLog) continue;
    const poster = await generateAnniversaryPoster(employee, years);
    const message = config.anniversaryTemplate.replaceAll('{name}', mentionOrName(employee)).replaceAll('{years}', String(years));
    const embed = new EmbedBuilder().setColor(0x7c3aed).setTitle('🏆 Work Anniversary!').setDescription(`${message}\n\n— From the whole team ❤️`);
    await sendPosterToChannel(client, config.anniversaryChannelId, embed, poster, `anniversary-${employee.id}.png`);
    await sendAnniversaryEmail(employee, years).catch((error) => console.error(`Anniversary email failed for ${employee.email}:`, error));
  }
}
