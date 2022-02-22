/*
  Warnings:

  - You are about to drop the `Bookmark` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BookmarkComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BookmarkLike` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "BookmarkComment" DROP CONSTRAINT "BookmarkComment_bookmarkId_fkey";

-- DropForeignKey
ALTER TABLE "BookmarkComment" DROP CONSTRAINT "BookmarkComment_userId_fkey";

-- DropForeignKey
ALTER TABLE "BookmarkLike" DROP CONSTRAINT "BookmarkLike_bookmarkId_fkey";

-- DropForeignKey
ALTER TABLE "BookmarkLike" DROP CONSTRAINT "BookmarkLike_userId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- DropTable
DROP TABLE "Bookmark";

-- DropTable
DROP TABLE "BookmarkComment";

-- DropTable
DROP TABLE "BookmarkLike";

-- DropEnum
DROP TYPE "BookmarkType";
