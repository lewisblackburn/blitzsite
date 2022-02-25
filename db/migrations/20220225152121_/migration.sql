/*
  Warnings:

  - You are about to drop the `_BookmarkToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BookmarkToTag" DROP CONSTRAINT "_BookmarkToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_BookmarkToTag" DROP CONSTRAINT "_BookmarkToTag_B_fkey";

-- AlterTable
ALTER TABLE "Bookmark" ADD COLUMN     "tagId" TEXT;

-- DropTable
DROP TABLE "_BookmarkToTag";

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
