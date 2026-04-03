import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HeaderBar } from "@/components/header-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { getScenarioList } from "@/app/actions/scenarios";

export default async function ScenariosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, scenarios] = await Promise.all([
    getTranslations("scenarios"),
    getScenarioList(locale),
  ]);

  return (
    <div className="animate-fade-in mx-auto max-w-2xl px-4 pb-12">
      <HeaderBar
        title={t("title")}
        right={<ThemeToggle />}
      />

      <div className="mb-2 mt-4">
        <p className="text-muted">{t("instructions")}</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {scenarios.map((s) => (
          <Link
            key={s.id}
            href={`/scenario/${s.id}`}
            className="scenario-card flex flex-col items-center gap-2 py-5 text-center"
          >
            <span className="text-3xl">{s.icon}</span>
            <div className="text-sm font-bold">{s.title}</div>
            <div
              className="text-xs font-semibold"
              style={{ color: `var(${s.sectorColor})` }}
            >
              {s.sectorName}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Link href="/careers" className="btn btn-secondary w-full text-center">
          {t("exploreAll")}
        </Link>
      </div>
    </div>
  );
}
