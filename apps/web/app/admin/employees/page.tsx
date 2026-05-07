import { GenerateLinkButton } from '@/components/GenerateLinkButton';
import { prisma } from '@/lib/prisma';

export default async function EmployeesPage({ searchParams }: { searchParams: { q?: string; department?: string } }) {
  const q = searchParams.q?.trim();
  const employees = await prisma.employee.findMany({
    where: {
      ...(q ? { OR: [{ name: { contains: q, mode: 'insensitive' } }, { email: { contains: q, mode: 'insensitive' } }] } : {}),
      ...(searchParams.department ? { department: searchParams.department } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-3xl font-black">Employees</h1><p className="mt-1 text-slate-600">Search, filter, and manage onboarded teammates.</p></div><GenerateLinkButton /></div>
      <form className="card flex flex-wrap gap-3"><input name="q" placeholder="Search name or email" defaultValue={q} /><select name="department" defaultValue={searchParams.department ?? ''}><option value="">All departments</option>{['Engineering', 'Design', 'Marketing', 'HR', 'Operations', 'Other'].map((department) => <option key={department}>{department}</option>)}</select><button>Apply</button></form>
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="py-2">Name</th><th>Email</th><th>DOB</th><th>DOJ</th><th>Department</th><th>Discord</th><th>Active</th></tr></thead><tbody>{employees.map((employee) => <tr key={employee.id} className="border-b last:border-0"><td className="py-3 font-semibold">{employee.name}<p className="text-xs font-normal text-slate-500">{employee.role}</p></td><td>{employee.email}</td><td>{employee.dob.toISOString().slice(0, 10)}</td><td>{employee.doj.toISOString().slice(0, 10)}</td><td>{employee.department ?? '—'}</td><td>{employee.discordId || employee.discordUsername ? 'Yes' : 'No'}</td><td>{employee.active ? 'Yes' : 'No'}</td></tr>)}</tbody></table>
      </div>
    </section>
  );
}
