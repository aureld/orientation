"use server";

import { prisma } from "@/lib/db";

export type CareersBySection = {
  sectorId: string;
  sectorName: string;
  professions: {
    id: string;
    icon: string;
    type: string;
    duration: number;
    name: string;
  }[];
}[];

export async function getCareersGroupedBySector(locale: string): Promise<CareersBySection> {
  const sectors = await prisma.sector.findMany({
    include: {
      translations: {
        where: { locale },
        select: { name: true },
      },
      professions: {
        include: {
          translations: {
            where: { locale },
            select: { name: true },
          },
        },
      },
    },
    orderBy: { id: "asc" },
  });

  return sectors
    .filter((s) => s.professions.length > 0)
    .map((s) => ({
      sectorId: s.id,
      sectorName: s.translations[0]?.name ?? s.id,
      professions: s.professions.map((p) => ({
        id: p.id,
        icon: p.icon,
        type: p.type,
        duration: p.duration,
        name: p.translations[0]?.name ?? p.id,
      })),
    }));
}
