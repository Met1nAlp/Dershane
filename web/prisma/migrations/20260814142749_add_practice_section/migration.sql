-- CreateTable
CREATE TABLE "PracticeSectionContent" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "badge" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "PracticeSectionContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeItem" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "PracticeItem_pkey" PRIMARY KEY ("id")
);
