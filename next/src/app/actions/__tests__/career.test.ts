import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db", () => ({
  prisma: {
    profession: {
      findUnique: vi.fn(),
    },
  },
}));

import { getCareerById } from "../career";
import { prisma } from "@/lib/db";

const mockFindUnique = vi.mocked(prisma.profession.findUnique);

/** Helper to build a full mock profession row */
function mockProfession(overrides: Record<string, unknown> = {}) {
  return {
    id: "assc",
    sectorId: "sante",
    type: "CFC",
    duration: 3,
    icon: "🏥",
    urlOrientation: "https://orientation.ch/assc",
    manuel: 3, intellectuel: 7, creatif: 2, analytique: 5,
    interieur: 8, exterieur: 2, equipe: 9, independant: 1,
    contactHumain: 10, technique: 4, routine: 5, variete: 5,
    sector: {
      id: "sante",
      color: "--color-sante",
      translations: [{ name: "Santé" }],
    },
    translations: [
      {
        name: "Assistant/e en soins et santé communautaire",
        description: "Aide les patients au quotidien.",
        activities: ["Soins de base", "Prise de tension"],
        qualities: ["Empathie", "Rigueur"],
        passerelle: null,
      },
    ],
    salaries: [
      {
        apprenticeYear1: 1100,
        apprenticeYear2: 1300,
        apprenticeYear3: 1500,
        apprenticeYear4: null,
        postCfcMin: 4800,
        postCfcMax: 5500,
      },
    ],
    ...overrides,
  };
}

describe("getCareerById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when profession is not found", async () => {
    mockFindUnique.mockResolvedValue(null as never);

    const result = await getCareerById("nonexistent", "fr");

    expect(result).toBeNull();
  });

  it("returns the full career detail for a valid id", async () => {
    mockFindUnique.mockResolvedValue(mockProfession() as never);

    const result = await getCareerById("assc", "fr");

    expect(result).toEqual({
      id: "assc",
      icon: "🏥",
      type: "CFC",
      duration: 3,
      urlOrientation: "https://orientation.ch/assc",
      name: "Assistant/e en soins et santé communautaire",
      description: "Aide les patients au quotidien.",
      activities: ["Soins de base", "Prise de tension"],
      qualities: ["Empathie", "Rigueur"],
      passerelle: null,
      sectorId: "sante",
      sectorName: "Santé",
      sectorColor: "--color-sante",
      salary: {
        apprenticeYears: [
          { year: 1, amount: 1100 },
          { year: 2, amount: 1300 },
          { year: 3, amount: 1500 },
        ],
        postCfcMin: 4800,
        postCfcMax: 5500,
      },
      profile: {
        manuel: 3, intellectuel: 7, creatif: 2, analytique: 5,
        interieur: 8, exterieur: 2, equipe: 9, independant: 1,
        contactHumain: 10, technique: 4, routine: 5, variete: 5,
      },
    });
  });

  it("queries by id and filters translations by locale", async () => {
    mockFindUnique.mockResolvedValue(null as never);

    await getCareerById("assc", "de");

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: "assc" },
      include: {
        sector: {
          include: {
            translations: { where: { locale: "de" }, select: { name: true } },
          },
        },
        translations: {
          where: { locale: "de" },
        },
        salaries: true,
      },
    });
  });

  it("falls back to profession id when no translation exists", async () => {
    mockFindUnique.mockResolvedValue(
      mockProfession({ translations: [] }) as never
    );

    const result = await getCareerById("assc", "en");

    expect(result!.name).toBe("assc");
    expect(result!.description).toBe("");
    expect(result!.activities).toEqual([]);
    expect(result!.qualities).toEqual([]);
  });

  it("falls back to sector id when no sector translation exists", async () => {
    mockFindUnique.mockResolvedValue(
      mockProfession({
        sector: { id: "sante", color: "--color-sante", translations: [] },
      }) as never
    );

    const result = await getCareerById("assc", "en");

    expect(result!.sectorName).toBe("sante");
  });

  it("omits null apprentice years from salary", async () => {
    mockFindUnique.mockResolvedValue(
      mockProfession({
        salaries: [
          {
            apprenticeYear1: 800,
            apprenticeYear2: 1000,
            apprenticeYear3: null,
            apprenticeYear4: null,
            postCfcMin: 4000,
            postCfcMax: 5000,
          },
        ],
      }) as never
    );

    const result = await getCareerById("assc", "fr");

    expect(result!.salary!.apprenticeYears).toEqual([
      { year: 1, amount: 800 },
      { year: 2, amount: 1000 },
    ]);
  });

  it("returns null salary when no salary info exists", async () => {
    mockFindUnique.mockResolvedValue(
      mockProfession({ salaries: [] }) as never
    );

    const result = await getCareerById("assc", "fr");

    expect(result!.salary).toBeNull();
  });

  it("includes passerelle when present", async () => {
    mockFindUnique.mockResolvedValue(
      mockProfession({
        translations: [
          {
            name: "Polymécanicien/ne",
            description: "Fabrique des pièces.",
            activities: ["Usinage"],
            qualities: ["Précision"],
            passerelle: "Accès au brevet fédéral aéronautique",
          },
        ],
      }) as never
    );

    const result = await getCareerById("assc", "fr");

    expect(result!.passerelle).toBe("Accès au brevet fédéral aéronautique");
  });
});
