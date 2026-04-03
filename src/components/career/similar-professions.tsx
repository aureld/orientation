"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { SimilarProfessionResult } from "@/app/actions/similar-professions";

export function SimilarProfessions({
  professions,
}: {
  professions: SimilarProfessionResult[];
}) {
  const t = useTranslations("career");

  if (professions.length === 0) return null;

  return (
    <section className="mt-8">
      <h3 className="mb-1 text-lg font-bold">{t("similarProfessions")}</h3>
      <p className="mb-4 text-sm text-muted">{t("similarDescription")}</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {professions.map((p) => (
          <Link
            key={p.id}
            href={`/career/${p.id}`}
            className="scenario-card flex items-center gap-3 px-4 py-3"
          >
            <span className="text-2xl">{p.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold leading-tight">{p.name}</div>
              <div className="text-xs text-muted">
                {p.type} · {p.score}% {t("similarProfessions").toLowerCase().split(" ")[0]}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
