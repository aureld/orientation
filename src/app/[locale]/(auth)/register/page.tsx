"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { registerUser } from "@/app/actions/auth";
import { AvatarPicker } from "@/components/game/avatar-picker";
import { DEFAULT_AVATAR } from "@/domain/profile";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const tp = useTranslations("profile");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR as string);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError(t("errors.passwordMismatch"));
      return;
    }

    startTransition(async () => {
      const result = await registerUser(email, password, avatar);
      if (result.error) {
        setError(t(`errors.${result.error}` as "errors.invalidEmail"));
      } else {
        router.push("/scenarios");
      }
    });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-3xl font-bold">{t("register")}</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="mb-2">
            <AvatarPicker selected={avatar} onSelect={setAvatar} />
          </div>

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
            minLength={6}
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder={t("confirmPassword")}
            className="w-full rounded-xl border-2 border-border bg-surface px-4 py-3 outline-none focus:border-accent"
            required
            minLength={6}
          />

          {error && (
            <p className="text-center text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isPending}
          >
            {t("registerButton")}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          {t("hasAccount")}{" "}
          <Link href="/login" className="text-accent hover:underline">
            {t("login")}
          </Link>
        </p>
      </div>
    </div>
  );
}
