"use client";

import { useTranslations } from "next-intl";
import { AVATARS } from "@/domain/profile";

interface AvatarPickerProps {
  selected: string;
  onSelect: (avatar: string) => void;
}

export function AvatarPicker({ selected, onSelect }: AvatarPickerProps) {
  const t = useTranslations("profile");

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-muted">{t("chooseAvatar")}</p>
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
        {AVATARS.map((avatar) => (
          <button
            key={avatar}
            type="button"
            aria-pressed={avatar === selected}
            onClick={() => onSelect(avatar)}
            className={`flex items-center justify-center rounded-xl p-2 text-2xl transition-all ${
              avatar === selected
                ? "scale-110 bg-accent/20 ring-2 ring-accent"
                : "bg-surface hover:bg-accent/10"
            }`}
          >
            {avatar}
          </button>
        ))}
      </div>
    </div>
  );
}
