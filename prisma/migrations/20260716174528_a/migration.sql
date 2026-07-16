/*
  Warnings:

  - You are about to drop the column `endAt` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `startAt` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `endsAt` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startsAt` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Appointment_startAt_endAt_idx";

-- DropIndex
DROP INDEX "Appointment_userId_startAt_idx";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "endAt",
DROP COLUMN "startAt",
ADD COLUMN     "endsAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startsAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Appointment_startsAt_endsAt_idx" ON "Appointment"("startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "Appointment_userId_startsAt_idx" ON "Appointment"("userId", "startsAt");
