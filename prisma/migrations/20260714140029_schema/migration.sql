/*
  Warnings:

  - You are about to drop the column `serviceId` on the `Appointment` table. All the data in the column will be lost.
  - The primary key for the `AppointmentOption` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `appointmentId` on the `AppointmentOption` table. All the data in the column will be lost.
  - You are about to drop the column `nameSnapshot` on the `AppointmentOption` table. All the data in the column will be lost.
  - You are about to drop the column `bufferAfter` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `descFr` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `descHe` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `Service` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[itemId,optionId]` on the table `AppointmentOption` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `AppointmentOption` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `itemId` to the `AppointmentOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameFrSnapshot` to the `AppointmentOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameHeSnapshot` to the `AppointmentOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "AppointmentOption" DROP CONSTRAINT "AppointmentOption_appointmentId_fkey";

-- DropIndex
DROP INDEX "ServiceOption_serviceId_idx";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "serviceId",
ADD COLUMN     "cancelledAt" TIMESTAMPTZ(3),
ALTER COLUMN "startAt" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "endAt" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "expiresAt" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "depositCents" SET DEFAULT 0,
ALTER COLUMN "paidAt" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "AppointmentOption" DROP CONSTRAINT "AppointmentOption_pkey",
DROP COLUMN "appointmentId",
DROP COLUMN "nameSnapshot",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "itemId" TEXT NOT NULL,
ADD COLUMN     "nameFrSnapshot" TEXT NOT NULL,
ADD COLUMN     "nameHeSnapshot" TEXT NOT NULL,
ADD CONSTRAINT "AppointmentOption_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "bufferAfter",
DROP COLUMN "descFr",
DROP COLUMN "descHe",
DROP COLUMN "sortOrder",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "timeAfter" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ServiceOption" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "TimeOff" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "startAt" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "endAt" SET DATA TYPE TIMESTAMPTZ(3);

-- CreateTable
CREATE TABLE "AppointmentItem" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "nameFrSnapshot" TEXT NOT NULL,
    "nameHeSnapshot" TEXT NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "priceCents" INTEGER NOT NULL,

    CONSTRAINT "AppointmentItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AppointmentItem_appointmentId_idx" ON "AppointmentItem"("appointmentId");

-- CreateIndex
CREATE INDEX "AppointmentItem_serviceId_idx" ON "AppointmentItem"("serviceId");

-- CreateIndex
CREATE INDEX "Appointment_userId_startAt_idx" ON "Appointment"("userId", "startAt");

-- CreateIndex
CREATE INDEX "Appointment_customerEmail_idx" ON "Appointment"("customerEmail");

-- CreateIndex
CREATE INDEX "AppointmentOption_optionId_idx" ON "AppointmentOption"("optionId");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentOption_itemId_optionId_key" ON "AppointmentOption"("itemId", "optionId");

-- CreateIndex
CREATE INDEX "AvailabilityRule_weekday_idx" ON "AvailabilityRule"("weekday");

-- CreateIndex
CREATE INDEX "ServiceOption_serviceId_active_idx" ON "ServiceOption"("serviceId", "active");

-- AddForeignKey
ALTER TABLE "AppointmentItem" ADD CONSTRAINT "AppointmentItem_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentItem" ADD CONSTRAINT "AppointmentItem_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentOption" ADD CONSTRAINT "AppointmentOption_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "AppointmentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
