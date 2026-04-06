"use server";

import { cookies } from "next/headers";
import { DIMENSIONS, type ProfileVector } from "@/domain/profile";
import { auth } from "@/infrastructure/auth";
import { signCookie, verifyCookie } from "@/infrastructure/cookie-signature";
import { createAnonymousUser, findUserById, incrementUserProfile, updateUserAvatar as repoUpdateAvatar } from "@/repositories/user-repository";
import { isValidAvatar } from "@/domain/profile";
import {
  saveUserChoice,
  markScenarioComplete,
  getUserProgress as getProgress,
} from "@/repositories/game-state-repository";

const USER_COOKIE = "userId";

async function getUserId(): Promise<string | null> {
  // Auth.js session takes priority (registered users)
  const session = await auth();
  if (session?.user?.id) return session.user.id;

  // Fall back to signed cookie (guest users)
  const cookieStore = await cookies();
  const raw = cookieStore.get(USER_COOKIE)?.value;
  if (!raw) return null;
  return verifyCookie(raw);
}

export async function startGame(name: string): Promise<string> {
  const user = await createAnonymousUser(name.trim());
  const cookieStore = await cookies();
  cookieStore.set(USER_COOKIE, signCookie(user.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 90, // 90 days
    path: "/",
  });
  return user.id;
}

export async function saveChoice(
  scenarioId: string,
  sceneKey: string,
  choiceId: string,
  tags: ProfileVector
): Promise<void> {
  const userId = await getUserId();
  if (!userId) return;

  await saveUserChoice(userId, scenarioId, sceneKey, choiceId);
  await incrementUserProfile(userId, tags);
}

export async function completeScenario(scenarioId: string): Promise<void> {
  const userId = await getUserId();
  if (!userId) return;

  await markScenarioComplete(userId, scenarioId);
}

export interface UserProgressDTO {
  name: string;
  avatar: string | null;
  completedScenarioIds: string[];
  choiceCount: number;
  profile: ProfileVector;
  isGuest: boolean;
}

export async function getUserGameState(): Promise<UserProgressDTO | null> {
  const userId = await getUserId();
  if (!userId) return null;

  const user = await findUserById(userId);
  if (!user) return null;

  const progress = await getProgress(userId);

  const profile = {} as ProfileVector;
  for (const d of DIMENSIONS) {
    profile[d] = user[d];
  }

  return {
    name: user.name,
    avatar: user.image,
    completedScenarioIds: progress.completedScenarioIds,
    choiceCount: progress.choiceCount,
    profile,
    isGuest: user.isGuest,
  };
}

export async function updateAvatar(avatar: string): Promise<{ error?: string }> {
  if (!isValidAvatar(avatar)) {
    return { error: "invalidAvatar" };
  }

  const userId = await getUserId();
  if (!userId) return { error: "noSession" };

  await repoUpdateAvatar(userId, avatar);
  return {};
}
