"use server";

import { findAllProfessions } from "@/repositories/profession-repository";

/** Canonical order for swissdoc groups (100 → 800) */
const GROUP_ORDER = ["100", "200", "300", "400", "500", "600", "700", "800"];

export type CareersByDomain = {
  total: number;
  groups: {
    domain: string;
    groupCode: string;
    professions: {
      id: string;
      icon: string;
      type: string;
      duration: number;
      name: string;
    }[];
  }[];
};

export async function getAllCareers(locale: string): Promise<CareersByDomain> {
  const professions = await findAllProfessions(locale);

  const grouped = new Map<string, CareersByDomain["groups"][number]["professions"]>();

  for (const p of professions) {
    const groupCode = p.swissdocGroup || "000";
    if (!grouped.has(groupCode)) {
      grouped.set(groupCode, []);
    }
    grouped.get(groupCode)!.push({
      id: p.id,
      icon: p.icon,
      type: p.type,
      duration: p.duration,
      name: p.translations[0]?.name ?? p.id,
    });
  }

  const groups = GROUP_ORDER
    .filter((code) => grouped.has(code))
    .map((code) => ({
      domain: code, // Will be resolved to translated label by the UI
      groupCode: code,
      professions: grouped.get(code)!.sort((a, b) => a.name.localeCompare(b.name)),
    }));

  // Append any unknown group codes
  for (const [code, profs] of grouped) {
    if (!GROUP_ORDER.includes(code)) {
      groups.push({
        domain: code,
        groupCode: code,
        professions: profs.sort((a, b) => a.name.localeCompare(b.name)),
      });
    }
  }

  return { total: professions.length, groups };
}
