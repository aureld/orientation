"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { HeaderBar } from "@/components/layout/header-bar";
import { ProfileDropdown } from "@/components/layout/profile-dropdown";
import { GuestBanner } from "@/components/layout/guest-banner";
import { AvatarPicker } from "@/components/game/avatar-picker";
import { RadarChart } from "@/components/game/radar-chart";
import { getRadarData } from "@/domain/matching/radar";
import { emptyProfile, DEFAULT_AVATAR } from "@/domain/profile";
import { getUserGameState, updateAvatar, type UserProgressDTO } from "@/app/actions/game-state";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const ts = useTranslations("profile.stats");
  const [gameState, setGameState] = useState<UserProgressDTO | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getUserGameState().then(setGameState);
  }, []);

  const profile = gameState?.profile ?? emptyProfile();
  const radarData = getRadarData(profile);
  const scenarioCount = gameState?.completedScenarioIds.length ?? 0;
  const isGuest = gameState?.isGuest ?? true;
  const currentAvatar = gameState?.avatar ?? DEFAULT_AVATAR;

  function handleAvatarSelect(avatar: string) {
    startTransition(async () => {
      const result = await updateAvatar(avatar);
      if (!result.error) {
        setGameState((prev) => prev ? { ...prev, avatar } : prev);
        setShowPicker(false);
      }
    });
  }

  const stats = [
    { label: ts("points"), value: String(gameState?.choiceCount ?? 0), icon: "\u2B50" },
    { label: ts("scenarios"), value: `${scenarioCount}/11`, icon: "\u{1F3AE}" },
    { label: ts("badges"), value: "0/8", icon: "\u{1F3C5}" },
    { label: ts("careersSeen"), value: "0", icon: "\u{1F4DA}" },
  ];

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

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={() => setShowPicker((v) => !v)}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-4xl transition-transform hover:scale-110"
          disabled={isPending}
        >
          {currentAvatar}
        </button>
        <div>
          <h2 className="text-2xl font-bold">
            {gameState?.name ?? ""}
          </h2>
          <button
            type="button"
            onClick={() => setShowPicker((v) => !v)}
            className="text-xs text-accent hover:underline"
          >
            {t("changeAvatar")}
          </button>
        </div>
      </div>

      {showPicker && (
        <div className="mt-4">
          <AvatarPicker selected={currentAvatar} onSelect={handleAvatarSelect} />
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
