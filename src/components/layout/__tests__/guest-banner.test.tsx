import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      guestBanner: "Create an account to save your progress!",
      registerButton: "Sign up",
    };
    return messages[key] ?? key;
  },
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

import { GuestBanner } from "../guest-banner";

describe("GuestBanner", () => {
  it("renders the banner message and register link", () => {
    render(<GuestBanner />);

    expect(screen.getByText("Create an account to save your progress!")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "Sign up" });
    expect(link).toHaveAttribute("href", "/register");
  });
});
