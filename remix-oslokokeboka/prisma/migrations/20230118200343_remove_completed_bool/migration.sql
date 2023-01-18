/*
  Warnings:

  - The values [APPROVED] on the enum `SubmissionState` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `completed` on the `RecipeSubmission` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubmissionState_new" AS ENUM ('STARTED', 'COMPLETED', 'PROCESSED');
ALTER TABLE "RecipeSubmission" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "RecipeSubmission" ALTER COLUMN "state" TYPE "SubmissionState_new" USING ("state"::text::"SubmissionState_new");
ALTER TYPE "SubmissionState" RENAME TO "SubmissionState_old";
ALTER TYPE "SubmissionState_new" RENAME TO "SubmissionState";
DROP TYPE "SubmissionState_old";
ALTER TABLE "RecipeSubmission" ALTER COLUMN "state" SET DEFAULT 'STARTED';
COMMIT;

-- AlterTable
ALTER TABLE "RecipeSubmission" DROP COLUMN "completed";
