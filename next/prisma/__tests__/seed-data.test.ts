import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const VALID_SECTORS = [
  "sante", "informatique", "commerce", "construction",
  "technique", "artisanat", "gastronomie", "nature",
  "social", "automobile", "aeronautique",
];

const VALID_DIMENSIONS = [
  "manuel", "intellectuel", "creatif", "analytique",
  "interieur", "exterieur", "equipe", "independant",
  "contactHumain", "technique", "routine", "variete",
];

function slugify(name: string): string {
  let slug = name.split(/\s+CFC/)[0].trim();
  slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  slug = slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return slug;
}

interface ScrapedProfession {
  name: string;
  url: string;
  orientationId: string;
  swissdoc: string;
  description: string;
  formation: string;
}

/**
 * Load professions from the scraped JSON and scenarios from seed.ts.
 */
function loadData() {
  // Load professions from scraped JSON
  const jsonPath = resolve(__dirname, "../../scripts/output/professions-cfc.json");
  const scrapedData: ScrapedProfession[] = JSON.parse(readFileSync(jsonPath, "utf-8"));
  const professions = scrapedData.map((p) => ({
    id: slugify(p.name),
    name: p.name,
    swissdoc: p.swissdoc,
    url: p.url,
  }));

  // Parse scenarios from seed.ts
  const seedPath = resolve(__dirname, "../seed.ts");
  const content = readFileSync(seedPath, "utf-8");

  const scenariosMatch = content.match(
    /const scenarios = \[([\s\S]*?)\n\];/
  );

  interface ParsedScene {
    sceneKey: string;
    isFinal: boolean;
    resumeProfessions: string[];
    choices: { suite: string | null; tagKeys: string[] }[];
  }

  interface ParsedScenario {
    id: string;
    sectorId: string;
    scenes: ParsedScene[];
  }

  const scenarios: ParsedScenario[] = [];

  if (scenariosMatch) {
    const scenRaw = scenariosMatch[1];
    const scenarioBlocks = scenRaw.split(/\n  \{[\s\n]*id:/);
    for (const block of scenarioBlocks) {
      const idMatch = block.match(/^\s*"([^"]+)"/);
      if (!idMatch) continue;
      const id = idMatch[1];
      const sectorMatch = block.match(/sectorId:\s*"([^"]+)"/);
      const sectorId = sectorMatch?.[1] ?? "";

      const scenes: ParsedScene[] = [];
      const sceneBlocks = block.split(/\{\s*sceneKey:\s*"/);
      for (const sceneBlock of sceneBlocks.slice(1)) {
        const keyMatch = sceneBlock.match(/^([^"]+)"/);
        if (!keyMatch) continue;
        const sceneKey = keyMatch[1];
        const isFinal = /isFinal:\s*true/.test(sceneBlock);
        const resumeMatch = sceneBlock.match(/resumeProfessions:\s*\[([^\]]*)\]/);
        const resumeProfessions = resumeMatch
          ? [...resumeMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
          : [];

        const choices: { suite: string | null; tagKeys: string[] }[] = [];
        const choiceBlocks = sceneBlock.split(/\{\s*text:/);
        for (const choiceBlock of choiceBlocks.slice(1)) {
          const suiteMatch = choiceBlock.match(/nextSceneKey:\s*"([^"]+)"/);
          const tagMatches = [
            ...choiceBlock.matchAll(/(manuel|intellectuel|creatif|analytique|interieur|exterieur|equipe|independant|contactHumain|technique|routine|variete):\s*\d/g),
          ];
          choices.push({
            suite: suiteMatch?.[1] ?? null,
            tagKeys: tagMatches.map((m) => m[1]),
          });
        }

        scenes.push({ sceneKey, isFinal, resumeProfessions, choices });
      }

      scenarios.push({ id, sectorId, scenes });
    }
  }

  return { professions, scenarios, professionIds: new Set(professions.map((p) => p.id)) };
}

const { professions, scenarios, professionIds } = loadData();

// ─── Profession tests ──────────────────────────────────

describe("seed data: professions (from scraped JSON)", () => {
  it("loads all professions from JSON", () => {
    expect(professions.length).toBe(187);
  });

  it("has no duplicate profession IDs", () => {
    const ids = professions.map((p) => p.id);
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(duplicates).toEqual([]);
  });

  it("has no duplicate swissdoc codes", () => {
    const codes = professions.map((p) => p.swissdoc);
    const duplicates = codes.filter((c, i) => codes.indexOf(c) !== i);
    expect(duplicates).toEqual([]);
  });

  it("has no duplicate orientation.ch URLs", () => {
    const urls = professions.map((p) => p.url);
    const duplicates = urls.filter((u, i) => urls.indexOf(u) !== i);
    expect(duplicates).toEqual([]);
  });

  it("every profession name includes CFC", () => {
    for (const p of professions) {
      expect(p.name, `${p.id}: "${p.name}"`).toContain("CFC");
    }
  });
});

// ─── Scenario tests ────────────────────────────────────

describe("seed data: scenarios", () => {
  it("parses all scenarios from seed file", () => {
    expect(scenarios.length).toBe(11);
  });

  it("has no duplicate scenario IDs", () => {
    const ids = scenarios.map((s) => s.id);
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(duplicates).toEqual([]);
  });

  it("every scenario references a valid sector", () => {
    for (const s of scenarios) {
      expect(VALID_SECTORS, `scenario "${s.id}" → "${s.sectorId}"`).toContain(s.sectorId);
    }
  });

  it("every scenario has at least 3 scenes", () => {
    for (const s of scenarios) {
      expect(s.scenes.length, `scenario "${s.id}"`).toBeGreaterThanOrEqual(3);
    }
  });

  it("every scenario has no duplicate scene keys", () => {
    for (const s of scenarios) {
      const keys = s.scenes.map((sc) => sc.sceneKey);
      const duplicates = keys.filter((k, i) => keys.indexOf(k) !== i);
      expect(duplicates, `scenario "${s.id}"`).toEqual([]);
    }
  });

  it("every scenario has at least one final scene", () => {
    for (const s of scenarios) {
      const finals = s.scenes.filter((sc) => sc.isFinal);
      expect(finals.length, `scenario "${s.id}"`).toBeGreaterThanOrEqual(1);
    }
  });

  it("every final scene has resumeProfessions", () => {
    for (const s of scenarios) {
      for (const sc of s.scenes.filter((sc) => sc.isFinal)) {
        expect(
          sc.resumeProfessions.length,
          `scenario "${s.id}" scene "${sc.sceneKey}"`
        ).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("every resumeProfession references a valid profession ID", () => {
    const invalid: string[] = [];
    for (const s of scenarios) {
      for (const sc of s.scenes) {
        for (const profId of sc.resumeProfessions) {
          if (!professionIds.has(profId)) {
            invalid.push(`scenario "${s.id}" scene "${sc.sceneKey}" → "${profId}"`);
          }
        }
      }
    }
    expect(invalid).toEqual([]);
  });

  it("every non-final scene has at least one choice", () => {
    for (const s of scenarios) {
      for (const sc of s.scenes.filter((sc) => !sc.isFinal)) {
        expect(
          sc.choices.length,
          `scenario "${s.id}" scene "${sc.sceneKey}"`
        ).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("every choice nextSceneKey references a valid scene within the scenario", () => {
    const invalid: string[] = [];
    for (const s of scenarios) {
      const sceneKeys = new Set(s.scenes.map((sc) => sc.sceneKey));
      for (const sc of s.scenes) {
        for (const choice of sc.choices) {
          if (choice.suite && !sceneKeys.has(choice.suite)) {
            invalid.push(
              `scenario "${s.id}" scene "${sc.sceneKey}" → nextSceneKey "${choice.suite}"`
            );
          }
        }
      }
    }
    expect(invalid).toEqual([]);
  });

  it("every choice tag uses a valid dimension name", () => {
    const invalid: string[] = [];
    for (const s of scenarios) {
      for (const sc of s.scenes) {
        for (const choice of sc.choices) {
          for (const key of choice.tagKeys) {
            if (!VALID_DIMENSIONS.includes(key)) {
              invalid.push(`scenario "${s.id}" scene "${sc.sceneKey}" → tag "${key}"`);
            }
          }
        }
      }
    }
    expect(invalid).toEqual([]);
  });
});
