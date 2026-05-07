import 'dotenv/config';
import { Client, Events, GatewayIntentBits, REST, Routes } from 'discord.js';
import { announceCommand, handleAnnounceCommand, handleAnnounceModal } from './commands/announce';
import { handleProfileCommand, handleProfileModal, profileCommand } from './commands/profile';
import { handleUpcomingCommand, upcomingCommand } from './commands/upcoming';
import { scheduleCelebrationJobs } from './jobs/scheduler';
import { prisma } from './utils/prisma';

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;

if (!token || !clientId || !guildId) {
  throw new Error('DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID, and DISCORD_GUILD_ID are required.');
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages],
});

async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(token!);
  await rest.put(Routes.applicationGuildCommands(clientId!, guildId!), {
    body: [profileCommand, upcomingCommand, announceCommand].map((command) => command.toJSON()),
  });
  console.log('Registered CelebrateBot slash commands.');
}

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`CelebrateBot logged in as ${readyClient.user.tag}.`);
  await registerCommands();
  await scheduleCelebrationJobs(client);
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === 'profile') await handleProfileCommand(interaction);
      if (interaction.commandName === 'upcoming') await handleUpcomingCommand(interaction);
      if (interaction.commandName === 'announce') await handleAnnounceCommand(interaction);
      return;
    }
    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'profile-setup') await handleProfileModal(interaction);
      if (interaction.customId === 'announce-create') await handleAnnounceModal(interaction);
    }
  } catch (error) {
    console.error('Interaction failed:', error);
    if (interaction.isRepliable() && !interaction.replied) await interaction.reply({ content: 'CelebrateBot hit an error. Please try again later.', ephemeral: true });
  }
});

client.on(Events.GuildMemberAdd, async (member) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const link = await prisma.onboardLink.create({ data: { expiresAt } });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  await member.send(`Welcome to the server! Please fill out your profile here: ${baseUrl}/onboard/${link.token}`).catch((error) => {
    console.warn(`Could not DM onboarding link to ${member.user.tag}:`, error);
  });
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  client.destroy();
  process.exit(0);
});

void client.login(token);
