"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { HeaderBar } from "@/components/layout/header-bar";
import { ProfileDropdown } from "@/components/layout/profile-dropdown";
import { GuestBanner } from "@/components/layout/guest-banner";
import { RadarChart } from "@/components/game/radar-chart";
import { getRadarData } from "@/domain/matching/radar";
import { emptyProfile } from "@/domain/profile";
import { getUserGameState, type UserProgressDTO } from "@/app/actions/game-state";

export default function ResultsPage() {
  const t = useTranslations("results");
  const [gameState, setGameState] = useState<UserProgressDTO | null>(null);

  useEffect(() => {
    getUserGameState().then(setGameState);
  }, []);

  const profile = gameState?.profile ?? emptyProfile();
  const radarData = getRadarData(profile);
  const scenarioCount = gameState?.completedScenarioIds.length ?? 0;
  const isGuest = gameState?.isGuest ?? true;

  return (
    <div className="animate-fade-in mx-auto max-w-2xl px-4 pb-12">
      <HeaderBar
        title={t("title")}
        showBack
        right={
          gameState ? (
            <ProfileDropdown
              name={gameState.name}
              avatar={gameState.avatar}
              isGuest={isGuest}
            />
          ) : undefined
        }
      />

      {isGuest && gameState && (
        <div className="mt-3">
          <GuestBanner />
        </div>
      )}

      <h2 className="mt-6 text-2xl font-bold">
        {t("profileTitle", { name: gameState?.name ?? "" })}
      </h2>
      <p className="text-muted">{t("basedOn", { count: scenarioCount })}</p>

      <div className="my-6">
        <RadarChart data={radarData} />
      </div>

      <h2 className="text-2xl font-bold">{t("recommended")}</h2>
      <p className="mb-4 text-muted">{t("recommendedSub")}</p>

      {scenarioCount < 3 && (
        <p className="text-center text-muted italic">
          {t("basedOn", { count: scenarioCount })}
        </p>
      )}

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
