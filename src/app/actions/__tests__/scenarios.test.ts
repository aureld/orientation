import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/repositories/scenario-repository", () => ({
  findAllScenarios: vi.fn(),
  findScenarioById: vi.fn(),
}));

import { getScenarioList, getScenarioById } from "../scenarios";
import { findAllScenarios, findScenarioById } from "@/repositories/scenario-repository";

const mockFindAllScenarios = vi.mocked(findAllScenarios);
const mockFindScenarioById = vi.mocked(findScenarioById);

describe("getScenarioList", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns all scenarios with title and description", async () => {
    mockFindAllScenarios.mockResolvedValue([
      {
        id: "hopital", icon: "\u{1F3E5}", sectorId: "sante",
        sector: { id: "sante", color: "--color-sante", translations: [{ name: "Sant\u00e9" }] },
        translations: [{ title: "Une journ\u00e9e \u00e0 l'h\u00f4pital", description: "D\u00e9couvre les coulisses..." }],
      },
    ] as never);

    const result = await getScenarioList("fr");

    expect(result).toEqual([{
      id: "hopital",
      icon: "\u{1F3E5}",
      sectorId: "sante",
      sectorName: "Sant\u00e9",
      sectorColor: "--color-sante",
      title: "Une journ\u00e9e \u00e0 l'h\u00f4pital",
      description: "D\u00e9couvre les coulisses...",
    }]);
  });

  it("falls back to scenario id when no translation exists", async () => {
    mockFindAllScenarios.mockResolvedValue([
      {
        id: "hopital", icon: "\u{1F3E5}", sectorId: "sante",
        sector: { id: "sante", color: "--color-sante", translations: [] },
        translations: [],
      },
    ] as never);

    const result = await getScenarioList("de");

    expect(result[0].title).toBe("hopital");
    expect(result[0].description).toBe("");
    expect(result[0].sectorName).toBe("sante");
  });

  it("delegates to repository with locale", async () => {
    mockFindAllScenarios.mockResolvedValue([] as never);

    await getScenarioList("de");

    expect(mockFindAllScenarios).toHaveBeenCalledWith("de");
  });
});

describe("getScenarioById", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns null when scenario is not found", async () => {
    mockFindScenarioById.mockResolvedValue(null);

    const result = await getScenarioById("nonexistent", "fr");
    expect(result).toBeNull();
  });

  it("returns the full scenario with scenes and choices", async () => {
    mockFindScenarioById.mockResolvedValue({
      id: "hopital", icon: "\u{1F3E5}", sectorId: "sante",
      translations: [{ title: "Une journ\u00e9e \u00e0 l'h\u00f4pital", description: "Desc" }],
      scenes: [
        {
          id: "scene-1", sceneKey: "arrivee", isFinal: false, sortOrder: 0,
          translations: [{ text: "Tu arrives \u00e0 l'h\u00f4pital." }],
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
            { profession: { id: "assc", icon: "\u2695\uFE0F", type: "CFC", duration: 3, translations: [{ name: "ASSC" }] } },
          ],
        },
      ],
    } as never);

    const result = await getScenarioById("hopital", "fr");

    expect(result).not.toBeNull();
    expect(result!.id).toBe("hopital");
    expect(result!.title).toBe("Une journ\u00e9e \u00e0 l'h\u00f4pital");
    expect(result!.scenes).toHaveLength(2);

    // First scene
    const scene0 = result!.scenes[0];
    expect(scene0.sceneKey).toBe("arrivee");
    expect(scene0.text).toBe("Tu arrives \u00e0 l'h\u00f4pital.");
    expect(scene0.isFinal).toBe(false);
    expect(scene0.choices).toHaveLength(1);
    expect(scene0.choices[0].text).toBe("Les urgences !");
    expect(scene0.choices[0].nextSceneKey).toBe("urgences1");
    expect(scene0.choices[0].tags.contactHumain).toBe(2);

    // Final scene
    const scene1 = result!.scenes[1];
    expect(scene1.isFinal).toBe(true);
    expect(scene1.endProfessions).toEqual([
      { id: "assc", icon: "\u2695\uFE0F", type: "CFC", duration: 3, name: "ASSC" },
    ]);
  });
});
