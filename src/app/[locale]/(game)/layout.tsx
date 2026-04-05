import type { ReactNode } from "react";
import { auth } from "@/infrastructure/auth";
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
    const { locale } = await params;
    redirect(`/${locale}/login`);
  }
  return <>{children}</>;
}
