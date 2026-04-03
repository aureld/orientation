"use server";

import { auth, signIn, signOut } from "@/infrastructure/auth";
import { hashPassword } from "@/infrastructure/password";
import {
  findUserByEmail,
  upgradeGuestToRegistered,
} from "@/repositories/user-repository";

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

  const session = await auth();
  if (!session?.user?.id) {
    return { error: "noSession" };
  }

  const hashed = await hashPassword(password);
  await upgradeGuestToRegistered(session.user.id, email, hashed);

  return {};
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ error?: string }> {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return {};
  } catch {
    return { error: "invalidCredentials" };
  }
}

export async function logoutUser(): Promise<void> {
  await signOut({ redirect: false });
}

export async function getSession() {
  return auth();
}
