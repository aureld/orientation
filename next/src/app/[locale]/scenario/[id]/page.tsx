import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getScenarioById } from "@/app/actions/scenarios";
import { ScenarioPlayer } from "@/components/scenario-player";

export default async function ScenarioPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const [t, scenario] = await Promise.all([
    getTranslations("scenario"),
    getScenarioById(id, locale),
  ]);

  if (!scenario) notFound();

  return (
    <div className="animate-fade-in mx-auto max-w-2xl px-4 pb-12">
      <ScenarioPlayer
        scenario={scenario}
        labels={{
          quit: t("quit"),
          bravo: t("bravo"),
          endMessage: t("endMessage", { title: scenario.title }),
          discoveredCareers: t("discoveredCareers"),
          continueAdventures: t("continueAdventures"),
          viewResults: t("viewResults"),
        }}
      />
    </div>
  );
}
