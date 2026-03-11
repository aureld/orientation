"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { HeaderBar } from "@/components/header-bar";

// Placeholder — will fetch profession from DB
export default function CareerPage() {
  const t = useTranslations("career");
  const params = useParams<{ id: string }>();

  return (
    <div className="animate-fade-in mx-auto max-w-2xl px-4 pb-12">
      <HeaderBar title={t("title")} showBack />

      <div className="mt-6 text-center text-muted italic">
        Career detail for <strong>{params.id}</strong> will be loaded from the
        database with the flip card component.
      </div>
    </div>
  );
}
