import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { auth } from "@/infrastructure/auth";
import { verifyCookie } from "@/infrastructure/cookie-signature";
import { redirect } from "next/navigation";

export default async function GameLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    // Check for guest cookie as fallback
    const cookieStore = await cookies();
    const raw = cookieStore.get("userId")?.value;
    const guestId = raw ? verifyCookie(raw) : null;

    if (!guestId) {
      const { locale } = await params;
      redirect(`/${locale}`);
    }
  }

  return <>{children}</>;
}
