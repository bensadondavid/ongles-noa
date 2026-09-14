-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('fr', 'he', 'en');

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "locale" "Locale" NOT NULL DEFAULT 'fr';
