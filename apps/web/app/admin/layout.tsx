import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { AdminNav } from '@/components/AdminNav';
import { authOptions } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const authConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.NEXTAUTH_SECRET);
  if (authConfigured && !session) redirect('/api/auth/signin');

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-8">
      <AdminNav />
      {!authConfigured && <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">Google OAuth is not configured, so admin pages are open in development.</div>}
      {children}
    </main>
  );
}
