import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/infrastructure/db", () => ({
  prisma: {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import { prisma } from "@/infrastructure/db";
import {
  createAnonymousUser,
  findUserById,
  incrementUserProfile,
  decrementUserProfile,
} from "../user-repository";
import { emptyProfile, type ProfileVector } from "@/domain/profile";

const mockCreate = vi.mocked(prisma.user.create);
const mockFindUnique = vi.mocked(prisma.user.findUnique);
const mockUpdate = vi.mocked(prisma.user.update);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createAnonymousUser", () => {
  it("creates a user with just a name", async () => {
    mockCreate.mockResolvedValueOnce({ id: "user-1", name: "Alice" } as never);

    const result = await createAnonymousUser("Alice");

    expect(mockCreate).toHaveBeenCalledWith({
      data: { name: "Alice" },
    });
    expect(result.name).toBe("Alice");
  });
});

describe("findUserById", () => {
  it("returns the user when found", async () => {
    mockFindUnique.mockResolvedValueOnce({ id: "user-1", name: "Alice" } as never);

    const result = await findUserById("user-1");

    expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: "user-1" } });
    expect(result?.name).toBe("Alice");
  });

  it("returns null when not found", async () => {
    mockFindUnique.mockResolvedValueOnce(null);

    const result = await findUserById("nonexistent");

    expect(result).toBeNull();
  });
});

describe("incrementUserProfile", () => {
  it("uses atomic increment for non-zero dimensions", async () => {
    mockUpdate.mockResolvedValueOnce({} as never);

    const tags: ProfileVector = {
      ...emptyProfile(),
      manuel: 2,
      equipe: 3,
    };

    await incrementUserProfile("user-1", tags);

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: {
        manuel: { increment: 2 },
        equipe: { increment: 3 },
      },
    });
  });

  it("skips dimensions with zero values", async () => {
    mockUpdate.mockResolvedValueOnce({} as never);

    await incrementUserProfile("user-1", emptyProfile());

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: {},
    });
  });
});

describe("decrementUserProfile", () => {
  it("uses atomic decrement for non-zero dimensions", async () => {
    mockUpdate.mockResolvedValueOnce({} as never);

    const tags: ProfileVector = {
      ...emptyProfile(),
      manuel: 2,
      technique: 1,
    };

    await decrementUserProfile("user-1", tags);

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: {
        manuel: { decrement: 2 },
        technique: { decrement: 1 },
      },
    });
  });
});
