import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { HeaderBar } from "@/components/layout/header-bar";
import { getCareerById } from "@/app/actions/career";
import { getSimilarProfessions } from "@/app/actions/similar-professions";
import { CareerDetailView } from "@/components/career/career-detail";
import { SimilarProfessions } from "@/components/career/similar-professions";

export default async function CareerPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const [t, career, similar] = await Promise.all([
    getTranslations("career"),
    getCareerById(id, locale),
    getSimilarProfessions(id, locale),
  ]);

  if (!career) notFound();

  return (
    <div className="animate-fade-in mx-auto max-w-2xl px-4 pb-12">
      <HeaderBar title={t("title")} showBack />
      <div className="mt-6">
        <CareerDetailView career={career} />
        <SimilarProfessions professions={similar} />
      </div>
    </div>
  );
}
