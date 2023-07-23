-- CreateTable
CREATE TABLE "RecipeImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "default" BOOLEAN NOT NULL DEFAULT false,
    "recipeSubmissionId" TEXT,

    CONSTRAINT "RecipeImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecipeImage_url_key" ON "RecipeImage"("url");

-- AddForeignKey
ALTER TABLE "RecipeImage" ADD CONSTRAINT "RecipeImage_recipeSubmissionId_fkey" FOREIGN KEY ("recipeSubmissionId") REFERENCES "RecipeSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
