"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { loginUser } from "@/app/actions/auth";

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await loginUser(email, password);
      if (result.error) {
        setError(t(`errors.${result.error}` as "errors.invalidCredentials"));
      } else {
        router.push("/scenarios");
      }
    });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-3xl font-bold">{t("login")}</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("email")}
            className="w-full rounded-xl border-2 border-border bg-surface px-4 py-3 outline-none focus:border-accent"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("password")}
            className="w-full rounded-xl border-2 border-border bg-surface px-4 py-3 outline-none focus:border-accent"
            required
          />

          {error && (
            <p className="text-center text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isPending}
          >
            {t("loginButton")}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          {t("noAccount")}{" "}
          <Link href="/register" className="text-accent hover:underline">
            {t("register")}
          </Link>
        </p>
      </div>
    </div>
  );
}
