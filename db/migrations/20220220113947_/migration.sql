/*
  Warnings:

  - The primary key for the `ArticleLike` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[slug,userId]` on the table `ArticleLike` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ArticleLike_userId_key";

-- AlterTable
ALTER TABLE "ArticleLike" DROP CONSTRAINT "ArticleLike_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "ArticleLike_slug_userId_key" ON "ArticleLike"("slug", "userId");
