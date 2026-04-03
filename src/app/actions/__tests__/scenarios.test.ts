import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db", () => ({
  prisma: {
    scenario: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import { getScenarioList, getScenarioById } from "../scenarios";
import { prisma } from "@/lib/db";

const mockFindMany = vi.mocked(prisma.scenario.findMany);
const mockFindUnique = vi.mocked(prisma.scenario.findUnique);

describe("getScenarioList", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns all scenarios with title and description", async () => {
    mockFindMany.mockResolvedValue([
      {
        id: "hopital", icon: "🏥", sectorId: "sante",
        sector: { id: "sante", color: "--color-sante", translations: [{ name: "Santé" }] },
        translations: [{ title: "Une journée à l'hôpital", description: "Découvre les coulisses..." }],
      },
    ] as never);

    const result = await getScenarioList("fr");

    expect(result).toEqual([{
      id: "hopital",
      icon: "🏥",
      sectorId: "sante",
      sectorName: "Santé",
      sectorColor: "--color-sante",
      title: "Une journée à l'hôpital",
      description: "Découvre les coulisses...",
    }]);
  });

  it("falls back to scenario id when no translation exists", async () => {
    mockFindMany.mockResolvedValue([
      {
        id: "hopital", icon: "🏥", sectorId: "sante",
        sector: { id: "sante", color: "--color-sante", translations: [] },
        translations: [],
      },
    ] as never);

    const result = await getScenarioList("de");

    expect(result[0].title).toBe("hopital");
    expect(result[0].description).toBe("");
    expect(result[0].sectorName).toBe("sante");
  });

  it("filters translations by locale", async () => {
    mockFindMany.mockResolvedValue([] as never);

    await getScenarioList("de");

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

describe("getScenarioById", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns null when scenario is not found", async () => {
    mockFindUnique.mockResolvedValue(null as never);

    const result = await getScenarioById("nonexistent", "fr");
    expect(result).toBeNull();
  });

  it("returns the full scenario with scenes and choices", async () => {
    mockFindUnique.mockResolvedValue({
      id: "hopital", icon: "🏥", sectorId: "sante",
      translations: [{ title: "Une journée à l'hôpital", description: "Desc" }],
      scenes: [
        {
          id: "scene-1", sceneKey: "arrivee", isFinal: false, sortOrder: 0,
          translations: [{ text: "Tu arrives à l'hôpital." }],
          choices: [
            {
              id: "choice-1", nextSceneKey: "urgences1", sortOrder: 0,
              manuel: 0, intellectuel: 0, creatif: 0, analytique: 0,
              interieur: 0, exterieur: 0, equipe: 1, independant: 0,
              contactHumain: 2, technique: 0, routine: 0, variete: 2,
              translations: [{ text: "Les urgences !" }],
            },
          ],
          endProfessions: [],
        },
        {
          id: "scene-2", sceneKey: "urgences1", isFinal: true, sortOrder: 1,
          translations: [{ text: "Fin des urgences." }],
          choices: [],
          endProfessions: [
            { profession: { id: "assc", icon: "⚕️", type: "CFC", duration: 3, translations: [{ name: "ASSC" }] } },
          ],
        },
      ],
    } as never);

    const result = await getScenarioById("hopital", "fr");

    expect(result).not.toBeNull();
    expect(result!.id).toBe("hopital");
    expect(result!.title).toBe("Une journée à l'hôpital");
    expect(result!.scenes).toHaveLength(2);

    // First scene
    const scene0 = result!.scenes[0];
    expect(scene0.sceneKey).toBe("arrivee");
    expect(scene0.text).toBe("Tu arrives à l'hôpital.");
    expect(scene0.isFinal).toBe(false);
    expect(scene0.choices).toHaveLength(1);
    expect(scene0.choices[0].text).toBe("Les urgences !");
    expect(scene0.choices[0].nextSceneKey).toBe("urgences1");
    expect(scene0.choices[0].tags.contactHumain).toBe(2);

    // Final scene
    const scene1 = result!.scenes[1];
    expect(scene1.isFinal).toBe(true);
    expect(scene1.endProfessions).toEqual([
      { id: "assc", icon: "⚕️", type: "CFC", duration: 3, name: "ASSC" },
    ]);
  });
});
