/*
  Warnings:

  - You are about to drop the column `twitterHandle` on the `Bookmark` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bookmark" DROP COLUMN "twitterHandle";

-- CreateIndex
CREATE INDEX "Reaction_bookmarkId_idx" ON "Reaction"("bookmarkId");
