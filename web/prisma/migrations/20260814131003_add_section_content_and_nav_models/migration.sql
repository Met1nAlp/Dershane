-- CreateTable
CREATE TABLE "ServicesSectionContent" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "badge" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "ServicesSectionContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamSectionContent" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "badge" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "TeamSectionContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventsSectionContent" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "badge" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "EventsSectionContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactSectionContent" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "badge" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "infoAddressLabel" TEXT NOT NULL,
    "infoPhoneLabel" TEXT NOT NULL,
    "infoEmailLabel" TEXT NOT NULL,
    "infoHoursLabel" TEXT NOT NULL,
    "mapPlaceholderText" TEXT NOT NULL,
    "formTitle" TEXT NOT NULL,
    "formNameLabel" TEXT NOT NULL,
    "formNamePlaceholder" TEXT NOT NULL,
    "formPhoneLabel" TEXT NOT NULL,
    "formPhonePlaceholder" TEXT NOT NULL,
    "formEmailLabel" TEXT NOT NULL,
    "formEmailPlaceholder" TEXT NOT NULL,
    "formNoteLabel" TEXT NOT NULL,
    "formNotePlaceholder" TEXT NOT NULL,
    "submitLabel" TEXT NOT NULL,
    "submitLoadingLabel" TEXT NOT NULL,
    "successTitle" TEXT NOT NULL,
    "successMessage" TEXT NOT NULL,
    "successButtonLabel" TEXT NOT NULL,
    "errorGeneric" TEXT NOT NULL,
    "errorUnexpected" TEXT NOT NULL,

    CONSTRAINT "ContactSectionContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavLink" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,

    CONSTRAINT "NavLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavbarContent" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "ctaLabel" TEXT NOT NULL,

    CONSTRAINT "NavbarContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FooterContent" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "copyrightSuffix" TEXT NOT NULL,
    "creditLine" TEXT NOT NULL,

    CONSTRAINT "FooterContent_pkey" PRIMARY KEY ("id")
);
