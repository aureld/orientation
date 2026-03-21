-- CreateTable
CREATE TABLE "Sector" (
    "id" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "Sector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectorTranslation" (
    "id" SERIAL NOT NULL,
    "sectorId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SectorTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profession" (
    "id" TEXT NOT NULL,
    "sectorId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "icon" TEXT NOT NULL,
    "urlOrientation" TEXT NOT NULL,
    "manuel" INTEGER NOT NULL DEFAULT 0,
    "intellectuel" INTEGER NOT NULL DEFAULT 0,
    "creatif" INTEGER NOT NULL DEFAULT 0,
    "analytique" INTEGER NOT NULL DEFAULT 0,
    "interieur" INTEGER NOT NULL DEFAULT 0,
    "exterieur" INTEGER NOT NULL DEFAULT 0,
    "equipe" INTEGER NOT NULL DEFAULT 0,
    "independant" INTEGER NOT NULL DEFAULT 0,
    "contactHumain" INTEGER NOT NULL DEFAULT 0,
    "technique" INTEGER NOT NULL DEFAULT 0,
    "routine" INTEGER NOT NULL DEFAULT 0,
    "variete" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Profession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionTranslation" (
    "id" SERIAL NOT NULL,
    "professionId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "activities" TEXT[],
    "qualities" TEXT[],
    "passerelle" TEXT,

    CONSTRAINT "ProfessionTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalaryInfo" (
    "id" SERIAL NOT NULL,
    "professionId" TEXT NOT NULL,
    "apprenticeYear1" INTEGER,
    "apprenticeYear2" INTEGER,
    "apprenticeYear3" INTEGER,
    "apprenticeYear4" INTEGER,
    "postCfcMin" INTEGER NOT NULL,
    "postCfcMax" INTEGER NOT NULL,

    CONSTRAINT "SalaryInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scenario" (
    "id" TEXT NOT NULL,
    "sectorId" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "Scenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScenarioTranslation" (
    "id" SERIAL NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "ScenarioTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scene" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "sceneKey" TEXT NOT NULL,
    "isFinal" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Scene_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SceneTranslation" (
    "id" SERIAL NOT NULL,
    "sceneId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "SceneTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Choice" (
    "id" TEXT NOT NULL,
    "sceneId" TEXT NOT NULL,
    "nextSceneKey" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "manuel" INTEGER NOT NULL DEFAULT 0,
    "intellectuel" INTEGER NOT NULL DEFAULT 0,
    "creatif" INTEGER NOT NULL DEFAULT 0,
    "analytique" INTEGER NOT NULL DEFAULT 0,
    "interieur" INTEGER NOT NULL DEFAULT 0,
    "exterieur" INTEGER NOT NULL DEFAULT 0,
    "equipe" INTEGER NOT NULL DEFAULT 0,
    "independant" INTEGER NOT NULL DEFAULT 0,
    "contactHumain" INTEGER NOT NULL DEFAULT 0,
    "technique" INTEGER NOT NULL DEFAULT 0,
    "routine" INTEGER NOT NULL DEFAULT 0,
    "variete" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Choice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChoiceTranslation" (
    "id" SERIAL NOT NULL,
    "choiceId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "ChoiceTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScenarioEndProfession" (
    "id" SERIAL NOT NULL,
    "sceneId" TEXT NOT NULL,
    "professionId" TEXT NOT NULL,

    CONSTRAINT "ScenarioEndProfession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "manuel" INTEGER NOT NULL DEFAULT 0,
    "intellectuel" INTEGER NOT NULL DEFAULT 0,
    "creatif" INTEGER NOT NULL DEFAULT 0,
    "analytique" INTEGER NOT NULL DEFAULT 0,
    "interieur" INTEGER NOT NULL DEFAULT 0,
    "exterieur" INTEGER NOT NULL DEFAULT 0,
    "equipe" INTEGER NOT NULL DEFAULT 0,
    "independant" INTEGER NOT NULL DEFAULT 0,
    "contactHumain" INTEGER NOT NULL DEFAULT 0,
    "technique" INTEGER NOT NULL DEFAULT 0,
    "routine" INTEGER NOT NULL DEFAULT 0,
    "variete" INTEGER NOT NULL DEFAULT 0,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "darkMode" BOOLEAN NOT NULL DEFAULT false,
    "preferredLocale" TEXT NOT NULL DEFAULT 'fr',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserScenario" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserScenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserChoice" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "sceneKey" TEXT NOT NULL,
    "choiceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserChoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCareerView" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "professionId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserCareerView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBadge" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "conditionType" TEXT NOT NULL,
    "conditionValue" INTEGER,
    "conditionScenarioId" TEXT,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BadgeTranslation" (
    "id" SERIAL NOT NULL,
    "badgeId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "BadgeTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SectorTranslation_sectorId_locale_key" ON "SectorTranslation"("sectorId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionTranslation_professionId_locale_key" ON "ProfessionTranslation"("professionId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "SalaryInfo_professionId_key" ON "SalaryInfo"("professionId");

-- CreateIndex
CREATE UNIQUE INDEX "ScenarioTranslation_scenarioId_locale_key" ON "ScenarioTranslation"("scenarioId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Scene_scenarioId_sceneKey_key" ON "Scene"("scenarioId", "sceneKey");

-- CreateIndex
CREATE UNIQUE INDEX "SceneTranslation_sceneId_locale_key" ON "SceneTranslation"("sceneId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "ChoiceTranslation_choiceId_locale_key" ON "ChoiceTranslation"("choiceId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "ScenarioEndProfession_sceneId_professionId_key" ON "ScenarioEndProfession"("sceneId", "professionId");

-- CreateIndex
CREATE UNIQUE INDEX "UserScenario_userId_scenarioId_key" ON "UserScenario"("userId", "scenarioId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCareerView_userId_professionId_key" ON "UserCareerView"("userId", "professionId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBadge_userId_badgeId_key" ON "UserBadge"("userId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "BadgeTranslation_badgeId_locale_key" ON "BadgeTranslation"("badgeId", "locale");

-- AddForeignKey
ALTER TABLE "SectorTranslation" ADD CONSTRAINT "SectorTranslation_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profession" ADD CONSTRAINT "Profession_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionTranslation" ADD CONSTRAINT "ProfessionTranslation_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "Profession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryInfo" ADD CONSTRAINT "SalaryInfo_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "Profession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scenario" ADD CONSTRAINT "Scenario_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenarioTranslation" ADD CONSTRAINT "ScenarioTranslation_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scene" ADD CONSTRAINT "Scene_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SceneTranslation" ADD CONSTRAINT "SceneTranslation_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Choice" ADD CONSTRAINT "Choice_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChoiceTranslation" ADD CONSTRAINT "ChoiceTranslation_choiceId_fkey" FOREIGN KEY ("choiceId") REFERENCES "Choice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenarioEndProfession" ADD CONSTRAINT "ScenarioEndProfession_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenarioEndProfession" ADD CONSTRAINT "ScenarioEndProfession_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "Profession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserScenario" ADD CONSTRAINT "UserScenario_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChoice" ADD CONSTRAINT "UserChoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCareerView" ADD CONSTRAINT "UserCareerView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeTranslation" ADD CONSTRAINT "BadgeTranslation_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
