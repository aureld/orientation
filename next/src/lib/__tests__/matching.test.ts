import { describe, it, expect } from "vitest";
import { getMatchScore, getTopMatches, getRadarData } from "../matching";
import { emptyProfile, type ProfileVector } from "../profile-dimensions";

/** Helper: create a profile with specific dimension values, rest default to 0 */
function makeProfile(overrides: Partial<ProfileVector>): ProfileVector {
  return { ...emptyProfile(), ...overrides };
}

describe("getMatchScore", () => {
  it("returns 0 when player profile is all zeros", () => {
    const player = emptyProfile();
    const profession = makeProfile({ manuel: 8, creatif: 6 });
    expect(getMatchScore(player, profession)).toBe(0);
  });

  it("returns 0 when profession profile is all zeros", () => {
    const player = makeProfile({ manuel: 5, creatif: 7 });
    const profession = emptyProfile();
    expect(getMatchScore(player, profession)).toBe(0);
  });

  it("returns 100 for identical profiles (perfect cosine similarity)", () => {
    const profile = makeProfile({ manuel: 8, intellectuel: 3, creatif: 6 });
    expect(getMatchScore(profile, profile)).toBe(100);
  });

  it("returns 100 for proportionally scaled profiles (shape-based matching)", () => {
    const player = makeProfile({ manuel: 4, creatif: 3 });
    const profession = makeProfile({ manuel: 8, creatif: 6 });
    // Cosine similarity is magnitude-independent — same direction = 100
    expect(getMatchScore(player, profession)).toBe(100);
  });

  it("returns a lower score for orthogonal profiles", () => {
    const player = makeProfile({ manuel: 10 });
    const profession = makeProfile({ intellectuel: 10 });
    expect(getMatchScore(player, profession)).toBe(0);
  });

  it("returns a score between 0 and 100 for partially matching profiles", () => {
    const player = makeProfile({ manuel: 7, creatif: 5, equipe: 3 });
    const profession = makeProfile({ manuel: 6, analytique: 8, equipe: 4 });
    const score = getMatchScore(player, profession);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(100);
  });

  it("is symmetric — score(A,B) === score(B,A)", () => {
    const a = makeProfile({ manuel: 7, creatif: 5, equipe: 3 });
    const b = makeProfile({ intellectuel: 6, analytique: 8, technique: 4 });
    expect(getMatchScore(a, b)).toBe(getMatchScore(b, a));
  });
});

describe("getTopMatches", () => {
  const professions = [
    { id: "p1", profile: makeProfile({ manuel: 10, creatif: 2 }) },
    { id: "p2", profile: makeProfile({ intellectuel: 10, analytique: 8 }) },
    { id: "p3", profile: makeProfile({ manuel: 8, creatif: 5 }) },
    { id: "p4", profile: makeProfile({ equipe: 10, contactHumain: 9 }) },
    { id: "p5", profile: makeProfile({ technique: 10, routine: 7 }) },
  ];

  it("returns empty array for an all-zero player profile", () => {
    expect(getTopMatches(emptyProfile(), professions)).toEqual([]);
  });

  it("returns at most n results", () => {
    const player = makeProfile({ manuel: 8, creatif: 4 });
    expect(getTopMatches(player, professions, 3)).toHaveLength(3);
  });

  it("defaults to 5 results", () => {
    const player = makeProfile({ manuel: 5 });
    expect(getTopMatches(player, professions)).toHaveLength(5);
  });

  it("results are sorted by score descending", () => {
    const player = makeProfile({ manuel: 8, creatif: 4 });
    const matches = getTopMatches(player, professions, 5);
    for (let i = 1; i < matches.length; i++) {
      expect(matches[i - 1].score).toBeGreaterThanOrEqual(matches[i].score);
    }
  });

  it("ranks the most similar profession first", () => {
    const player = makeProfile({ manuel: 9, creatif: 3 });
    const matches = getTopMatches(player, professions, 1);
    // p1 (manuel:10, creatif:2) is closest to this player
    expect(matches[0].professionId).toBe("p1");
  });

  it("each result has professionId and score", () => {
    const player = makeProfile({ technique: 8 });
    const matches = getTopMatches(player, professions, 2);
    for (const m of matches) {
      expect(m).toHaveProperty("professionId");
      expect(m).toHaveProperty("score");
      expect(typeof m.score).toBe("number");
    }
  });

  it("skips professions with all-zero profiles", () => {
    const withZero = [...professions, { id: "p0", profile: emptyProfile() }];
    const player = makeProfile({ manuel: 5 });
    const matches = getTopMatches(player, withZero);
    const ids = matches.map((m) => m.professionId);
    expect(ids).not.toContain("p0");
  });
});

describe("getRadarData", () => {
  it("returns exactly 6 data points (one per radar axis)", () => {
    const profile = makeProfile({ manuel: 5, intellectuel: 5 });
    expect(getRadarData(profile)).toHaveLength(6);
  });

  it("returns 0.5 for a dimension pair where both values are 0", () => {
    const profile = emptyProfile();
    const data = getRadarData(profile);
    for (const d of data) {
      expect(d.value).toBe(0.5);
    }
  });

  it("returns 1.0 when dimension A is present and B is 0", () => {
    const profile = makeProfile({ manuel: 8 }); // intellectuel defaults to 0
    const data = getRadarData(profile);
    const manuelAxis = data.find((d) => d.labelKeyA === "dim.manuel");
    expect(manuelAxis?.value).toBe(1.0);
  });

  it("returns 0.0 when dimension B is present and A is 0", () => {
    const profile = makeProfile({ intellectuel: 8 }); // manuel defaults to 0
    const data = getRadarData(profile);
    const manuelAxis = data.find((d) => d.labelKeyA === "dim.manuel");
    // value = a / (a + b) = 0 / 8 = 0
    expect(manuelAxis?.value).toBe(0.0);
  });

  it("returns 0.5 when both dimensions in a pair are equal", () => {
    const profile = makeProfile({ manuel: 6, intellectuel: 6 });
    const data = getRadarData(profile);
    const axis = data.find((d) => d.labelKeyA === "dim.manuel");
    expect(axis?.value).toBe(0.5);
  });

  it("includes raw values for each pair", () => {
    const profile = makeProfile({ manuel: 7, intellectuel: 3 });
    const data = getRadarData(profile);
    const axis = data.find((d) => d.labelKeyA === "dim.manuel");
    expect(axis?.raw).toEqual({ a: 7, b: 3 });
  });

  it("value is always between 0 and 1", () => {
    const profile = makeProfile({
      manuel: 9,
      intellectuel: 1,
      creatif: 10,
      analytique: 0,
      equipe: 5,
      independant: 5,
    });
    const data = getRadarData(profile);
    for (const d of data) {
      expect(d.value).toBeGreaterThanOrEqual(0);
      expect(d.value).toBeLessThanOrEqual(1);
    }
  });
});
