import { prisma } from "@/infrastructure/db";
import { DIMENSIONS, type ProfileVector } from "@/domain/profile";

export function createAnonymousUser(name: string) {
  return prisma.user.create({
    data: { name },
  });
}

export function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export function incrementUserProfile(id: string, tags: ProfileVector) {
  const increments: Record<string, { increment: number }> = {};
  for (const d of DIMENSIONS) {
    if (tags[d] !== 0) {
      increments[d] = { increment: tags[d] };
    }
  }
  return prisma.user.update({
    where: { id },
    data: increments,
  });
}

export function decrementUserProfile(id: string, tags: ProfileVector) {
  const decrements: Record<string, { decrement: number }> = {};
  for (const d of DIMENSIONS) {
    if (tags[d] !== 0) {
      decrements[d] = { decrement: tags[d] };
    }
  }
  return prisma.user.update({
    where: { id },
    data: decrements,
  });
}
