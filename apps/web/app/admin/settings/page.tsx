import { SettingsForm } from '@/components/SettingsForm';
import { prisma } from '@/lib/prisma';

export default async function SettingsPage() {
  const config = await prisma.botConfig.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } });
  return <section><h1 className="mb-4 text-3xl font-black">Settings</h1><SettingsForm config={config} /></section>;
}
