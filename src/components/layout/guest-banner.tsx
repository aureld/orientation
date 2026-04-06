"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function GuestBanner() {
  const t = useTranslations("auth");

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-accent/30 bg-accent/5 px-4 py-2 text-sm">
      <span className="text-muted">{t("guestBanner")}</span>
      <Link
        href="/register"
        className="shrink-0 font-semibold text-accent hover:underline"
      >
        {t("registerButton")}
      </Link>
    </div>
  );
}
