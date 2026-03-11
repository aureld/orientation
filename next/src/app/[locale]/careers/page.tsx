"use client";

import { useTranslations } from "next-intl";
import { HeaderBar } from "@/components/header-bar";

// Placeholder — will fetch from DB grouped by sector
export default function CareersPage() {
  const t = useTranslations("careers");

  return (
    <div className="animate-fade-in mx-auto max-w-2xl px-4 pb-12">
      <HeaderBar title={t("title")} showBack />

      <h2 className="mt-6 text-2xl font-bold">{t("count")}</h2>
      <p className="text-muted">{t("instructions")}</p>

      <div className="mt-8 text-center text-muted italic">
        Career list will be loaded from the database.
      </div>
    </div>
  );
}
