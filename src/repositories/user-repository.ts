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

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export function upgradeGuestToRegistered(
  id: string,
  email: string,
  passwordHash: string
) {
  return prisma.user.update({
    where: { id },
    data: { email, passwordHash, isGuest: false },
  });
}

export function createRegisteredUser(
  email: string,
  name: string,
  passwordHash: string
) {
  return prisma.user.create({
    data: { email, name, passwordHash, isGuest: false },
  });
}
