'use client';

import { useState } from 'react';

export function GenerateLinkButton() {
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    const response = await fetch('/api/onboard-links', { method: 'POST' });
    const data = await response.json();
    setLoading(false);
    if (response.ok) {
      setLink(data.url);
      await navigator.clipboard?.writeText(data.url).catch(() => undefined);
    }
  }

  return (
    <div className="grid gap-3">
      <button onClick={generate} disabled={loading}>{loading ? 'Generating...' : 'Generate onboarding link'}</button>
      {link && <p className="break-all rounded-lg bg-slate-100 p-3 text-sm text-slate-700">Copied: {link}</p>}
    </div>
  );
}
