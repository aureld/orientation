import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HeaderBar } from "@/components/header-bar";
import { getCareersGroupedBySector } from "@/app/actions/careers";

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, tc, sectors] = await Promise.all([
    getTranslations("careers"),
    getTranslations("common"),
    getCareersGroupedBySector(locale),
  ]);

  const totalCount = sectors.reduce((sum, s) => sum + s.professions.length, 0);

  return (
    <div className="animate-fade-in mx-auto max-w-2xl px-4 pb-12">
      <HeaderBar title={t("title")} showBack />

      <h2 className="mt-6 text-2xl font-bold">
        {totalCount} {t("count").replace(/^\d+\s*/, "")}
      </h2>
      <p className="text-muted">{t("instructions")}</p>

      <div className="mt-6 space-y-8">
        {sectors.map((sector) => (
          <section key={sector.sectorId}>
            <h3
              className="mb-3 text-lg font-bold"
              style={{ color: `var(${`--color-${sector.sectorId}`})` }}
            >
              {sector.sectorName}
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {sector.professions.map((p) => (
                <Link
                  key={p.id}
                  href={`/career/${p.id}`}
                  className="scenario-card flex items-center gap-3 px-4 py-3"
                >
                  <span className="text-2xl">{p.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold leading-tight">{p.name}</div>
                    <div className="text-xs text-muted">
                      {p.type} · {p.duration} {tc("years")}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
