import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mocks ─────────────────────────────────────────────────────────────

const mockCookieStore = {
  get: vi.fn(),
  set: vi.fn(),
};
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}));

// Mock next-auth before it tries to import next/server
vi.mock("next-auth", () => ({
  AuthError: class AuthError extends Error {
    type: string;
    constructor(message?: string) {
      super(message);
      this.type = "CredentialsSignin";
    }
  },
}));

const mockAuth = vi.fn(() => Promise.resolve(null));
const mockSignIn = vi.fn(() => Promise.resolve());
vi.mock("@/infrastructure/auth", () => ({
  auth: () => mockAuth(),
  signIn: (...args: unknown[]) => mockSignIn(...args),
  signOut: vi.fn(),
}));

vi.stubEnv("AUTH_SECRET", "test-secret-for-unit-tests-only");

vi.mock("@/infrastructure/cookie-signature", async () => {
  const actual = await vi.importActual<
    typeof import("@/infrastructure/cookie-signature")
  >("@/infrastructure/cookie-signature");
  return actual;
});

vi.mock("@/infrastructure/password", () => ({
  hashPassword: vi.fn((p: string) => Promise.resolve(`hashed:${p}`)),
}));

vi.mock("@/repositories/user-repository", () => ({
  findUserById: vi.fn(),
  findUserByEmail: vi.fn(),
  upgradeGuestToRegistered: vi.fn(),
  createRegisteredUser: vi.fn(),
}));

import { registerUser } from "../auth";
import { signCookie } from "@/infrastructure/cookie-signature";
import {
  findUserById,
  findUserByEmail,
  upgradeGuestToRegistered,
  createRegisteredUser,
} from "@/repositories/user-repository";

const mockFindById = vi.mocked(findUserById);
const mockFindByEmail = vi.mocked(findUserByEmail);
const mockUpgrade = vi.mocked(upgradeGuestToRegistered);
const mockCreateRegistered = vi.mocked(createRegisteredUser);

beforeEach(() => {
  vi.clearAllMocks();
  mockCookieStore.get.mockReturnValue(undefined);
  mockAuth.mockResolvedValue(null);
  mockFindByEmail.mockResolvedValue(null);
});

// ── C2 Regression: Cookie forgery → privilege escalation ──────────────

describe("C2 regression: cookie forgery protection", () => {
  it("rejects a forged (unsigned) userId cookie", async () => {
    // Attacker sets cookie to a raw CUID without HMAC signature
    mockCookieStore.get.mockReturnValue({ value: "victim-cuid-123" });
    mockCreateRegistered.mockResolvedValue({} as never);

    await registerUser("attacker@evil.com", "password123");

    // Should NOT call upgradeGuestToRegistered with the forged ID
    expect(mockUpgrade).not.toHaveBeenCalled();
    // Should create a new user instead (forged cookie ignored)
    expect(mockCreateRegistered).toHaveBeenCalledWith(
      "attacker@evil.com",
      "attacker",
      "hashed:password123"
    );
  });

  it("rejects a cookie with a tampered signature", async () => {
    // Attacker takes a valid signature and attaches it to a different ID
    const legitimateSigned = signCookie("other-user-id");
    const sig = legitimateSigned.split(".").pop();
    const tampered = `victim-cuid-123.${sig}`;

    mockCookieStore.get.mockReturnValue({ value: tampered });
    mockCreateRegistered.mockResolvedValue({} as never);

    await registerUser("attacker@evil.com", "password123");

    expect(mockUpgrade).not.toHaveBeenCalled();
    expect(mockCreateRegistered).toHaveBeenCalled();
  });

  it("refuses to overwrite a registered (non-guest) user", async () => {
    // Even with a validly signed cookie, a registered user must not be overwritten
    const signedVictimId = signCookie("victim-cuid-123");
    mockCookieStore.get.mockReturnValue({ value: signedVictimId });

    mockFindById.mockResolvedValue({
      id: "victim-cuid-123",
      isGuest: false, // ← registered user
      email: "victim@example.com",
    } as never);
    mockCreateRegistered.mockResolvedValue({} as never);

    await registerUser("attacker@evil.com", "password123");

    // Must NOT upgrade — victim is not a guest
    expect(mockUpgrade).not.toHaveBeenCalled();
    // Should create a separate new account
    expect(mockCreateRegistered).toHaveBeenCalledWith(
      "attacker@evil.com",
      "attacker",
      "hashed:password123"
    );
  });

  it("allows upgrading a legitimate guest user with a signed cookie", async () => {
    const signedGuestId = signCookie("guest-cuid-456");
    mockCookieStore.get.mockReturnValue({ value: signedGuestId });

    mockFindById.mockResolvedValue({
      id: "guest-cuid-456",
      isGuest: true, // ← legitimate guest
      name: "Guest Player",
    } as never);
    mockUpgrade.mockResolvedValue({} as never);

    await registerUser("newuser@example.com", "password123");

    // Should upgrade the guest, preserving their game progress
    expect(mockUpgrade).toHaveBeenCalledWith(
      "guest-cuid-456",
      "newuser@example.com",
      "hashed:password123"
    );
    expect(mockCreateRegistered).not.toHaveBeenCalled();
  });
});

// ── Basic auth validation ─────────────────────────────────────────────

describe("registerUser validation", () => {
  it("rejects invalid email", async () => {
    const result = await registerUser("not-an-email", "password123");
    expect(result).toEqual({ error: "invalidEmail" });
  });

  it("rejects weak password", async () => {
    const result = await registerUser("test@example.com", "short");
    expect(result).toEqual({ error: "weakPassword" });
  });

  it("rejects duplicate email", async () => {
    mockFindByEmail.mockResolvedValue({ id: "existing" } as never);

    const result = await registerUser("taken@example.com", "password123");
    expect(result).toEqual({ error: "emailTaken" });
  });

  it("creates a new user when no session or cookie exists", async () => {
    mockCreateRegistered.mockResolvedValue({} as never);

    const result = await registerUser("fresh@example.com", "password123");

    expect(result).toEqual({});
    expect(mockCreateRegistered).toHaveBeenCalledWith(
      "fresh@example.com",
      "fresh",
      "hashed:password123"
    );
  });
});
