import { createHmac, timingSafeEqual } from "node:crypto";

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is required for cookie signing");
  }
  return secret;
}

/** Returns `value.signature` */
export function signCookie(value: string): string {
  const sig = createHmac("sha256", getSecret())
    .update(value)
    .digest("base64url");
  return `${value}.${sig}`;
}

/** Returns the original value if signature is valid, or null if tampered. */
export function verifyCookie(signed: string): string | null {
  const dotIndex = signed.lastIndexOf(".");
  if (dotIndex === -1) return null;

  const value = signed.slice(0, dotIndex);
  const sig = signed.slice(dotIndex + 1);

  const expected = createHmac("sha256", getSecret())
    .update(value)
    .digest("base64url");

  // Constant-time comparison to prevent timing attacks
  if (sig.length !== expected.length) return null;

  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  if (!timingSafeEqual(sigBuf, expectedBuf)) return null;

  return value;
}
