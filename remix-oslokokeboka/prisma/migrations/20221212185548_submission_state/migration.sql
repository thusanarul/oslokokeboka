-- CreateEnum
CREATE TYPE "SubmissionState" AS ENUM ('STARTED', 'COMPLETED', 'APPROVED');

-- AlterTable
ALTER TABLE "RecipeSubmission" ADD COLUMN     "state" "SubmissionState" NOT NULL DEFAULT 'STARTED';
