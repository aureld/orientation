import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * We parse the seed file to extract professions data for validation.
 * This avoids importing it (which would trigger DB connections).
 */
function parseSeedProfessions() {
  const seedPath = resolve(__dirname, "../seed.ts");
  const content = readFileSync(seedPath, "utf-8");

  // Extract the professions array using a regex approach
  const professionsMatch = content.match(
    /const professions = \[([\s\S]*?)\n\];/
  );
  if (!professionsMatch) throw new Error("Could not find professions array in seed.ts");

  // Extract individual profession objects — look for urlOrientation, id, name, duration, type
  const professions: {
    id: string;
    urlOrientation: string;
    name: string;
    duration: number;
    type: string;
    sectorId: string;
  }[] = [];

  const idPattern = /id:\s*"([^"]+)"/g;
  const urlPattern = /urlOrientation:\s*"([^"]+)"/g;
  const namePattern = /name:\s*"([^"]+)"/g;
  const durationPattern = /duration:\s*(\d+)/g;
  const typePattern = /type:\s*"([^"]+)"/g;
  const sectorPattern = /sectorId:\s*"([^"]+)"/g;

  const raw = professionsMatch[1];
  const ids = [...raw.matchAll(idPattern)].map((m) => m[1]);
  const urls = [...raw.matchAll(urlPattern)].map((m) => m[1]);
  const names = [...raw.matchAll(namePattern)].map((m) => m[1]);
  const durations = [...raw.matchAll(durationPattern)].map((m) => Number(m[1]));
  const types = [...raw.matchAll(typePattern)].map((m) => m[1]);
  const sectors = [...raw.matchAll(sectorPattern)].map((m) => m[1]);

  for (let i = 0; i < ids.length; i++) {
    professions.push({
      id: ids[i],
      urlOrientation: urls[i],
      name: names[i],
      duration: durations[i],
      type: types[i],
      sectorId: sectors[i],
    });
  }

  return professions;
}

describe("seed data integrity", () => {
  const professions = parseSeedProfessions();

  it("parses all professions from seed file", () => {
    expect(professions.length).toBeGreaterThan(0);
  });

  it("has no duplicate profession IDs", () => {
    const ids = professions.map((p) => p.id);
    const unique = new Set(ids);
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(duplicates).toEqual([]);
    expect(unique.size).toBe(ids.length);
  });

  it("has no duplicate orientation.ch URLs", () => {
    const urlMap = new Map<string, string[]>();
    for (const p of professions) {
      const ids = urlMap.get(p.urlOrientation) ?? [];
      ids.push(p.id);
      urlMap.set(p.urlOrientation, ids);
    }
    const duplicates = [...urlMap.entries()]
      .filter(([, ids]) => ids.length > 1)
      .map(([url, ids]) => `${url} used by: ${ids.join(", ")}`);
    expect(duplicates).toEqual([]);
  });

  it("every profession references a valid sector", () => {
    const validSectors = [
      "sante", "informatique", "commerce", "construction",
      "technique", "artisanat", "gastronomie", "nature",
      "social", "automobile", "aeronautique",
    ];
    for (const p of professions) {
      expect(validSectors, `${p.id} has invalid sector "${p.sectorId}"`).toContain(p.sectorId);
    }
  });

  it("every profession has a valid type", () => {
    const validTypes = ["CFC", "AFP"];
    for (const p of professions) {
      expect(validTypes, `${p.id} has invalid type "${p.type}"`).toContain(p.type);
    }
  });

  it("every profession has a duration between 2 and 4 years", () => {
    for (const p of professions) {
      expect(p.duration, `${p.id} has duration ${p.duration}`).toBeGreaterThanOrEqual(2);
      expect(p.duration, `${p.id} has duration ${p.duration}`).toBeLessThanOrEqual(4);
    }
  });

  it("every profession name includes the type suffix", () => {
    for (const p of professions) {
      expect(p.name, `${p.id} name "${p.name}" should include "${p.type}"`).toContain(p.type);
    }
  });
});
