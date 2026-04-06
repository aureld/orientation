"use client";

import { Link } from "@/i18n/navigation";

interface ProfileIconProps {
  name: string;
  avatar: string | null;
}

export function ProfileIcon({ name, avatar }: ProfileIconProps) {
  return (
    <Link
      href="/profile"
      className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm transition-colors hover:bg-accent/10"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-base">
        {avatar ?? name.charAt(0).toUpperCase()}
      </span>
      <span className="max-w-[5rem] truncate font-semibold">{name}</span>
    </Link>
  );
}
