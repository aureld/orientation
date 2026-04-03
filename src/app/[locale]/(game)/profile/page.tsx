"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { HeaderBar } from "@/components/layout/header-bar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { RadarChart } from "@/components/game/radar-chart";
import { getRadarData } from "@/domain/matching/radar";
import { emptyProfile } from "@/domain/profile";
import { getUserGameState, type UserProgressDTO } from "@/app/actions/game-state";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const ts = useTranslations("profile.stats");
  const [gameState, setGameState] = useState<UserProgressDTO | null>(null);

  useEffect(() => {
    getUserGameState().then(setGameState);
  }, []);

  const profile = gameState?.profile ?? emptyProfile();
  const radarData = getRadarData(profile);
  const scenarioCount = gameState?.completedScenarioIds.length ?? 0;

  const stats = [
    { label: ts("points"), value: String(gameState?.choiceCount ?? 0), icon: "\u2B50" },
    { label: ts("scenarios"), value: `${scenarioCount}/11`, icon: "\u{1F3AE}" },
    { label: ts("badges"), value: "0/8", icon: "\u{1F3C5}" },
    { label: ts("careersSeen"), value: "0", icon: "\u{1F4DA}" },
  ];

  return (
    <div className="animate-fade-in mx-auto max-w-2xl px-4 pb-12">
      <HeaderBar title={t("title")} showBack right={<ThemeToggle />} />

      <h2 className="mt-6 text-2xl font-bold">
        {gameState?.name ?? "Aventurier"} — {t("title")}
      </h2>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card text-center">
            <div className="text-2xl">{s.icon}</div>
            <div className="text-2xl font-extrabold text-accent">{s.value}</div>
            <div className="text-xs text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      <h3 className="mt-8 text-lg font-bold">{t("radarTitle")}</h3>
      <RadarChart data={radarData} />

      <h3 className="mt-8 text-lg font-bold">{t("badgesTitle")}</h3>
      <div className="badge-grid mt-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="badge-item locked">
            <span className="badge-icon">{"\u{1F512}"}</span>
            <div className="badge-name">{t("locked")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
