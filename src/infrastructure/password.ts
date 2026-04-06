import { hash, compare, hashSync } from "bcryptjs";

const SALT_ROUNDS = 12;

/**
 * Pre-computed hash used as a timing decoy during login.
 * When no account is found, we compare against this dummy hash so the
 * response time is indistinguishable from a real password check.
 */
export const DUMMY_HASH = hashSync("dummy-timing-decoy", SALT_ROUNDS);

export function hashPassword(plain: string): Promise<string> {
  return hash(plain, SALT_ROUNDS);
}

export function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return compare(plain, hashed);
}
