import { prisma } from "@/infrastructure/db";

export function saveUserChoice(
  userId: string,
  scenarioId: string,
  sceneKey: string,
  choiceId: string
) {
  return prisma.userChoice.create({
    data: { userId, scenarioId, sceneKey, choiceId },
  });
}

export function markScenarioComplete(userId: string, scenarioId: string) {
  return prisma.userScenario.upsert({
    where: { userId_scenarioId: { userId, scenarioId } },
    create: { userId, scenarioId },
    update: { completedAt: new Date() },
  });
}

export async function getUserProgress(userId: string) {
  const [completedScenarios, choiceCount] = await Promise.all([
    prisma.userScenario.findMany({
      where: { userId },
      select: { scenarioId: true },
    }),
    prisma.userChoice.count({ where: { userId } }),
  ]);

  return {
    completedScenarioIds: completedScenarios.map((s) => s.scenarioId),
    choiceCount,
  };
}

export async function hasCompletedScenario(
  userId: string,
  scenarioId: string
): Promise<boolean> {
  const record = await prisma.userScenario.findUnique({
    where: { userId_scenarioId: { userId, scenarioId } },
  });
  return record !== null;
}

export function deleteScenarioChoices(userId: string, scenarioId: string) {
  return prisma.userChoice.deleteMany({
    where: { userId, scenarioId },
  });
}

export async function getChoiceTagsForScenario(
  userId: string,
  scenarioId: string
) {
  const choices = await prisma.userChoice.findMany({
    where: { userId, scenarioId },
    select: { choiceId: true },
  });
  return choices.map((c) => c.choiceId);
}
