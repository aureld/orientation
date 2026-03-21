import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the prisma client before importing the module under test
vi.mock("@/lib/db", () => ({
  prisma: {
    sector: {
      findMany: vi.fn(),
    },
  },
}));

import { getCareersGroupedBySector } from "../careers";
import { prisma } from "@/lib/db";

const mockFindMany = vi.mocked(prisma.sector.findMany);

/** Helper to build a mock sector row from Prisma */
function mockSector(
  id: string,
  sectorTranslations: { name: string }[],
  professions: {
    id: string;
    icon: string;
    type: string;
    duration: number;
    translations: { name: string }[];
  }[]
) {
  return {
    id,
    color: `--color-${id}`,
    translations: sectorTranslations,
    professions: professions.map((p) => ({
      ...p,
      urlOrientation: "https://example.com",
      sectorId: id,
      manuel: 0, intellectuel: 0, creatif: 0, analytique: 0,
      interieur: 0, exterieur: 0, equipe: 0, independant: 0,
      contactHumain: 0, technique: 0, routine: 0, variete: 0,
    })),
  };
}

describe("getCareersGroupedBySector", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns professions grouped by sector with sector name", async () => {
    mockFindMany.mockResolvedValue([
      mockSector("sante", [{ name: "Santé" }], [
        { id: "assc", icon: "🏥", type: "CFC", duration: 3, translations: [{ name: "ASSC" }] },
      ]),
    ] as never);

    const result = await getCareersGroupedBySector("fr");

    expect(result).toEqual([
      {
        sectorId: "sante",
        sectorName: "Santé",
        professions: [
          { id: "assc", icon: "🏥", type: "CFC", duration: 3, name: "ASSC" },
        ],
      },
    ]);
  });

  it("filters out sectors with no professions", async () => {
    mockFindMany.mockResolvedValue([
      mockSector("sante", [{ name: "Santé" }], [
        { id: "assc", icon: "🏥", type: "CFC", duration: 3, translations: [{ name: "ASSC" }] },
      ]),
      mockSector("vide", [{ name: "Vide" }], []),
    ] as never);

    const result = await getCareersGroupedBySector("fr");

    expect(result).toHaveLength(1);
    expect(result[0].sectorId).toBe("sante");
  });

  it("falls back to profession id when no profession translation exists", async () => {
    mockFindMany.mockResolvedValue([
      mockSector("sante", [{ name: "Gesundheit" }], [
        { id: "assc", icon: "🏥", type: "CFC", duration: 3, translations: [] },
      ]),
    ] as never);

    const result = await getCareersGroupedBySector("de");

    expect(result[0].professions[0].name).toBe("assc");
  });

  it("falls back to sector id when no sector translation exists", async () => {
    mockFindMany.mockResolvedValue([
      mockSector("sante", [], [
        { id: "assc", icon: "🏥", type: "CFC", duration: 3, translations: [{ name: "ASSC" }] },
      ]),
    ] as never);

    const result = await getCareersGroupedBySector("fr");

    expect(result[0].sectorName).toBe("sante");
  });

  it("queries sector translations filtered by locale", async () => {
    mockFindMany.mockResolvedValue([] as never);

    await getCareersGroupedBySector("de");

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          translations: expect.objectContaining({
            where: { locale: "de" },
          }),
          professions: expect.objectContaining({
            include: expect.objectContaining({
              translations: expect.objectContaining({
                where: { locale: "de" },
              }),
            }),
          }),
        }),
      })
    );
  });

  it("orders sectors by id ascending", async () => {
    mockFindMany.mockResolvedValue([] as never);

    await getCareersGroupedBySector("fr");

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { id: "asc" },
      })
    );
  });
});
