import { notFound } from 'next/navigation';
import { OnboardingForm } from '@/components/OnboardingForm';
import { prisma } from '@/lib/prisma';

export default async function OnboardPage({ params }: { params: { token: string } }) {
  const link = await prisma.onboardLink.findUnique({ where: { token: params.token } });
  if (!link) notFound();
  const expired = link.expiresAt ? link.expiresAt < new Date() : false;

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-black">Welcome to CelebrateBot</h1>
      <p className="mt-3 text-slate-600">Complete your profile so we can celebrate your milestones with the team.</p>
      <div className="mt-8">
        {link.used || expired ? (
          <div className="card"><h2 className="text-2xl font-bold">This link is no longer available.</h2><p className="mt-2 text-slate-600">Please ask an admin for a fresh onboarding link.</p></div>
        ) : (
          <OnboardingForm token={params.token} />
        )}
      </div>
    </main>
  );
}
