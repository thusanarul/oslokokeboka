-- CreateEnum
CREATE TYPE "InputType" AS ENUM ('TEXT', 'TEXTAREA', 'DROPDOWN', 'ADDER', 'CONSENT');

-- CreateTable
CREATE TABLE "RecipeSubmission" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecipeSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeField" (
    "id" SERIAL NOT NULL,
    "index" TEXT NOT NULL,
    "step" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "inputType" "InputType" NOT NULL,
    "inputValue" TEXT NOT NULL,
    "recipeSubmissionId" TEXT,

    CONSTRAINT "RecipeField_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecipeField" ADD CONSTRAINT "RecipeField_recipeSubmissionId_fkey" FOREIGN KEY ("recipeSubmissionId") REFERENCES "RecipeSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
