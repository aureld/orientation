import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/repositories/profession-repository", () => ({
  findProfessionById: vi.fn(),
}));

import { getCareerById } from "../career";
import { findProfessionById } from "@/repositories/profession-repository";

const mockFindProfessionById = vi.mocked(findProfessionById);

/** Helper to build a full mock profession row */
function mockProfession(overrides: Record<string, unknown> = {}) {
  return {
    id: "assc",
    sectorId: "sante",
    type: "CFC",
    duration: 3,
    icon: "\u{1F3E5}",
    urlOrientation: "https://orientation.ch/assc",
    manuel: 3, intellectuel: 7, creatif: 2, analytique: 5,
    interieur: 8, exterieur: 2, equipe: 9, independant: 1,
    contactHumain: 10, technique: 4, routine: 5, variete: 5,
    sector: {
      id: "sante",
      color: "--color-sante",
      translations: [{ name: "Sant\u00e9" }],
    },
    translations: [
      {
        name: "Assistant/e en soins et sant\u00e9 communautaire",
        description: "Aide les patients au quotidien.",
        activities: ["Soins de base", "Prise de tension"],
        qualities: ["Empathie", "Rigueur"],
        passerelle: null,
        orientationUrl: null,
        orientationId: null,
        domainesProfessionnels: "M\u00e9decine, sant\u00e9",
        descriptionFull: "Full description from orientation.ch",
        formation: "Formation details",
        perspectivesProfessionnelles: "Perspectives details",
        autresInformations: "Autres infos",
        adressesUtiles: "Adresses",
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
    mockFindProfessionById.mockResolvedValue(null);

    const result = await getCareerById("nonexistent", "fr");

    expect(result).toBeNull();
  });

  it("returns the full career detail for a valid id", async () => {
    mockFindProfessionById.mockResolvedValue(mockProfession() as never);

    const result = await getCareerById("assc", "fr");

    expect(result).toEqual({
      id: "assc",
      icon: "\u{1F3E5}",
      type: "CFC",
      duration: 3,
      urlOrientation: "https://orientation.ch/assc",
      name: "Assistant/e en soins et sant\u00e9 communautaire",
      description: "Aide les patients au quotidien.",
      activities: ["Soins de base", "Prise de tension"],
      qualities: ["Empathie", "Rigueur"],
      passerelle: null,
      sectorId: "sante",
      sectorName: "Sant\u00e9",
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
      domainesProfessionnels: "M\u00e9decine, sant\u00e9",
      descriptionFull: "Full description from orientation.ch",
      formation: "Formation details",
      perspectivesProfessionnelles: "Perspectives details",
      autresInformations: "Autres infos",
      adressesUtiles: "Adresses",
    });
  });

  it("delegates to repository with id and locale", async () => {
    mockFindProfessionById.mockResolvedValue(null);

    await getCareerById("assc", "de");

    expect(mockFindProfessionById).toHaveBeenCalledWith("assc", "de");
  });

  it("falls back to profession id when no translation exists", async () => {
    mockFindProfessionById.mockResolvedValue(
      mockProfession({ translations: [] }) as never
    );

    const result = await getCareerById("assc", "en");

    expect(result!.name).toBe("assc");
    expect(result!.description).toBe("");
    expect(result!.activities).toEqual([]);
    expect(result!.qualities).toEqual([]);
  });

  it("falls back to sector id when no sector translation exists", async () => {
    mockFindProfessionById.mockResolvedValue(
      mockProfession({
        sector: { id: "sante", color: "--color-sante", translations: [] },
      }) as never
    );

    const result = await getCareerById("assc", "en");

    expect(result!.sectorName).toBe("sante");
  });

  it("omits null apprentice years from salary", async () => {
    mockFindProfessionById.mockResolvedValue(
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
    mockFindProfessionById.mockResolvedValue(
      mockProfession({ salaries: [] }) as never
    );

    const result = await getCareerById("assc", "fr");

    expect(result!.salary).toBeNull();
  });

  it("includes passerelle when present", async () => {
    mockFindProfessionById.mockResolvedValue(
      mockProfession({
        translations: [
          {
            name: "Polym\u00e9canicien/ne",
            description: "Fabrique des pi\u00e8ces.",
            activities: ["Usinage"],
            qualities: ["Pr\u00e9cision"],
            passerelle: "Acc\u00e8s au brevet f\u00e9d\u00e9ral a\u00e9ronautique",
          },
        ],
      }) as never
    );

    const result = await getCareerById("assc", "fr");

    expect(result!.passerelle).toBe("Acc\u00e8s au brevet f\u00e9d\u00e9ral a\u00e9ronautique");
  });
});
