-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('PENDING', 'APPROVED', 'PUBLISHED', 'REJECTED', 'DELETED');

-- CreateEnum
CREATE TYPE "TopicStatus" AS ENUM ('AVAILABLE', 'USED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TopicSource" AS ENUM ('GENERATED', 'CUSTOM', 'TRENDING');

-- CreateEnum
CREATE TYPE "NewsletterStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'SENT', 'FAILED');

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'PENDING',
    "topicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "newsletterId" TEXT,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "TopicStatus" NOT NULL DEFAULT 'AVAILABLE',
    "source" "TopicSource" NOT NULL DEFAULT 'GENERATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Newsletter" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "NewsletterStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduledFor" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Topic_name_key" ON "Topic"("name");

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_newsletterId_fkey" FOREIGN KEY ("newsletterId") REFERENCES "Newsletter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
