/*
  Warnings:

  - You are about to drop the column `weekday` on the `AvailabilityRule` table. All the data in the column will be lost.
  - Added the required column `date` to the `AvailabilityRule` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('CLIENT', 'ADMIN');

-- DropIndex
DROP INDEX "AvailabilityRule_weekday_idx";

-- DropIndex
DROP INDEX "AvailabilityRule_weekday_startMin_key";

-- AlterTable
ALTER TABLE "AvailabilityRule" DROP COLUMN "weekday",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "AvailabilityRule_date_idx" ON "AvailabilityRule"("date");
