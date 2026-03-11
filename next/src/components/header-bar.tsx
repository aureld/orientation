"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

interface HeaderBarProps {
  title: string;
  showBack?: boolean;
  right?: ReactNode;
}

export function HeaderBar({ title, showBack, right }: HeaderBarProps) {
  const router = useRouter();
  const t = useTranslations("common");

  return (
    <div className="flex items-center justify-between py-3">
      {showBack ? (
        <button
          onClick={() => router.back()}
          className="text-sm font-semibold text-accent hover:underline"
        >
          ← {t("back")}
        </button>
      ) : (
        <div />
      )}
      <span className="text-xs font-bold tracking-wider text-muted uppercase">
        {title}
      </span>
      {right || <div />}
    </div>
  );
}
