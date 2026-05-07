export async function postDiscordAnnouncement(channelId: string, title: string, message: string) {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) throw new Error('DISCORD_BOT_TOKEN is not configured.');

  const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ embeds: [{ title, description: message, color: 0xf97316 }] }),
  });

  if (!response.ok) {
    throw new Error(`Discord API failed with ${response.status}: ${await response.text()}`);
  }
}
