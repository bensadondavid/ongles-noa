/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `Appointment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Appointment_status_expiresAt_idx";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "expiresAt";
