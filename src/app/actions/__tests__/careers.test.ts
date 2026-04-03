import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/repositories/profession-repository", () => ({
  findAllProfessions: vi.fn(),
}));

import { getAllCareers } from "../careers";
import { findAllProfessions } from "@/repositories/profession-repository";

const mockFindAllProfessions = vi.mocked(findAllProfessions);

function mockProfession(overrides: {
  id: string;
  swissdocGroup?: string | null;
  name?: string;
  icon?: string;
  type?: string;
  duration?: number;
}) {
  return {
    id: overrides.id,
    sectorId: null,
    type: overrides.type ?? "CFC",
    duration: overrides.duration ?? 3,
    icon: overrides.icon ?? "\u{1F4BC}",
    urlOrientation: null,
    swissdoc: null,
    swissdocGroup: overrides.swissdocGroup ?? null,
    manuel: 0, intellectuel: 0, creatif: 0, analytique: 0,
    interieur: 0, exterieur: 0, equipe: 0, independant: 0,
    contactHumain: 0, technique: 0, routine: 0, variete: 0,
    translations: overrides.name ? [{ name: overrides.name }] : [],
  };
}

describe("getAllCareers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns professions grouped by swissdocGroup", async () => {
    mockFindAllProfessions.mockResolvedValue([
      mockProfession({ id: "informaticien", swissdocGroup: "500", name: "Informaticien CFC" }),
      mockProfession({ id: "cuisinier", swissdocGroup: "200", name: "Cuisinier CFC" }),
      mockProfession({ id: "automaticien", swissdocGroup: "500", name: "Automaticien CFC" }),
    ] as never);

    const result = await getAllCareers("fr");

    expect(result.total).toBe(3);
    expect(result.groups).toHaveLength(2);
    // Groups follow canonical order (200 before 500)
    expect(result.groups[0].groupCode).toBe("200");
    expect(result.groups[0].professions).toHaveLength(1);
    expect(result.groups[1].groupCode).toBe("500");
    expect(result.groups[1].professions).toHaveLength(2);
  });

  it("sorts groups in canonical swissdoc order (100 \u2192 800)", async () => {
    mockFindAllProfessions.mockResolvedValue([
      mockProfession({ id: "a", swissdocGroup: "800", name: "A" }),
      mockProfession({ id: "b", swissdocGroup: "100", name: "B" }),
      mockProfession({ id: "c", swissdocGroup: "400", name: "C" }),
    ] as never);

    const result = await getAllCareers("fr");

    expect(result.groups.map((g) => g.groupCode)).toEqual(["100", "400", "800"]);
  });

  it("sorts professions alphabetically by name within each group", async () => {
    mockFindAllProfessions.mockResolvedValue([
      mockProfession({ id: "z", swissdocGroup: "500", name: "Zingueur CFC" }),
      mockProfession({ id: "a", swissdocGroup: "500", name: "Automaticien CFC" }),
    ] as never);

    const result = await getAllCareers("fr");

    expect(result.groups[0].professions.map((p) => p.name)).toEqual([
      "Automaticien CFC",
      "Zingueur CFC",
    ]);
  });

  it("uses group code as domain identifier", async () => {
    mockFindAllProfessions.mockResolvedValue([
      mockProfession({ id: "a", swissdocGroup: "100", name: "Agriculteur CFC" }),
    ] as never);

    const result = await getAllCareers("fr");

    expect(result.groups[0].domain).toBe("100");
    expect(result.groups[0].groupCode).toBe("100");
  });

  it("falls back to profession id when no translation exists", async () => {
    mockFindAllProfessions.mockResolvedValue([
      mockProfession({ id: "some-prof", swissdocGroup: "400" }),
    ] as never);

    const result = await getAllCareers("fr");

    expect(result.groups[0].professions[0].name).toBe("some-prof");
  });

  it("delegates to repository with locale", async () => {
    mockFindAllProfessions.mockResolvedValue([] as never);

    await getAllCareers("de");

    expect(mockFindAllProfessions).toHaveBeenCalledWith("de");
  });
});
