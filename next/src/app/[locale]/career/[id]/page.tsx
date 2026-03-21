import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { HeaderBar } from "@/components/header-bar";
import { getCareerById } from "@/app/actions/career";
import { FlipCard } from "@/components/flip-card";

export default async function CareerPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const [t, career] = await Promise.all([
    getTranslations("career"),
    getCareerById(id, locale),
  ]);

  if (!career) notFound();

  return (
    <div className="animate-fade-in mx-auto max-w-2xl px-4 pb-12">
      <HeaderBar title={t("title")} showBack />
      <div className="mt-6">
        <FlipCard career={career} />
      </div>
    </div>
  );
}
