"use server";

import { cookies } from "next/headers";
import { AuthError } from "next-auth";
import { auth, signIn, signOut } from "@/infrastructure/auth";
import { verifyCookie } from "@/infrastructure/cookie-signature";
import { hashPassword } from "@/infrastructure/password";
import {
  findUserById,
  findUserByEmail,
  upgradeGuestToRegistered,
  createRegisteredUser,
} from "@/repositories/user-repository";

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

  // If there's an existing guest session, upgrade it; otherwise create a new user
  const userId = await getUserId();
  const name = email.split("@")[0];
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
  if (!user || !user.passwordHash) {
    console.warn(`[auth] login failed: no account for ${email}`);
    return { error: "invalidCredentials" };
  }

  const { verifyPassword } = await import("@/infrastructure/password");
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    console.warn(`[auth] login failed: wrong password for ${email}`);
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
