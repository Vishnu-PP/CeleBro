'use client';

import type { BotConfig } from '@prisma/client';
import { useState } from 'react';

export function SettingsForm({ config }: { config: BotConfig }) {
  const [status, setStatus] = useState('');
  async function submit(formData: FormData) {
    setStatus('Saving...');
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setStatus(response.ok ? 'Settings saved.' : 'Unable to save settings.');
  }

  return (
    <form action={submit} className="card grid gap-4">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-1 font-semibold">Birthday channel ID<input name="birthdayChannelId" defaultValue={config.birthdayChannelId ?? ''} /></label>
        <label className="grid gap-1 font-semibold">Anniversary channel ID<input name="anniversaryChannelId" defaultValue={config.anniversaryChannelId ?? ''} /></label>
        <label className="grid gap-1 font-semibold">Announcement channel ID<input name="announcementChannelId" defaultValue={config.announcementChannelId ?? ''} /></label>
      </div>
      <label className="grid gap-1 font-semibold">Birthday template<textarea name="birthdayTemplate" defaultValue={config.birthdayTemplate} rows={3} /></label>
      <label className="grid gap-1 font-semibold">Anniversary template<textarea name="anniversaryTemplate" defaultValue={config.anniversaryTemplate} rows={3} /></label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 font-semibold">Send time<input name="sendTime" type="time" defaultValue={config.sendTime} /></label>
        <label className="grid gap-1 font-semibold">Timezone<input name="timezone" defaultValue={config.timezone} placeholder="Asia/Kolkata" /></label>
      </div>
      <button>Save settings</button>{status && <p className="text-sm font-semibold text-slate-600">{status}</p>}
    </form>
  );
}
