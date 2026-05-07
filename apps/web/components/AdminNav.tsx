import Link from 'next/link';

const links = [
  ['Dashboard', '/admin'],
  ['Employees', '/admin/employees'],
  ['Announcements', '/admin/announcements'],
  ['Settings', '/admin/settings'],
];

export function AdminNav() {
  return (
    <nav className="mb-8 flex flex-wrap items-center gap-3">
      <Link href="/" className="mr-4 text-xl font-black text-brand-700">CelebrateBot</Link>
      {links.map(([label, href]) => (
        <Link key={href} href={href} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-500 hover:text-brand-700">
          {label}
        </Link>
      ))}
    </nav>
  );
}
