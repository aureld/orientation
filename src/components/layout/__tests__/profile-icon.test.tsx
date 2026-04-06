import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

import { ProfileIcon } from "../profile-icon";

describe("ProfileIcon", () => {
  it("renders avatar and name, linking to profile", () => {
    render(<ProfileIcon name="Alice" avatar={"\u{1F98A}"} />);

    expect(screen.getByText("\u{1F98A}")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/profile");
  });

  it("shows default avatar when none provided", () => {
    render(<ProfileIcon name="Bob" avatar={null} />);

    // Should show the first letter of the name as fallback
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });
});
