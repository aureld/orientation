import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/infrastructure/db", () => ({
  prisma: {
    userChoice: {
      create: vi.fn(),
      count: vi.fn(),
      deleteMany: vi.fn(),
      findMany: vi.fn(),
    },
    userScenario: {
      upsert: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "@/infrastructure/db";
import {
  saveUserChoice,
  markScenarioComplete,
  getUserProgress,
  hasCompletedScenario,
  deleteScenarioChoices,
} from "../game-state-repository";

const mockChoiceCreate = vi.mocked(prisma.userChoice.create);
const mockChoiceCount = vi.mocked(prisma.userChoice.count);
const mockChoiceDeleteMany = vi.mocked(prisma.userChoice.deleteMany);
const mockScenarioUpsert = vi.mocked(prisma.userScenario.upsert);
const mockScenarioFindMany = vi.mocked(prisma.userScenario.findMany);
const mockScenarioFindUnique = vi.mocked(prisma.userScenario.findUnique);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("saveUserChoice", () => {
  it("creates a UserChoice record", async () => {
    mockChoiceCreate.mockResolvedValueOnce({} as never);

    await saveUserChoice("user-1", "hopital", "arrivee", "choice-1");

    expect(mockChoiceCreate).toHaveBeenCalledWith({
      data: {
        userId: "user-1",
        scenarioId: "hopital",
        sceneKey: "arrivee",
        choiceId: "choice-1",
      },
    });
  });
});

describe("markScenarioComplete", () => {
  it("upserts a UserScenario record", async () => {
    mockScenarioUpsert.mockResolvedValueOnce({} as never);

    await markScenarioComplete("user-1", "hopital");

    expect(mockScenarioUpsert).toHaveBeenCalledWith({
      where: { userId_scenarioId: { userId: "user-1", scenarioId: "hopital" } },
      create: { userId: "user-1", scenarioId: "hopital" },
      update: expect.objectContaining({ completedAt: expect.any(Date) }),
    });
  });
});

describe("getUserProgress", () => {
  it("returns completed scenario IDs and choice count", async () => {
    mockScenarioFindMany.mockResolvedValueOnce([
      { scenarioId: "hopital" },
      { scenarioId: "chantier" },
    ] as never);
    mockChoiceCount.mockResolvedValueOnce(15 as never);

    const result = await getUserProgress("user-1");

    expect(result.completedScenarioIds).toEqual(["hopital", "chantier"]);
    expect(result.choiceCount).toBe(15);
  });

  it("returns empty arrays for a new user", async () => {
    mockScenarioFindMany.mockResolvedValueOnce([] as never);
    mockChoiceCount.mockResolvedValueOnce(0 as never);

    const result = await getUserProgress("new-user");

    expect(result.completedScenarioIds).toEqual([]);
    expect(result.choiceCount).toBe(0);
  });
});

describe("hasCompletedScenario", () => {
  it("returns true when scenario is completed", async () => {
    mockScenarioFindUnique.mockResolvedValueOnce({ id: 1 } as never);

    const result = await hasCompletedScenario("user-1", "hopital");

    expect(result).toBe(true);
  });

  it("returns false when scenario is not completed", async () => {
    mockScenarioFindUnique.mockResolvedValueOnce(null);

    const result = await hasCompletedScenario("user-1", "hopital");

    expect(result).toBe(false);
  });
});

describe("deleteScenarioChoices", () => {
  it("deletes all choices for a user-scenario pair", async () => {
    mockChoiceDeleteMany.mockResolvedValueOnce({ count: 5 } as never);

    await deleteScenarioChoices("user-1", "hopital");

    expect(mockChoiceDeleteMany).toHaveBeenCalledWith({
      where: { userId: "user-1", scenarioId: "hopital" },
    });
  });
});
