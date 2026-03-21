import { describe, it, expect } from "vitest";
import {
  DIMENSIONS,
  RADAR_PAIRS,
  emptyProfile,
  type ProfileVector,
} from "../profile-dimensions";

describe("DIMENSIONS", () => {
  it("has exactly 12 dimensions", () => {
    expect(DIMENSIONS).toHaveLength(12);
  });

  it("contains all expected dimension keys", () => {
    const expected = [
      "manuel",
      "intellectuel",
      "creatif",
      "analytique",
      "interieur",
      "exterieur",
      "equipe",
      "independant",
      "contactHumain",
      "technique",
      "routine",
      "variete",
    ];
    expect([...DIMENSIONS]).toEqual(expected);
  });

  it("has no duplicate dimensions", () => {
    const unique = new Set(DIMENSIONS);
    expect(unique.size).toBe(DIMENSIONS.length);
  });
});

describe("RADAR_PAIRS", () => {
  it("has exactly 6 pairs (one per radar axis)", () => {
    expect(RADAR_PAIRS).toHaveLength(6);
  });

  it("each pair references valid dimensions", () => {
    for (const pair of RADAR_PAIRS) {
      expect(DIMENSIONS).toContain(pair.a);
      expect(DIMENSIONS).toContain(pair.b);
    }
  });

  it("covers all 12 dimensions across all pairs", () => {
    const covered = new Set<string>();
    for (const pair of RADAR_PAIRS) {
      covered.add(pair.a);
      covered.add(pair.b);
    }
    expect(covered.size).toBe(12);
  });

  it("each pair has i18n label keys", () => {
    for (const pair of RADAR_PAIRS) {
      expect(pair.labelKeyA).toMatch(/^dim\./);
      expect(pair.labelKeyB).toMatch(/^dim\./);
    }
  });
});

describe("emptyProfile", () => {
  it("returns a profile with all dimensions set to 0", () => {
    const profile = emptyProfile();
    for (const d of DIMENSIONS) {
      expect(profile[d]).toBe(0);
    }
  });

  it("returns a new object each time (no shared reference)", () => {
    const a = emptyProfile();
    const b = emptyProfile();
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });

  it("has exactly 12 keys", () => {
    const profile = emptyProfile();
    expect(Object.keys(profile)).toHaveLength(12);
  });
});
