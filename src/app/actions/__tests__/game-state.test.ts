import { describe, it, expect, vi, beforeEach } from "vitest";
import { emptyProfile, type ProfileVector } from "@/domain/profile";

// Mock next/headers cookies
const mockCookieStore = {
  get: vi.fn(),
  set: vi.fn(),
};
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}));

// Mock Auth.js — returns null session by default (guest user)
const mockAuth = vi.fn(() => Promise.resolve(null));
vi.mock("@/infrastructure/auth", () => ({
  auth: () => mockAuth(),
}));

vi.mock("@/repositories/user-repository", () => ({
  createAnonymousUser: vi.fn(),
  findUserById: vi.fn(),
  incrementUserProfile: vi.fn(),
}));

vi.mock("@/repositories/game-state-repository", () => ({
  saveUserChoice: vi.fn(),
  markScenarioComplete: vi.fn(),
  getUserProgress: vi.fn(),
}));

import { startGame, saveChoice, completeScenario, getUserGameState } from "../game-state";
import { createAnonymousUser, findUserById, incrementUserProfile } from "@/repositories/user-repository";
import { saveUserChoice, markScenarioComplete, getUserProgress } from "@/repositories/game-state-repository";

const mockCreateUser = vi.mocked(createAnonymousUser);
const mockFindUser = vi.mocked(findUserById);
const mockIncrementProfile = vi.mocked(incrementUserProfile);
const mockSaveChoice = vi.mocked(saveUserChoice);
const mockMarkComplete = vi.mocked(markScenarioComplete);
const mockGetProgress = vi.mocked(getUserProgress);

beforeEach(() => {
  vi.clearAllMocks();
  mockCookieStore.get.mockReturnValue(undefined);
});

describe("startGame", () => {
  it("creates a user and sets the userId cookie", async () => {
    mockCreateUser.mockResolvedValueOnce({ id: "user-123", name: "Alice" } as never);

    const userId = await startGame("Alice");

    expect(userId).toBe("user-123");
    expect(mockCreateUser).toHaveBeenCalledWith("Alice");
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      "userId",
      "user-123",
      expect.objectContaining({
        httpOnly: true,
        sameSite: "lax",
      })
    );
  });

  it("trims the name before creating user", async () => {
    mockCreateUser.mockResolvedValueOnce({ id: "user-1", name: "Bob" } as never);

    await startGame("  Bob  ");

    expect(mockCreateUser).toHaveBeenCalledWith("Bob");
  });
});

describe("saveChoice", () => {
  it("saves the choice and increments profile when user has cookie", async () => {
    mockCookieStore.get.mockReturnValue({ value: "user-123" });
    mockSaveChoice.mockResolvedValueOnce({} as never);
    mockIncrementProfile.mockResolvedValueOnce({} as never);

    const tags: ProfileVector = { ...emptyProfile(), manuel: 2, equipe: 3 };
    await saveChoice("hopital", "arrivee", "choice-1", tags);

    expect(mockSaveChoice).toHaveBeenCalledWith("user-123", "hopital", "arrivee", "choice-1");
    expect(mockIncrementProfile).toHaveBeenCalledWith("user-123", tags);
  });

  it("does nothing when no userId cookie exists", async () => {
    mockCookieStore.get.mockReturnValue(undefined);

    await saveChoice("hopital", "arrivee", "choice-1", emptyProfile());

    expect(mockSaveChoice).not.toHaveBeenCalled();
    expect(mockIncrementProfile).not.toHaveBeenCalled();
  });
});

describe("completeScenario", () => {
  it("marks the scenario complete when user has cookie", async () => {
    mockCookieStore.get.mockReturnValue({ value: "user-123" });
    mockMarkComplete.mockResolvedValueOnce({} as never);

    await completeScenario("hopital");

    expect(mockMarkComplete).toHaveBeenCalledWith("user-123", "hopital");
  });

  it("does nothing when no userId cookie exists", async () => {
    mockCookieStore.get.mockReturnValue(undefined);

    await completeScenario("hopital");

    expect(mockMarkComplete).not.toHaveBeenCalled();
  });
});

describe("getUserGameState", () => {
  it("returns user progress and profile", async () => {
    mockCookieStore.get.mockReturnValue({ value: "user-123" });
    mockFindUser.mockResolvedValueOnce({
      id: "user-123",
      name: "Alice",
      manuel: 5, intellectuel: 3, creatif: 0, analytique: 2,
      interieur: 1, exterieur: 4, equipe: 6, independant: 0,
      contactHumain: 7, technique: 2, routine: 1, variete: 3,
    } as never);
    mockGetProgress.mockResolvedValueOnce({
      completedScenarioIds: ["hopital", "chantier"],
      choiceCount: 12,
    });

    const result = await getUserGameState();

    expect(result).not.toBeNull();
    expect(result!.name).toBe("Alice");
    expect(result!.completedScenarioIds).toEqual(["hopital", "chantier"]);
    expect(result!.choiceCount).toBe(12);
    expect(result!.profile.manuel).toBe(5);
    expect(result!.profile.contactHumain).toBe(7);
  });

  it("returns null when no userId cookie exists", async () => {
    mockCookieStore.get.mockReturnValue(undefined);

    const result = await getUserGameState();

    expect(result).toBeNull();
  });

  it("returns null when user is not found in DB", async () => {
    mockCookieStore.get.mockReturnValue({ value: "nonexistent" });
    mockFindUser.mockResolvedValueOnce(null);

    const result = await getUserGameState();

    expect(result).toBeNull();
  });
});
