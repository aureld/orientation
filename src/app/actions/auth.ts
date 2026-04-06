"use server";

import { cookies } from "next/headers";
import { AuthError } from "next-auth";
import { auth, signIn, signOut } from "@/infrastructure/auth";
import { verifyCookie } from "@/infrastructure/cookie-signature";
import { hashPassword, verifyPassword, DUMMY_HASH } from "@/infrastructure/password";
import {
  findUserById,
  findUserByEmail,
  upgradeGuestToRegistered,
  createRegisteredUser,
} from "@/repositories/user-repository";

function isUniqueConstraintViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === "P2002"
  );
}

async function getUserId(): Promise<string | null> {
  const session = await auth();
  if (session?.user?.id) return session.user.id;
  const cookieStore = await cookies();
  const raw = cookieStore.get("userId")?.value;
  if (!raw) return null;
  return verifyCookie(raw);
}

export async function registerUser(
  email: string,
  password: string
): Promise<{ error?: string }> {
  if (!email || !email.includes("@")) {
    return { error: "invalidEmail" };
  }
  if (password.length < 6) {
    return { error: "weakPassword" };
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return { error: "emailTaken" };
  }

  const hashed = await hashPassword(password);

  // If there's an existing guest session, upgrade it; otherwise create a new user.
  // The DB unique constraint on email is the ultimate guard against races —
  // two concurrent registrations can both pass the findUserByEmail check above,
  // so we catch P2002 here to handle the second writer gracefully.
  const userId = await getUserId();
  const name = email.split("@")[0];
  try {
    if (userId) {
      const existing = await findUserById(userId);
      if (existing?.isGuest) {
        await upgradeGuestToRegistered(userId, email, hashed);
      } else {
        await createRegisteredUser(email, name, hashed);
      }
    } else {
      await createRegisteredUser(email, name, hashed);
    }
  } catch (error: unknown) {
    if (isUniqueConstraintViolation(error)) {
      return { error: "emailTaken" };
    }
    throw error;
  }

  // Auto-login after registration
  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch {
    // Sign-in after registration is best-effort
  }

  return {};
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ error?: string }> {
  if (!email || !password) {
    return { error: "invalidCredentials" };
  }

  const user = await findUserByEmail(email);

  // Always run bcrypt compare to prevent timing-based account enumeration.
  // When no account exists, compare against a dummy hash so both paths
  // take the same ~200ms.
  const hashToCheck = user?.passwordHash ?? DUMMY_HASH;
  const valid = await verifyPassword(password, hashToCheck);

  if (!user || !user.passwordHash || !valid) {
    console.warn(`[auth] login failed for ${email}`);
    return { error: "invalidCredentials" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return {};
  } catch (err) {
    // CredentialsSignin is expected when authorize() returns null — not a real error
    if (err instanceof AuthError && err.type === "CredentialsSignin") {
      console.warn(`[auth] login failed: credentials rejected for ${email}`);
      return { error: "invalidCredentials" };
    }
    // Unexpected errors (DB down, network issues) — log and surface
    console.error(`[auth] unexpected signIn error for ${email}:`, err);
    return { error: "invalidCredentials" };
  }
}

export async function logoutUser(): Promise<void> {
  await signOut({ redirect: false });
}

export async function getSession() {
  return auth();
}
