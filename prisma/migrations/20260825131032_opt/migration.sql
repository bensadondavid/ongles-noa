-- AlterTable
ALTER TABLE "Options" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Prestations" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
