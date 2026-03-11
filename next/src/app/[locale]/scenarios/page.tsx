"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { HeaderBar } from "@/components/header-bar";
import { ProgressBar } from "@/components/progress-bar";
import { ThemeToggle } from "@/components/theme-toggle";

// Temporary: scenarios from localStorage + static data until DB is wired
// This will be replaced with server-fetched data
const STATIC_SCENARIOS = [
  { id: "hopital", title: "Une journée à l'hôpital", sector: "sante", icon: "🏥" },
  { id: "chantier", title: "Sur le chantier", sector: "construction", icon: "🏗️" },
  { id: "startup", title: "Dans une startup tech", sector: "informatique", icon: "💻" },
  { id: "restaurant", title: "En cuisine", sector: "gastronomie", icon: "👨‍🍳" },
  { id: "ferme", title: "À la ferme", sector: "nature", icon: "🌾" },
  { id: "garage", title: "Au garage", sector: "automobile", icon: "🚗" },
  { id: "atelier", title: "L'atelier créatif", sector: "artisanat", icon: "🪑" },
  { id: "bureau", title: "Au bureau", sector: "commerce", icon: "💼" },
  { id: "creche", title: "À la crèche", sector: "social", icon: "🧡" },
  { id: "usine", title: "Dans l'usine", sector: "technique", icon: "⚙️" },
  { id: "aeroport", title: "À l'aéroport", sector: "aeronautique", icon: "✈️" },
];

export default function ScenariosPage() {
  const t = useTranslations("scenarios");
  const [playerName, setPlayerName] = useState("");
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    setPlayerName(localStorage.getItem("playerName") || "");
    const saved = localStorage.getItem("completedScenarios");
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  return (
    <div className="animate-fade-in mx-auto max-w-2xl px-4 pb-12">
      <HeaderBar
        title={t("title")}
        right={
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-accent">⭐ 0 {t("progress")}</span>
            <ThemeToggle />
          </div>
        }
      />

      <div className="mb-2 mt-4">
        <h2 className="text-2xl font-bold">{t("welcome", { name: playerName })}</h2>
        <p className="text-muted">{t("instructions")}</p>
      </div>

      <ProgressBar
        current={completed.length}
        total={STATIC_SCENARIOS.length}
        label={t("progress")}
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {STATIC_SCENARIOS.map((s) => {
          const done = completed.includes(s.id);
          return (
            <Link
              key={s.id}
              href={`/scenario/${s.id}`}
              className={`scenario-card flex flex-col items-center gap-2 py-5 text-center ${
                done ? "completed" : ""
              }`}
            >
              <span className="text-3xl">{s.icon}</span>
              <div className="text-sm font-bold">{s.title}</div>
              <div className="text-xs text-muted">{s.sector}</div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {completed.length >= 3 && (
          <Link href="/results" className="btn btn-primary w-full text-center">
            {t("viewResults", { count: completed.length })}
          </Link>
        )}
        <Link href="/careers" className="btn btn-secondary w-full text-center">
          {t("exploreAll")}
        </Link>
        {completed.length > 0 && (
          <Link href="/profile" className="btn btn-secondary w-full text-center">
            {t("myProfile")}
          </Link>
        )}
      </div>
    </div>
  );
}
