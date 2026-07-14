/*
  Warnings:

  - You are about to drop the column `notes` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `extraCents` on the `AppointmentOption` table. All the data in the column will be lost.
  - You are about to drop the column `extraMin` on the `AppointmentOption` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `AppointmentOption` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `timeAfter` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `extraMin` on the `ServiceOption` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `ServiceOption` table. All the data in the column will be lost.
  - You are about to drop the `twoFactor` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[appointmentId,optionId]` on the table `AppointmentOption` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `Appointment` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `appointmentId` to the `AppointmentOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceCents` to the `AppointmentOption` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_userId_fkey";

-- DropForeignKey
ALTER TABLE "AppointmentOption" DROP CONSTRAINT "AppointmentOption_itemId_fkey";

-- DropForeignKey
ALTER TABLE "AppointmentOption" DROP CONSTRAINT "AppointmentOption_optionId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceOption" DROP CONSTRAINT "ServiceOption_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "twoFactor" DROP CONSTRAINT "twoFactor_userId_fkey";

-- DropIndex
DROP INDEX "AppointmentOption_itemId_optionId_key";

-- DropIndex
DROP INDEX "Service_slug_key";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "notes",
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "startAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "endAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "expiresAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "paidAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "cancelledAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "AppointmentOption" DROP COLUMN "extraCents",
DROP COLUMN "extraMin",
DROP COLUMN "itemId",
ADD COLUMN     "appointmentId" TEXT NOT NULL,
ADD COLUMN     "priceCents" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "slug",
DROP COLUMN "timeAfter";

-- AlterTable
ALTER TABLE "ServiceOption" DROP COLUMN "extraMin",
DROP COLUMN "sortOrder",
ADD COLUMN     "durationMin" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "TimeOff" ALTER COLUMN "startAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "endAt" SET DATA TYPE TIMESTAMP(3);

-- DropTable
DROP TABLE "twoFactor";

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentOption_appointmentId_optionId_key" ON "AppointmentOption"("appointmentId", "optionId");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentOption" ADD CONSTRAINT "AppointmentOption_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentOption" ADD CONSTRAINT "AppointmentOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "ServiceOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
