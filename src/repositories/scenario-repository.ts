import { prisma } from "@/infrastructure/db";

export function findAllScenarios(locale: string) {
  return prisma.scenario.findMany({
    include: {
      translations: { where: { locale }, select: { title: true, description: true } },
      sector: {
        include: { translations: { where: { locale }, select: { name: true } } },
      },
    },
    orderBy: { id: "asc" },
  });
}

export function findScenarioById(id: string, locale: string) {
  return prisma.scenario.findUnique({
    where: { id },
    include: {
      translations: { where: { locale } },
      scenes: {
        orderBy: { sortOrder: "asc" },
        include: {
          translations: { where: { locale }, select: { text: true } },
          choices: {
            orderBy: { sortOrder: "asc" },
            include: {
              translations: { where: { locale }, select: { text: true } },
            },
          },
          endProfessions: {
            include: {
              profession: {
                include: {
                  translations: { where: { locale }, select: { name: true } },
                },
              },
            },
          },
        },
      },
    },
  });
}
