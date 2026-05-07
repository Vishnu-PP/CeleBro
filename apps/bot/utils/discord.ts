import { AttachmentBuilder, Client, EmbedBuilder, TextChannel } from 'discord.js';

export async function sendPosterToChannel(client: Client, channelId: string | null | undefined, embed: EmbedBuilder, poster: Buffer, filename: string) {
  if (!channelId) {
    console.warn('Discord channel is not configured; skipping post.');
    return;
  }
  const channel = await client.channels.fetch(channelId).catch(() => null);
  if (!channel || !(channel instanceof TextChannel)) {
    console.warn(`Discord channel ${channelId} is unavailable or is not a text channel.`);
    return;
  }
  await channel.send({ embeds: [embed.setImage(`attachment://${filename}`)], files: [new AttachmentBuilder(poster, { name: filename })] });
}

export function mentionOrName(employee: { discordId: string | null; name: string }) {
  return employee.discordId ? `<@${employee.discordId}>` : employee.name;
}
