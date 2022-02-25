/*
  Warnings:

  - A unique constraint covering the columns `[commentId,userId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bookmarkId,userId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Reaction_bookmarkId_idx";

-- DropIndex
DROP INDEX "Reaction_commentId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_commentId_userId_key" ON "Reaction"("commentId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_bookmarkId_userId_key" ON "Reaction"("bookmarkId", "userId");
