"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { logoutUser } from "@/app/actions/auth";

interface ProfileDropdownProps {
  name: string;
  avatar: string | null;
  isGuest: boolean;
}

export function ProfileDropdown({ name, avatar, isGuest }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const t = useTranslations("nav");

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function handleLogout() {
    startTransition(async () => {
      await logoutUser();
      setOpen(false);
      router.push("/");
    });
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm transition-colors hover:bg-accent/10"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-base">
          {avatar ?? name.charAt(0).toUpperCase()}
        </span>
        <span className="max-w-[5rem] truncate font-semibold">{name}</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-48 overflow-hidden rounded-xl border-2 border-border bg-surface shadow-lg">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-accent/10"
          >
            <span className="text-base">{"\u{1F464}"}</span>
            {t("profile")}
          </Link>
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-accent/10"
          >
            <span className="text-base">{"\u2699\uFE0F"}</span>
            {t("settings")}
          </Link>

          <div className="border-t border-border" />

          {isGuest ? (
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/10"
            >
              <span className="text-base">{"\u{1F4BE}"}</span>
              {t("saveProgress")}
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              disabled={pending}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-muted transition-colors hover:bg-accent/10"
            >
              <span className="text-base">{"\u{1F6AA}"}</span>
              {t("logout")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
