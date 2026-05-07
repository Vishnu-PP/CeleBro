import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
      <p className="mb-4 rounded-full bg-brand-50 px-4 py-2 font-semibold text-brand-700">Discord + Gmail celebrations</p>
      <h1 className="text-5xl font-black tracking-tight text-slate-950 md:text-7xl">Celebrate teammates automatically.</h1>
      <p className="mt-6 max-w-2xl text-lg text-slate-600">CelebrateBot onboards employees, generates custom posters, posts birthday and anniversary wishes to Discord, and sends warm Gmail messages every morning.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link className="button" href="/admin">Open admin dashboard</Link>
        <a className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm hover:border-brand-500" href="https://discord.com/developers/applications">Create Discord app</a>
      </div>
    </main>
  );
}
