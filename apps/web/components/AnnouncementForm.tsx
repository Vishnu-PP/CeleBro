'use client';

import { useState } from 'react';

export function AnnouncementForm() {
  const [status, setStatus] = useState('');

  async function submit(formData: FormData) {
    setStatus('Sending...');
    const channels = String(formData.get('channels') ?? '').split(',').map((value) => value.trim()).filter(Boolean);
    const emailList = String(formData.get('emailList') ?? '').split(',').map((value) => value.trim()).filter(Boolean);
    const payload = {
      title: formData.get('title'),
      message: formData.get('message'),
      channels,
      sendEmail: formData.get('sendEmail') === 'on',
      emailList,
      scheduledAt: formData.get('scheduledAt') || null,
    };
    const response = await fetch('/api/announce', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await response.json();
    setStatus(response.ok ? 'Announcement saved and dispatched.' : data.error ?? 'Announcement failed.');
  }

  return (
    <form action={submit} className="card grid gap-4">
      <label className="grid gap-1 font-semibold">Title<input name="title" required /></label>
      <label className="grid gap-1 font-semibold">Message<textarea name="message" required rows={6} /></label>
      <label className="grid gap-1 font-semibold">Discord channel IDs<input name="channels" placeholder="123, 456" /></label>
      <label className="grid gap-1 font-semibold">Email list<input name="emailList" type="text" placeholder="team@company.com, all@company.com" /></label>
      <label className="flex items-center gap-2 font-semibold"><input className="h-4 w-4" name="sendEmail" type="checkbox" /> Send email</label>
      <label className="grid gap-1 font-semibold">Schedule for later<input name="scheduledAt" type="datetime-local" /></label>
      <button>Send / schedule announcement</button>
      {status && <p className="rounded-lg bg-slate-100 p-3 text-sm font-semibold">{status}</p>}
    </form>
  );
}
