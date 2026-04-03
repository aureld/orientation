"use server";

import { prisma } from "@/lib/db";

/** Swissdoc main group labels (FR) */
const SWISSDOC_GROUP_LABELS: Record<string, string> = {
  "100": "Nature",
  "200": "Alimentation, Hôtellerie, Restauration",
  "300": "Textiles, Habillement, Soins corporels",
  "400": "Construction",
  "500": "Industrie, Technique, Informatique",
  "600": "Économie, Commerce, Transports",
  "700": "Santé, Social, Formation",
  "800": "Médias, Arts, Sciences humaines",
};

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
  const professions = await prisma.profession.findMany({
    include: {
      translations: {
        where: { locale },
        select: { name: true },
      },
    },
    orderBy: { id: "asc" },
  });

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
      domain: SWISSDOC_GROUP_LABELS[code] ?? code,
      groupCode: code,
      professions: grouped.get(code)!.sort((a, b) => a.name.localeCompare(b.name)),
    }));

  // Append any unknown group codes (shouldn't happen, but safe)
  for (const [code, profs] of grouped) {
    if (!GROUP_ORDER.includes(code)) {
      groups.push({
        domain: SWISSDOC_GROUP_LABELS[code] ?? "Autres",
        groupCode: code,
        professions: profs.sort((a, b) => a.name.localeCompare(b.name)),
      });
    }
  }

  return { total: professions.length, groups };
}
