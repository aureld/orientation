import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      logout: "Log out",
      saveProgress: "Save progress",
    };
    return messages[key] ?? key;
  },
}));

const mockLogoutUser = vi.fn();
vi.mock("@/app/actions/auth", () => ({
  logoutUser: (...args: unknown[]) => mockLogoutUser(...args),
}));

const mockPush = vi.fn();
vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

import { UserActions } from "../user-actions";

describe("UserActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogoutUser.mockResolvedValue(undefined);
  });

  it("renders logout button for registered users", () => {
    render(<UserActions isGuest={false} />);
    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Save progress" })).not.toBeInTheDocument();
  });

  it("renders save progress link for guest users", () => {
    render(<UserActions isGuest={true} />);
    const link = screen.getByRole("link", { name: "Save progress" });
    expect(link).toHaveAttribute("href", "/register");
    expect(screen.queryByRole("button", { name: "Log out" })).not.toBeInTheDocument();
  });

  it("calls logoutUser and redirects on logout click", async () => {
    const user = userEvent.setup();
    render(<UserActions isGuest={false} />);

    await user.click(screen.getByRole("button", { name: "Log out" }));

    expect(mockLogoutUser).toHaveBeenCalledOnce();
    expect(mockPush).toHaveBeenCalledWith("/");
  });
});
