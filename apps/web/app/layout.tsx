import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CelebrateBot',
  description: 'Employee celebration and onboarding automation for Discord and Gmail.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
