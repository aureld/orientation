"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { HeaderBar } from "@/components/layout/header-bar";
import { routing } from "@/i18n/routing";

const LOCALE_LABELS: Record<string, string> = {
  fr: "Français",
  de: "Deutsch",
  en: "English",
};

export default function SettingsPage() {
  const t = useTranslations("settings");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    setDark(stored === "true");
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "");
    localStorage.setItem("darkMode", String(next));
  }

  function switchLocale(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="animate-fade-in mx-auto max-w-2xl px-4 pb-12">
      <HeaderBar title={t("title")} showBack />

      {/* Theme */}
      <section className="mt-6">
        <h2 className="mb-3 text-lg font-bold">{t("theme")}</h2>
        <div className="flex gap-3">
          <button
            onClick={() => { if (dark) toggleTheme(); }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-colors ${
              !dark ? "border-accent bg-accent/10 text-accent" : "border-border"
            }`}
          >
            {"\u2600\uFE0F"} {t("lightMode")}
          </button>
          <button
            onClick={() => { if (!dark) toggleTheme(); }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-colors ${
              dark ? "border-accent bg-accent/10 text-accent" : "border-border"
            }`}
          >
            {"\u{1F319}"} {t("darkMode")}
          </button>
        </div>
      </section>

      {/* Language */}
      <section className="mt-8">
        <h2 className="mb-1 text-lg font-bold">{t("language")}</h2>
        <p className="mb-3 text-sm text-muted">{t("languageDescription")}</p>
        <div className="flex gap-3">
          {routing.locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-colors ${
                loc === locale ? "border-accent bg-accent/10 text-accent" : "border-border"
              }`}
            >
              {LOCALE_LABELS[loc]}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
