// @vitest-environment node
import { describe, it, expect } from "vitest";
import { AVATARS, DEFAULT_AVATAR, isValidAvatar } from "../avatars";

describe("avatars", () => {
  it("has at least 10 avatar options", () => {
    expect(AVATARS.length).toBeGreaterThanOrEqual(10);
  });

  it("has no duplicates", () => {
    const unique = new Set(AVATARS);
    expect(unique.size).toBe(AVATARS.length);
  });

  it("DEFAULT_AVATAR is in the list", () => {
    expect(AVATARS).toContain(DEFAULT_AVATAR);
  });

  it("validates known avatars", () => {
    expect(isValidAvatar(AVATARS[0])).toBe(true);
    expect(isValidAvatar(AVATARS[AVATARS.length - 1])).toBe(true);
  });

  it("rejects unknown strings", () => {
    expect(isValidAvatar("not-an-avatar")).toBe(false);
    expect(isValidAvatar("")).toBe(false);
  });
});
