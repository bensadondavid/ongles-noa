/*
  Warnings:

  - You are about to drop the column `depositCents` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `paidAt` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSessionId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `totalCents` on the `Appointment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Appointment_stripeSessionId_key";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "depositCents",
DROP COLUMN "paidAt",
DROP COLUMN "stripeSessionId",
DROP COLUMN "totalCents";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "phone" TEXT;
