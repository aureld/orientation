"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { HeaderBar } from "@/components/header-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { RadarChart } from "@/components/radar-chart";
import { getRadarData } from "@/lib/matching";
import { emptyProfile } from "@/lib/profile-dimensions";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const ts = useTranslations("profile.stats");
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    setPlayerName(localStorage.getItem("playerName") || "");
  }, []);

  const profile = emptyProfile();
  const radarData = getRadarData(profile);

  const stats = [
    { label: ts("points"), value: "0", icon: "⭐" },
    { label: ts("scenarios"), value: "0/11", icon: "🎮" },
    { label: ts("badges"), value: "0/8", icon: "🏅" },
    { label: ts("careersSeen"), value: "0", icon: "📚" },
  ];

  return (
    <div className="animate-fade-in mx-auto max-w-2xl px-4 pb-12">
      <HeaderBar title={t("title")} showBack right={<ThemeToggle />} />

      <h2 className="mt-6 text-2xl font-bold">
        {playerName || "Aventurier"} — {t("title")}
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
            <span className="badge-icon">🔒</span>
            <div className="badge-name">{t("locked")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
