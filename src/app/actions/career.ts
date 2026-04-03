"use server";

import { findProfessionById } from "@/repositories/profession-repository";
import { DIMENSIONS } from "@/domain/profile";
import type { ProfileVector } from "@/domain/profile";

export interface CareerDetail {
  id: string;
  icon: string;
  type: string;
  duration: number;
  urlOrientation: string | null;
  name: string;
  description: string;
  activities: string[];
  qualities: string[];
  passerelle: string | null;
  sectorId: string | null;
  sectorName: string;
  sectorColor: string;
  salary: {
    apprenticeYears: { year: number; amount: number }[];
    postCfcMin: number;
    postCfcMax: number;
  } | null;
  profile: ProfileVector;
  // Full orientation.ch content
  domainesProfessionnels: string | null;
  descriptionFull: string | null;
  formation: string | null;
  perspectivesProfessionnelles: string | null;
  autresInformations: string | null;
  adressesUtiles: string | null;
}

export async function getCareerById(
  id: string,
  locale: string
): Promise<CareerDetail | null> {
  const profession = await findProfessionById(id, locale);

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
    urlOrientation: profession.urlOrientation ?? t?.orientationUrl ?? null,
    name: t?.name ?? profession.id,
    description: t?.description ?? "",
    activities: t?.activities ?? [],
    qualities: t?.qualities ?? [],
    passerelle: t?.passerelle ?? null,
    sectorId: profession.sectorId,
    sectorName: profession.sector?.translations[0]?.name ?? profession.sectorId ?? "",
    sectorColor: profession.sector?.color ?? "",
    salary: sal
      ? { apprenticeYears, postCfcMin: sal.postCfcMin, postCfcMax: sal.postCfcMax }
      : null,
    profile,
    domainesProfessionnels: t?.domainesProfessionnels ?? null,
    descriptionFull: t?.descriptionFull ?? null,
    formation: t?.formation ?? null,
    perspectivesProfessionnelles: t?.perspectivesProfessionnelles ?? null,
    autresInformations: t?.autresInformations ?? null,
    adressesUtiles: t?.adressesUtiles ?? null,
  };
}
