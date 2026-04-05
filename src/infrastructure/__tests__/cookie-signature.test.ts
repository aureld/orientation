import { describe, it, expect, vi, beforeEach } from "vitest";

vi.stubEnv("AUTH_SECRET", "test-secret-for-unit-tests-only");

import { signCookie, verifyCookie } from "../cookie-signature";

describe("cookie-signature", () => {
  describe("signCookie", () => {
    it("returns value.signature format", () => {
      const signed = signCookie("user-123");
      expect(signed).toContain(".");
      expect(signed.split(".")[0]).toBe("user-123");
    });

    it("produces consistent signatures for the same value", () => {
      expect(signCookie("user-123")).toBe(signCookie("user-123"));
    });

    it("produces different signatures for different values", () => {
      expect(signCookie("user-123")).not.toBe(signCookie("user-456"));
    });
  });

  describe("verifyCookie", () => {
    it("returns the original value for a valid signed cookie", () => {
      const signed = signCookie("user-123");
      expect(verifyCookie(signed)).toBe("user-123");
    });

    it("returns null for an unsigned value (no dot)", () => {
      expect(verifyCookie("user-123")).toBeNull();
    });

    it("returns null for a forged signature", () => {
      expect(verifyCookie("user-123.forged-signature")).toBeNull();
    });

    it("returns null for a tampered value with valid-looking signature", () => {
      const signed = signCookie("user-123");
      const sig = signed.split(".")[1];
      // Attach the signature from user-123 to a different value
      expect(verifyCookie(`victim-id.${sig}`)).toBeNull();
    });

    it("returns null for an empty string", () => {
      expect(verifyCookie("")).toBeNull();
    });

    it("returns null for just a dot", () => {
      expect(verifyCookie(".")).toBeNull();
    });

    it("handles values that contain dots (uses last dot as separator)", () => {
      const value = "some.dotted.value";
      const signed = signCookie(value);
      expect(verifyCookie(signed)).toBe(value);
    });
  });
});
