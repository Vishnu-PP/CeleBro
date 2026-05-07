import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { prisma } from '../utils/prisma';
import { daysUntilMonthDay, yearsSince } from '../utils/date';

export const upcomingCommand = new SlashCommandBuilder().setName('upcoming').setDescription('Show birthdays and anniversaries in the next 30 days');

export async function handleUpcomingCommand(interaction: ChatInputCommandInteraction) {
  const config = await prisma.botConfig.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } });
  const employees = await prisma.employee.findMany({ where: { active: true } });
  const items = employees.flatMap((employee) => [
    { employee, label: '🎂 Birthday', days: daysUntilMonthDay(employee.dob, config.timezone) },
    { employee, label: `🏆 ${yearsSince(employee.doj, config.timezone) + 1} year anniversary`, days: daysUntilMonthDay(employee.doj, config.timezone) },
  ]).filter((item) => item.days <= 30).sort((a, b) => a.days - b.days).slice(0, 15);

  const embed = new EmbedBuilder().setColor(0xf97316).setTitle('Upcoming celebrations').setDescription(items.length ? items.map((item) => `**${item.employee.name}** — ${item.label} — ${item.days === 0 ? 'today' : `in ${item.days} day(s)`}`).join('\n') : 'No celebrations in the next 30 days.');
  await interaction.reply({ embeds: [embed], ephemeral: true });
}
