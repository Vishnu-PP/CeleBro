import { AnnouncementForm } from '@/components/AnnouncementForm';
import { prisma } from '@/lib/prisma';

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: 'desc' }, take: 20 });
  return (
    <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <div><h1 className="mb-4 text-3xl font-black">Announcements</h1><AnnouncementForm /></div>
      <div className="card"><h2 className="text-2xl font-bold">History</h2><div className="mt-4 grid gap-3">{announcements.map((announcement) => <article key={announcement.id} className="rounded-xl border border-slate-200 p-4"><h3 className="font-bold">{announcement.title}</h3><p className="mt-1 line-clamp-2 text-sm text-slate-600">{announcement.message}</p><p className="mt-2 text-xs text-slate-500">Channels: {announcement.channels.length} · Email: {announcement.sendEmail ? 'yes' : 'no'} · Sent: {announcement.sentAt ? announcement.sentAt.toISOString() : 'scheduled/draft'}</p></article>)}</div></div>
    </section>
  );
}
