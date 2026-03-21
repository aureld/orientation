"use server";

import { prisma } from "@/lib/db";
import { DIMENSIONS } from "@/lib/profile-dimensions";
import type { ProfileVector } from "@/lib/profile-dimensions";

export interface CareerDetail {
  id: string;
  icon: string;
  type: string;
  duration: number;
  urlOrientation: string;
  name: string;
  description: string;
  activities: string[];
  qualities: string[];
  passerelle: string | null;
  sectorId: string;
  sectorName: string;
  sectorColor: string;
  salary: {
    apprenticeYears: { year: number; amount: number }[];
    postCfcMin: number;
    postCfcMax: number;
  } | null;
  profile: ProfileVector;
}

export async function getCareerById(
  id: string,
  locale: string
): Promise<CareerDetail | null> {
  const profession = await prisma.profession.findUnique({
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

  if (!profession) return null;

  const t = profession.translations[0];
  const sal = profession.salaries[0];

  const apprenticeYears: { year: number; amount: number }[] = [];
  if (sal) {
    const yearFields = [sal.apprenticeYear1, sal.apprenticeYear2, sal.apprenticeYear3, sal.apprenticeYear4];
    for (let i = 0; i < yearFields.length; i++) {
      if (yearFields[i] != null) {
        apprenticeYears.push({ year: i + 1, amount: yearFields[i]! });
      }
    }
  }

  const profile = {} as ProfileVector;
  for (const d of DIMENSIONS) {
    profile[d] = profession[d];
  }

  return {
    id: profession.id,
    icon: profession.icon,
    type: profession.type,
    duration: profession.duration,
    urlOrientation: profession.urlOrientation,
    name: t?.name ?? profession.id,
    description: t?.description ?? "",
    activities: t?.activities ?? [],
    qualities: t?.qualities ?? [],
    passerelle: t?.passerelle ?? null,
    sectorId: profession.sectorId,
    sectorName: profession.sector.translations[0]?.name ?? profession.sectorId,
    sectorColor: profession.sector.color,
    salary: sal
      ? { apprenticeYears, postCfcMin: sal.postCfcMin, postCfcMax: sal.postCfcMax }
      : null,
    profile,
  };
}
