-- CreateTable
CREATE TABLE "ArticleLike" (
    "slug" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ArticleLike_pkey" PRIMARY KEY ("slug","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArticleLike_slug_key" ON "ArticleLike"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleLike_userId_key" ON "ArticleLike"("userId");

-- AddForeignKey
ALTER TABLE "ArticleLike" ADD CONSTRAINT "ArticleLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
