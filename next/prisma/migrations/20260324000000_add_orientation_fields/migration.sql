-- DropForeignKey
ALTER TABLE "Profession" DROP CONSTRAINT "Profession_sectorId_fkey";

-- AlterTable
ALTER TABLE "Profession" ADD COLUMN     "swissdoc" TEXT,
ALTER COLUMN "sectorId" DROP NOT NULL,
ALTER COLUMN "icon" SET DEFAULT '💼',
ALTER COLUMN "urlOrientation" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProfessionTranslation" ADD COLUMN     "adressesUtiles" TEXT,
ADD COLUMN     "autresInformations" TEXT,
ADD COLUMN     "descriptionFull" TEXT,
ADD COLUMN     "domainesProfessionnels" TEXT,
ADD COLUMN     "formation" TEXT,
ADD COLUMN     "orientationId" TEXT,
ADD COLUMN     "orientationUrl" TEXT,
ADD COLUMN     "perspectivesProfessionnelles" TEXT,
ALTER COLUMN "description" SET DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Profession_swissdoc_key" ON "Profession"("swissdoc");

-- AddForeignKey
ALTER TABLE "Profession" ADD CONSTRAINT "Profession_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id") ON DELETE SET NULL ON UPDATE CASCADE;
