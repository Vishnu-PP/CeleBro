import nodemailer from 'nodemailer';

function createTransport() {
  const { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GMAIL_USER } = process.env;
  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN || !GMAIL_USER) {
    throw new Error('Missing Gmail OAuth2 environment variables.');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: GMAIL_USER,
      clientId: GMAIL_CLIENT_ID,
      clientSecret: GMAIL_CLIENT_SECRET,
      refreshToken: GMAIL_REFRESH_TOKEN,
    },
  });
}

export async function sendAnnouncementEmail(title: string, message: string, recipients: string[]) {
  if (recipients.length === 0) return;
  const transport = createTransport();
  await transport.sendMail({
    from: `CelebrateBot <${process.env.GMAIL_USER}>`,
    bcc: recipients,
    subject: title,
    html: `<main style="font-family:Arial,sans-serif;line-height:1.6"><h1>${title}</h1><div>${message.replace(/\n/g, '<br />')}</div><hr /><p>Sent with CelebrateBot.</p></main>`,
  });
}
