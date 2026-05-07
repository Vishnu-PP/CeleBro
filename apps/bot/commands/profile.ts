import { ActionRowBuilder, ChatInputCommandInteraction, EmbedBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle, User } from 'discord.js';
import { prisma } from '../utils/prisma';

function parseDate(value: string) {
  const [day, month, year] = value.split('/').map(Number);
  if (!day || !month || !year) throw new Error('Use DD/MM/YYYY format.');
  return new Date(Date.UTC(year, month - 1, day));
}

export const profileCommand = new SlashCommandBuilder()
  .setName('profile')
  .setDescription('Manage CelebrateBot employee profiles')
  .addSubcommand((subcommand) => subcommand.setName('setup').setDescription('Create or update your profile'))
  .addSubcommand((subcommand) => subcommand.setName('view').setDescription('View a profile card').addUserOption((option) => option.setName('user').setDescription('User to view').setRequired(false)));

export async function handleProfileCommand(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();
  if (subcommand === 'setup') {
    const modal = new ModalBuilder().setCustomId('profile-setup').setTitle('Set up CelebrateBot profile');
    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId('name').setLabel('Full Name').setStyle(TextInputStyle.Short).setRequired(true)),
      new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId('email').setLabel('Email').setStyle(TextInputStyle.Short).setRequired(true)),
      new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId('dob').setLabel('DOB (DD/MM/YYYY)').setStyle(TextInputStyle.Short).setRequired(true)),
      new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId('doj').setLabel('DOJ (DD/MM/YYYY)').setStyle(TextInputStyle.Short).setRequired(true)),
      new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId('department').setLabel('Department').setStyle(TextInputStyle.Short).setRequired(false)),
    );
    await interaction.showModal(modal);
    return;
  }

  const user = interaction.options.getUser('user') ?? interaction.user;
  await showProfile(interaction, user);
}

export async function handleProfileModal(interaction: import('discord.js').ModalSubmitInteraction) {
  try {
    const employee = await prisma.employee.upsert({
      where: { email: interaction.fields.getTextInputValue('email').toLowerCase() },
      update: {
        name: interaction.fields.getTextInputValue('name'),
        dob: parseDate(interaction.fields.getTextInputValue('dob')),
        doj: parseDate(interaction.fields.getTextInputValue('doj')),
        department: interaction.fields.getTextInputValue('department') || null,
        discordId: interaction.user.id,
        discordUsername: interaction.user.username,
        avatarUrl: interaction.user.displayAvatarURL({ extension: 'png', size: 512 }),
      },
      create: {
        name: interaction.fields.getTextInputValue('name'),
        email: interaction.fields.getTextInputValue('email').toLowerCase(),
        dob: parseDate(interaction.fields.getTextInputValue('dob')),
        doj: parseDate(interaction.fields.getTextInputValue('doj')),
        department: interaction.fields.getTextInputValue('department') || null,
        discordId: interaction.user.id,
        discordUsername: interaction.user.username,
        avatarUrl: interaction.user.displayAvatarURL({ extension: 'png', size: 512 }),
      },
    });
    await interaction.reply({ content: `Profile saved for ${employee.name}.`, ephemeral: true });
  } catch (error) {
    await interaction.reply({ content: `Could not save profile: ${error instanceof Error ? error.message : 'unknown error'}`, ephemeral: true });
  }
}

async function showProfile(interaction: ChatInputCommandInteraction, user: User) {
  const employee = await prisma.employee.findFirst({ where: { discordId: user.id } });
  if (!employee) {
    await interaction.reply({ content: 'No CelebrateBot profile found for that user.', ephemeral: true });
    return;
  }
  const embed = new EmbedBuilder()
    .setColor(0xf97316)
    .setTitle(`${employee.name}'s profile`)
    .setThumbnail(employee.avatarUrl ?? user.displayAvatarURL())
    .addFields(
      { name: 'Email', value: employee.email, inline: true },
      { name: 'Department', value: employee.department ?? '—', inline: true },
      { name: 'Role', value: employee.role ?? '—', inline: true },
      { name: 'Birthday', value: employee.dob.toISOString().slice(0, 10), inline: true },
      { name: 'Joined', value: employee.doj.toISOString().slice(0, 10), inline: true },
    );
  await interaction.reply({ embeds: [embed], ephemeral: true });
}
