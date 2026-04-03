import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HeaderBar } from "@/components/header-bar";
import { CareerSearch } from "@/components/career-search";
import { getAllCareers } from "@/app/actions/careers";

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, tc, careers] = await Promise.all([
    getTranslations("careers"),
    getTranslations("common"),
    getAllCareers(locale),
  ]);

  return (
    <div className="animate-fade-in mx-auto max-w-2xl px-4 pb-12">
      <HeaderBar title={t("title")} showBack />

      <h2 className="mt-6 text-2xl font-bold">
        {careers.total} {t("count")}
      </h2>
      <p className="text-muted">{t("instructions")}</p>

      <CareerSearch locale={locale} />

      <div className="mt-6 space-y-8">
        {careers.groups.map((group) => (
          <section key={group.groupCode}>
            <h3 className="mb-3 text-lg font-bold">
              {group.domain}
              <span className="ml-2 text-sm font-normal text-muted">
                ({group.professions.length})
              </span>
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {group.professions.map((p) => (
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
