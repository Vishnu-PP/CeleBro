CREATE TABLE "Employee" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "dob" TIMESTAMP(3) NOT NULL,
  "doj" TIMESTAMP(3) NOT NULL,
  "department" TEXT,
  "role" TEXT,
  "discordId" TEXT,
  "discordUsername" TEXT,
  "avatarUrl" TEXT,
  "preferredLang" TEXT NOT NULL DEFAULT 'en',
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OnboardLink" (
  "id" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "used" BOOLEAN NOT NULL DEFAULT false,
  "usedBy" TEXT,
  "expiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OnboardLink_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Announcement" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "channels" TEXT[],
  "sendEmail" BOOLEAN NOT NULL DEFAULT false,
  "emailList" TEXT[],
  "sentAt" TIMESTAMP(3),
  "scheduledAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BotConfig" (
  "id" TEXT NOT NULL DEFAULT 'default',
  "birthdayChannelId" TEXT,
  "anniversaryChannelId" TEXT,
  "announcementChannelId" TEXT,
  "birthdayTemplate" TEXT NOT NULL DEFAULT '🎉 Happy Birthday {name}! Wishing you an amazing year ahead 🥳',
  "anniversaryTemplate" TEXT NOT NULL DEFAULT '🏆 Happy Work Anniversary {name}! {years} year(s) with us 🎊',
  "sendTime" TEXT NOT NULL DEFAULT '09:00',
  "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  CONSTRAINT "BotConfig_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CelebrationLog" (
  "id" TEXT NOT NULL,
  "employeeId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "dateKey" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CelebrationLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");
CREATE UNIQUE INDEX "Employee_discordId_key" ON "Employee"("discordId");
CREATE UNIQUE INDEX "OnboardLink_token_key" ON "OnboardLink"("token");
CREATE UNIQUE INDEX "CelebrationLog_employeeId_type_dateKey_key" ON "CelebrationLog"("employeeId", "type", "dateKey");
ALTER TABLE "CelebrationLog" ADD CONSTRAINT "CelebrationLog_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
