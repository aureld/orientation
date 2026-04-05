"use client";

import { useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { logoutUser } from "@/app/actions/auth";

export function LogoutButton() {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const t = useTranslations("auth");

  function handleLogout() {
    startTransition(async () => {
      await logoutUser();
      router.push("/login");
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
