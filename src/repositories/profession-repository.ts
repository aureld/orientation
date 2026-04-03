import { prisma } from "@/infrastructure/db";

export function findProfessionById(id: string, locale: string) {
  return prisma.profession.findUnique({
    where: { id },
    include: {
      sector: {
        include: {
          translations: { where: { locale }, select: { name: true } },
        },
      },
      translations: {
        where: { locale },
      },
      salaries: true,
    },
  });
}

export function findAllProfessions(locale: string) {
  return prisma.profession.findMany({
    include: {
      translations: {
        where: { locale },
        select: { name: true },
      },
    },
    orderBy: { id: "asc" },
  });
}

export function findProfessionsByIds(ids: string[]) {
  return prisma.profession.findMany({
    where: { id: { in: ids } },
    select: { id: true, icon: true, type: true },
  });
}
