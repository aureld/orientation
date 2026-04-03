"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { semanticSearch, type SemanticSearchResult } from "@/app/actions/semantic-search";

export function CareerSearch({ locale }: { locale: string }) {
  const t = useTranslations("careers");
  const tc = useTranslations("common");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SemanticSearchResult[] | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) {
      setResults(null);
      return;
    }
    startTransition(async () => {
      const data = await semanticSearch(query, locale);
      setResults(data);
    });
  }

  function handleClear() {
    setQuery("");
    setResults(null);
  }

  return (
    <div className="mt-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]"
        />
        <button
          type="submit"
          disabled={isPending}
          className="btn rounded-lg px-4 py-2.5 text-sm font-medium"
        >
          {isPending ? tc("loading") : t("search")}
        </button>
      </form>

      {results !== null && (
        <div className="mt-4">
          {results.length > 0 ? (
            <>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold">
                  {t("searchResults", { query })}
                </h3>
                <button
                  onClick={handleClear}
                  className="text-xs text-muted hover:underline"
                >
                  {t("clearSearch")}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {results.map((r) => (
                  <Link
                    key={r.id}
                    href={`/career/${r.id}`}
                    className="scenario-card flex items-center gap-3 px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold leading-tight">
                        {r.name}
                      </div>
                      <div className="text-xs text-muted">
                        {r.score}% {tc("compatibility")}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">{t("noResults")}</p>
              <button
                onClick={handleClear}
                className="text-xs text-muted hover:underline"
              >
                {t("clearSearch")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
