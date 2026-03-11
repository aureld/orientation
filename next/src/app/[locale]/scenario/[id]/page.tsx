"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { HeaderBar } from "@/components/header-bar";
import { ProgressBar } from "@/components/progress-bar";

// Placeholder — will be driven by DB data + game engine
export default function ScenarioPage() {
  const t = useTranslations("scenario");
  const params = useParams<{ id: string }>();

  return (
    <div className="animate-fade-in mx-auto max-w-2xl px-4 pb-12">
      <HeaderBar title={`Scenario: ${params.id}`} />
      <ProgressBar current={1} total={3} label={params.id} />

      <div className="mt-8 rounded-xl bg-surface p-6 text-lg leading-relaxed">
        <p className="text-muted">
          Scenario content will be loaded from the database. This is a
          placeholder for scenario <strong>{params.id}</strong>.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button className="btn-choice">Choice A — placeholder</button>
        <button className="btn-choice">Choice B — placeholder</button>
        <button className="btn-choice">Choice C — placeholder</button>
      </div>

      <button className="btn btn-secondary mt-8 w-full opacity-60">
        {t("quit")}
      </button>
    </div>
  );
}
