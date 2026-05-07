import type { Client } from 'discord.js';
import cron from 'node-cron';
import { runAnniversaryJob } from './anniversary';
import { runBirthdayJob } from './birthday';
import { prisma } from '../utils/prisma';

export async function scheduleCelebrationJobs(client: Client) {
  const config = await prisma.botConfig.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } });
  const [hour, minute] = config.sendTime.split(':').map(Number);
  const expression = `${minute} ${hour} * * *`;
  cron.schedule(expression, async () => {
    await runBirthdayJob(client);
    await runAnniversaryJob(client);
  }, { timezone: config.timezone });
  console.log(`Scheduled celebration jobs at ${config.sendTime} (${config.timezone}).`);
}
