import { ActionRowBuilder, ChatInputCommandInteraction, ModalBuilder, PermissionFlagsBits, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { prisma } from '../utils/prisma';
import { sendAnnouncementEmail } from '../utils/mail';

export const announceCommand = new SlashCommandBuilder()
  .setName('announce')
  .setDescription('Send a CelebrateBot announcement')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function handleAnnounceCommand(interaction: ChatInputCommandInteraction) {
  const adminRoleId = process.env.DISCORD_ADMIN_ROLE_ID;
  if (adminRoleId && interaction.member && 'roles' in interaction.member && !interaction.member.roles.cache.has(adminRoleId)) {
    await interaction.reply({ content: 'You do not have permission to send announcements.', ephemeral: true });
    return;
  }
  const modal = new ModalBuilder().setCustomId('announce-create').setTitle('Send announcement');
  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId('title').setLabel('Title').setStyle(TextInputStyle.Short).setRequired(true)),
    new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId('message').setLabel('Message').setStyle(TextInputStyle.Paragraph).setRequired(true)),
    new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId('channel').setLabel('Channel ID').setStyle(TextInputStyle.Short).setRequired(false)),
    new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId('sendEmail').setLabel('Send email? yes/no').setStyle(TextInputStyle.Short).setRequired(false)),
  );
  await interaction.showModal(modal);
}

export async function handleAnnounceModal(interaction: import('discord.js').ModalSubmitInteraction) {
  const title = interaction.fields.getTextInputValue('title');
  const message = interaction.fields.getTextInputValue('message');
  const channelId = interaction.fields.getTextInputValue('channel') || interaction.channelId;
  const sendEmail = interaction.fields.getTextInputValue('sendEmail').toLowerCase().startsWith('y');
  await prisma.announcement.create({ data: { title, message, channels: [channelId], sendEmail, emailList: [], sentAt: new Date() } });
  await interaction.client.channels.fetch(channelId).then(async (channel) => {
    if (channel?.isTextBased()) await channel.send({ embeds: [{ title, description: message, color: 0xf97316 }] });
  });
  if (sendEmail) {
    const recipients = (await prisma.employee.findMany({ where: { active: true }, select: { email: true } })).map((employee) => employee.email);
    await sendAnnouncementEmail(title, message, recipients);
  }
  await interaction.reply({ content: 'Announcement sent.', ephemeral: true });
}
