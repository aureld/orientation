import { describe, it, expect } from "vitest";
import { accumulateProfile } from "../accumulate";
import { emptyProfile, type ProfileVector } from "../dimensions";

function makeProfile(overrides: Partial<ProfileVector>): ProfileVector {
  return { ...emptyProfile(), ...overrides };
}

describe("accumulateProfile", () => {
  it("returns the tags when accumulating onto an empty profile", () => {
    const tags = makeProfile({ manuel: 2, creatif: 3 });
    const result = accumulateProfile(emptyProfile(), tags);
    expect(result.manuel).toBe(2);
    expect(result.creatif).toBe(3);
    expect(result.analytique).toBe(0);
  });

  it("sums dimension values from multiple accumulations", () => {
    const profile = makeProfile({ manuel: 5, equipe: 3 });
    const tags = makeProfile({ manuel: 2, equipe: 1, technique: 4 });
    const result = accumulateProfile(profile, tags);
    expect(result.manuel).toBe(7);
    expect(result.equipe).toBe(4);
    expect(result.technique).toBe(4);
  });

  it("returns the profile unchanged when tags are all zero", () => {
    const profile = makeProfile({ contactHumain: 8, variete: 5 });
    const result = accumulateProfile(profile, emptyProfile());
    expect(result).toEqual(profile);
  });

  it("returns a new object (immutable)", () => {
    const profile = makeProfile({ manuel: 1 });
    const tags = makeProfile({ manuel: 1 });
    const result = accumulateProfile(profile, tags);
    expect(result).not.toBe(profile);
    expect(result).not.toBe(tags);
    expect(profile.manuel).toBe(1); // original unchanged
  });

  it("allows values to exceed 10 (accumulated sums are unbounded)", () => {
    const profile = makeProfile({ intellectuel: 9 });
    const tags = makeProfile({ intellectuel: 5 });
    const result = accumulateProfile(profile, tags);
    expect(result.intellectuel).toBe(14);
  });

  it("preserves all 12 dimensions", () => {
    const profile = makeProfile({
      manuel: 1, intellectuel: 2, creatif: 3, analytique: 4,
      interieur: 5, exterieur: 6, equipe: 7, independant: 8,
      contactHumain: 9, technique: 10, routine: 11, variete: 12,
    });
    const tags = makeProfile({
      manuel: 1, intellectuel: 1, creatif: 1, analytique: 1,
      interieur: 1, exterieur: 1, equipe: 1, independant: 1,
      contactHumain: 1, technique: 1, routine: 1, variete: 1,
    });
    const result = accumulateProfile(profile, tags);
    expect(Object.keys(result)).toHaveLength(12);
    expect(result.manuel).toBe(2);
    expect(result.variete).toBe(13);
  });
});
