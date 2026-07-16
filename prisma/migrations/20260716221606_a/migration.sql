/*
  Warnings:

  - You are about to drop the `AppointmentItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AppointmentOption` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `appointmentItem` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AppointmentItem" DROP CONSTRAINT "AppointmentItem_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "AppointmentItem" DROP CONSTRAINT "AppointmentItem_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "AppointmentOption" DROP CONSTRAINT "AppointmentOption_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "AppointmentOption" DROP CONSTRAINT "AppointmentOption_optionId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "appointmentItem" JSONB NOT NULL,
ADD COLUMN     "appointmentOption" JSONB;

-- DropTable
DROP TABLE "AppointmentItem";

-- DropTable
DROP TABLE "AppointmentOption";
