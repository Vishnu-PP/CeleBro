# CelebrateBot

CelebrateBot is a full-stack employee celebration and onboarding automation system. It lets teams onboard employees through shareable web links, manage employee profiles from an admin dashboard, post custom birthday and work-anniversary posters in Discord, send personalised Gmail messages, and broadcast announcements.

## Features

- Token-based employee onboarding form with validation for unique emails, DOB, DOJ, and link expiry.
- Admin dashboard with employee stats, upcoming celebrations, onboarding link generation, announcements, and bot settings.
- Discord bot using `discord.js` v14 with `/profile setup`, `/profile view`, `/upcoming`, and `/announce` commands.
- `guildMemberAdd` onboarding link DMs for new Discord members.
- Timezone-aware birthday and anniversary cron jobs powered by `node-cron`.
- 800x800 poster generation with SVG rendered through `sharp`, avatar fetching, and initials fallback.
- Gmail OAuth2 email delivery through Nodemailer.
- PostgreSQL persistence with Prisma, including `CelebrationLog` duplicate-send protection.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 14 App Router, TypeScript, Tailwind CSS |
| Database | PostgreSQL |
| ORM | Prisma |
| Discord Bot | discord.js v14 |
| Scheduler | node-cron |
| Poster generation | sharp-rendered SVG posters |
| Email | Nodemailer with Gmail OAuth2 |
| Auth | NextAuth.js with Google OAuth |

## Setup

1. Clone the repo.
2. Copy `.env.example` to `.env` and fill in all values.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run Prisma migrations to set up the database:
   ```bash
   npx prisma migrate dev
   ```
5. Seed the default bot config:
   ```bash
   npx prisma db seed
   ```
6. Start the web app:
   ```bash
   npm run dev:web
   ```
7. Start the bot process in a second terminal:
   ```bash
   npm run dev:bot
   ```

## Environment Variables

See `.env.example` for the full list. Required groups are:

- `DATABASE_URL` for PostgreSQL.
- `DISCORD_BOT_TOKEN`, `DISCORD_CLIENT_ID`, and `DISCORD_GUILD_ID` for the bot.
- `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`, and `GMAIL_USER` for Gmail OAuth2.
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and optional comma-separated `ADMIN_EMAILS` for admin login.
- `NEXT_PUBLIC_APP_URL` for onboarding links.

## Discord Bot Setup

1. Go to <https://discord.com/developers/applications>.
2. Create a new application, then create a Bot.
3. Copy the Bot Token into `DISCORD_BOT_TOKEN`.
4. Enable Privileged Gateway Intents: Server Members Intent and Message Content Intent.
5. Invite the bot to your server with scopes: `bot` and `applications.commands`.
6. Required permissions: Send Messages, Embed Links, Attach Files, and Read Message History.
7. Optionally set `DISCORD_ADMIN_ROLE_ID` to restrict `/announce` to a specific Discord role.

## Gmail OAuth2 Setup

1. Go to Google Cloud Console.
2. Create OAuth2 credentials for a Desktop app.
3. Add the Gmail API scope.
4. Get a refresh token using OAuth2 Playground.
5. Add the credentials and refresh token to `.env`.

## Project Structure

```text
apps/web        Next.js web app, admin dashboard, onboarding form, API routes
apps/bot        Standalone Discord bot, slash commands, cron jobs, poster generation
prisma          Prisma schema, migration, and seed script
```

## Deployment Notes

Run CelebrateBot as two services that share the same PostgreSQL database:

- Web service: `npm run build:web` then `npm run start:web`.
- Bot worker service: `npm run dev:bot` for TSX-based execution or build a JS bundle with `npm run build:bot` and run `npm run start:bot`.

Railway and Render both support this model with separate services pointed at the same database and environment variables.
