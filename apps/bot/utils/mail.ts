import type { Employee } from '@prisma/client';
import nodemailer from 'nodemailer';

function createTransport() {
  const { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GMAIL_USER } = process.env;
  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN || !GMAIL_USER) {
    throw new Error('Missing Gmail OAuth2 environment variables.');
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { type: 'OAuth2', user: GMAIL_USER, clientId: GMAIL_CLIENT_ID, clientSecret: GMAIL_CLIENT_SECRET, refreshToken: GMAIL_REFRESH_TOKEN },
  });
}

async function sendMail(to: string, subject: string, text: string, html?: string) {
  if (!to) return;
  await createTransport().sendMail({ from: `CelebrateBot <${process.env.GMAIL_USER}>`, to, subject, text, html: html ?? text.replace(/\n/g, '<br />') });
}

export async function sendBirthdayEmail(employee: Employee) {
  await sendMail(
    employee.email,
    `🎉 Happy Birthday, ${employee.name}!`,
    `Hi ${employee.name},\n\nWishing you a very Happy Birthday from the entire team! 🎂\n\nHope this year brings you joy, success, and all the things you've been working towards.\n\nHave a fantastic day!\n\nWith love,\nThe Team`,
  );
}

export async function sendAnniversaryEmail(employee: Employee, years: number) {
  await sendMail(
    employee.email,
    `🏆 Happy Work Anniversary, ${employee.name}!`,
    `Hi ${employee.name},\n\nToday marks ${years} year(s) since you joined us — and what a journey it's been!\n\nThank you for being such an important part of the team. Here's to many more years together! 🎊\n\nWith appreciation,\nThe Team`,
  );
}

export async function sendAnnouncementEmail(title: string, message: string, recipients: string[]) {
  if (recipients.length === 0) return;
  await createTransport().sendMail({
    from: `CelebrateBot <${process.env.GMAIL_USER}>`,
    bcc: recipients,
    subject: title,
    html: `<main style="font-family:Arial,sans-serif;line-height:1.6"><h1>${title}</h1><div>${message.replace(/\n/g, '<br />')}</div><hr /><p>Sent with CelebrateBot.</p></main>`,
  });
}
