"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useState, useTransition } from "react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { startGame } from "@/app/actions/game-state";

export default function HomePage() {
  const t = useTranslations("home");
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleStart() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError(true);
      return;
    }
    startTransition(async () => {
      await startGame(trimmed);
      router.push("/scenarios");
    });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="mb-2 text-4xl">{"\u2708\uFE0F\u{1F3D7}\uFE0F\u{1F4BB}\u{1F373}\u{1F33E}"}</div>
      <h1 className="mb-2 text-4xl font-extrabold text-accent">{t("title")}</h1>
      <p className="mb-8 text-lg text-muted">{t("subtitle")}</p>

      <div className="mb-6 w-full max-w-xs">
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(false);
          }}
          placeholder={error ? t("nameRequired") : t("namePlaceholder")}
          className={`w-full rounded-xl border-2 px-4 py-3 text-center text-lg outline-none transition-colors ${
            error
              ? "border-red-500 placeholder:text-red-400"
              : "border-border focus:border-accent"
          } bg-surface`}
          onKeyDown={(e) => e.key === "Enter" && handleStart()}
          disabled={isPending}
        />
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={handleStart}
          className="btn btn-primary animate-pulse"
          disabled={isPending}
        >
          {isPending ? "..." : t("start")}
        </button>
      </div>

      <div className="mt-12 flex gap-6 text-sm text-muted">
        <button
          onClick={() => alert(t("aboutText"))}
          className="hover:text-foreground transition-colors"
        >
          {t("about")}
        </button>
      </div>
    </div>
  );
}
