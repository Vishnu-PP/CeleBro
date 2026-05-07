'use client';

import { useState } from 'react';

const departments = ['Engineering', 'Design', 'Marketing', 'HR', 'Operations', 'Other'];

export function OnboardingForm({ token }: { token: string }) {
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message?: string }>({ type: 'idle' });

  async function submit(formData: FormData) {
    setStatus({ type: 'loading', message: 'Submitting profile...' });
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch('/api/onboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, token }),
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus({ type: 'error', message: data.error ?? 'Unable to submit onboarding form.' });
      return;
    }
    setStatus({ type: 'success', message: 'Your CelebrateBot profile is ready. Thank you!' });
  }

  if (status.type === 'success') {
    return <div className="card text-center"><h2 className="text-2xl font-bold">All set 🎉</h2><p className="mt-2 text-slate-600">{status.message}</p></div>;
  }

  return (
    <form action={submit} className="card grid gap-4">
      <label className="grid gap-1 font-semibold">Full name<input name="name" required placeholder="Ada Lovelace" /></label>
      <label className="grid gap-1 font-semibold">Email address<input name="email" type="email" required placeholder="ada@company.com" /></label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 font-semibold">Date of birth<input name="dob" type="date" required /></label>
        <label className="grid gap-1 font-semibold">Date of joining<input name="doj" type="date" required /></label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 font-semibold">Department<select name="department" defaultValue=""><option value="">Select department</option>{departments.map((department) => <option key={department}>{department}</option>)}</select></label>
        <label className="grid gap-1 font-semibold">Role / job title<input name="role" placeholder="Product Engineer" /></label>
      </div>
      <label className="grid gap-1 font-semibold">Discord username<input name="discordUsername" placeholder="ada.lovelace" /></label>
      <label className="grid gap-1 font-semibold">Preferred language<select name="preferredLang" defaultValue="en"><option value="en">English</option><option value="ml">Malayalam</option><option value="both">Both</option></select></label>
      {status.type === 'error' && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{status.message}</p>}
      <button disabled={status.type === 'loading'}>{status.type === 'loading' ? 'Submitting...' : 'Submit profile'}</button>
    </form>
  );
}
