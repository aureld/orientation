"use client";

import { useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { logoutUser } from "@/app/actions/auth";

interface UserActionsProps {
  isGuest: boolean;
}

export function UserActions({ isGuest }: UserActionsProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const t = useTranslations("auth");

  if (isGuest) {
    return (
      <Link
        href="/register"
        className="rounded-lg p-2 text-sm font-semibold text-accent hover:underline transition-colors"
      >
        {t("saveProgress")}
      </Link>
    );
  }

  function handleLogout() {
    startTransition(async () => {
      await logoutUser();
      router.push("/");
    });
  }

  return (
    <button
      onClick={handleLogout}
      disabled={pending}
      className="rounded-lg p-2 text-sm font-semibold text-muted hover:text-accent transition-colors"
    >
      {t("logout")}
    </button>
  );
}
