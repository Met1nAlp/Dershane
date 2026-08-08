-- CreateTable
CREATE TABLE "HeroContent" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "badge" TEXT NOT NULL,
    "headingLine1" TEXT NOT NULL,
    "rotatingWords" TEXT[],
    "subtext" TEXT NOT NULL,
    "primaryCtaLabel" TEXT NOT NULL,
    "secondaryCtaLabel" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatItem" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "icon" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "prefix" TEXT,
    "suffix" TEXT,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "showInHero" BOOLEAN NOT NULL DEFAULT false,
    "showInStats" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "StatItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatsSectionContent" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "badge" TEXT NOT NULL,
    "titleLine1" TEXT NOT NULL,
    "titleLine2" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "StatsSectionContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutContent" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "badge" TEXT NOT NULL,
    "titleLine1" TEXT NOT NULL,
    "titleAccent" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "foundingYear" TEXT NOT NULL,
    "foundingLabel" TEXT NOT NULL,
    "foundingSub" TEXT NOT NULL,

    CONSTRAINT "AboutContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutPillar" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "icon" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "highlight" TEXT NOT NULL,

    CONSTRAINT "AboutPillar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceItem" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "icon" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "ServiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "experienceLabel" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "colorHex" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventItem" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "EventItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactInfo" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "workingHours" TEXT NOT NULL,
    "mapEmbedUrl" TEXT,

    CONSTRAINT "ContactInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "brandName" TEXT NOT NULL,
    "brandTagline" TEXT NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);
