import Link from 'next/link';
import { GenerateLinkButton } from '@/components/GenerateLinkButton';
import { daysUntilMonthDay } from '@/lib/date';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const employees = await prisma.employee.findMany({ where: { active: true }, orderBy: { name: 'asc' } });
  const today = new Date();
  const birthdaysThisMonth = employees.filter((employee) => employee.dob.getUTCMonth() === today.getUTCMonth()).length;
  const anniversariesThisMonth = employees.filter((employee) => employee.doj.getUTCMonth() === today.getUTCMonth() && employee.doj.getUTCFullYear() < today.getUTCFullYear()).length;
  const upcoming = employees.flatMap((employee) => [
    { employee, type: 'Birthday', inDays: daysUntilMonthDay(employee.dob, today) },
    { employee, type: 'Anniversary', inDays: daysUntilMonthDay(employee.doj, today) },
  ]).filter((item) => item.inDays <= 7).sort((a, b) => a.inDays - b.inDays);

  return (
    <section className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card"><p className="text-sm font-semibold text-slate-500">Total employees</p><p className="mt-2 text-4xl font-black">{employees.length}</p></div>
        <div className="card"><p className="text-sm font-semibold text-slate-500">Birthdays this month</p><p className="mt-2 text-4xl font-black">{birthdaysThisMonth}</p></div>
        <div className="card"><p className="text-sm font-semibold text-slate-500">Anniversaries this month</p><p className="mt-2 text-4xl font-black">{anniversariesThisMonth}</p></div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card">
          <h2 className="text-2xl font-bold">Upcoming celebrations</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="py-2">Name</th><th>Type</th><th>When</th></tr></thead><tbody>{upcoming.map((item) => <tr key={`${item.employee.id}-${item.type}`} className="border-b last:border-0"><td className="py-3 font-semibold">{item.employee.name}</td><td>{item.type}</td><td>{item.inDays === 0 ? 'Today' : `In ${item.inDays} day(s)`}</td></tr>)}</tbody></table>
          </div>
        </div>
        <div className="card grid content-start gap-4">
          <h2 className="text-2xl font-bold">Quick actions</h2>
          <GenerateLinkButton />
          <Link className="button text-center" href="/admin/announcements">Send announcement</Link>
        </div>
      </div>
    </section>
  );
}
