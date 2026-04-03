import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db", () => ({
  prisma: {
    profession: {
      findMany: vi.fn(),
    },
  },
}));

import { getAllCareers } from "../careers";
import { prisma } from "@/lib/db";

const mockFindMany = vi.mocked(prisma.profession.findMany);

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
    icon: overrides.icon ?? "💼",
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
    mockFindMany.mockResolvedValue([
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

  it("sorts groups in canonical swissdoc order (100 → 800)", async () => {
    mockFindMany.mockResolvedValue([
      mockProfession({ id: "a", swissdocGroup: "800", name: "A" }),
      mockProfession({ id: "b", swissdocGroup: "100", name: "B" }),
      mockProfession({ id: "c", swissdocGroup: "400", name: "C" }),
    ] as never);

    const result = await getAllCareers("fr");

    expect(result.groups.map((g) => g.groupCode)).toEqual(["100", "400", "800"]);
  });

  it("sorts professions alphabetically by name within each group", async () => {
    mockFindMany.mockResolvedValue([
      mockProfession({ id: "z", swissdocGroup: "500", name: "Zingueur CFC" }),
      mockProfession({ id: "a", swissdocGroup: "500", name: "Automaticien CFC" }),
    ] as never);

    const result = await getAllCareers("fr");

    expect(result.groups[0].professions.map((p) => p.name)).toEqual([
      "Automaticien CFC",
      "Zingueur CFC",
    ]);
  });

  it("uses swissdoc group labels as domain names", async () => {
    mockFindMany.mockResolvedValue([
      mockProfession({ id: "a", swissdocGroup: "100", name: "Agriculteur CFC" }),
    ] as never);

    const result = await getAllCareers("fr");

    expect(result.groups[0].domain).toBe("Nature");
  });

  it("falls back to profession id when no translation exists", async () => {
    mockFindMany.mockResolvedValue([
      mockProfession({ id: "some-prof", swissdocGroup: "400" }),
    ] as never);

    const result = await getAllCareers("fr");

    expect(result.groups[0].professions[0].name).toBe("some-prof");
  });

  it("queries professions with translations filtered by locale", async () => {
    mockFindMany.mockResolvedValue([] as never);

    await getAllCareers("de");

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          translations: expect.objectContaining({
            where: { locale: "de" },
          }),
        }),
      })
    );
  });
});
