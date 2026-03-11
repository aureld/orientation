"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { HeaderBar } from "@/components/header-bar";
import { RadarChart } from "@/components/radar-chart";
import { getRadarData } from "@/lib/matching";
import { emptyProfile } from "@/lib/profile-dimensions";

export default function ResultsPage() {
  const t = useTranslations("results");
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    setPlayerName(localStorage.getItem("playerName") || "");
  }, []);

  // Placeholder profile — will come from DB
  const profile = emptyProfile();
  const radarData = getRadarData(profile);

  return (
    <div className="animate-fade-in mx-auto max-w-2xl px-4 pb-12">
      <HeaderBar title={t("title")} showBack />

      <h2 className="mt-6 text-2xl font-bold">
        {t("profileTitle", { name: playerName })}
      </h2>
      <p className="text-muted">{t("basedOn", { count: 0 })}</p>

      <div className="my-6">
        <RadarChart data={radarData} />
      </div>

      <h2 className="text-2xl font-bold">{t("recommended")}</h2>
      <p className="mb-4 text-muted">{t("recommendedSub")}</p>

      <p className="text-center text-muted italic">
        Complete at least 3 scenarios to see recommendations.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        <Link href="/careers" className="btn btn-secondary w-full text-center">
          {t("exploreAll")}
        </Link>
        <Link href="/scenarios" className="btn btn-secondary w-full text-center">
          {t("backToScenarios")}
        </Link>
      </div>
    </div>
  );
}
