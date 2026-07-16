/*
  Warnings:

  - You are about to drop the column `durationMin` on the `Appointment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "durationMin",
ADD COLUMN     "message" TEXT;
