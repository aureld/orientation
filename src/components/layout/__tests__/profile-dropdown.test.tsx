import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      profile: "Profile",
      settings: "Settings",
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

import { ProfileDropdown } from "../profile-dropdown";

describe("ProfileDropdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogoutUser.mockResolvedValue(undefined);
  });

  it("renders the avatar trigger button", () => {
    render(<ProfileDropdown name="Alice" avatar={"\u{1F98A}"} isGuest={false} />);
    expect(screen.getByRole("button", { name: /Alice/ })).toBeInTheDocument();
    expect(screen.getByText("\u{1F98A}")).toBeInTheDocument();
  });

  it("does not show dropdown menu by default", () => {
    render(<ProfileDropdown name="Alice" avatar={"\u{1F98A}"} isGuest={false} />);
    expect(screen.queryByRole("link", { name: /Profile/ })).not.toBeInTheDocument();
  });

  it("opens dropdown on click", async () => {
    const user = userEvent.setup();
    render(<ProfileDropdown name="Alice" avatar={"\u{1F98A}"} isGuest={false} />);

    await user.click(screen.getByRole("button", { name: /Alice/ }));

    expect(screen.getByRole("link", { name: /Profile/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Settings/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Log out/ })).toBeInTheDocument();
  });

  it("shows save progress link for guests instead of logout", async () => {
    const user = userEvent.setup();
    render(<ProfileDropdown name="Bob" avatar={null} isGuest={true} />);

    await user.click(screen.getByRole("button", { name: /Bob/ }));

    expect(screen.getByRole("link", { name: /Save progress/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Log out/ })).not.toBeInTheDocument();
  });

  it("calls logoutUser and redirects on logout", async () => {
    const user = userEvent.setup();
    render(<ProfileDropdown name="Alice" avatar={"\u{1F98A}"} isGuest={false} />);

    await user.click(screen.getByRole("button", { name: /Alice/ }));
    await user.click(screen.getByRole("button", { name: /Log out/ }));

    expect(mockLogoutUser).toHaveBeenCalledOnce();
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("closes dropdown when clicking trigger again", async () => {
    const user = userEvent.setup();
    render(<ProfileDropdown name="Alice" avatar={"\u{1F98A}"} isGuest={false} />);

    const trigger = screen.getByRole("button", { name: /Alice/ });
    await user.click(trigger);
    expect(screen.getByRole("link", { name: /Profile/ })).toBeInTheDocument();

    await user.click(trigger);
    expect(screen.queryByRole("link", { name: /Profile/ })).not.toBeInTheDocument();
  });

  it("shows first letter fallback when no avatar", () => {
    render(<ProfileDropdown name="Charlie" avatar={null} isGuest={false} />);
    expect(screen.getByText("C")).toBeInTheDocument();
  });

  it("links to correct routes", async () => {
    const user = userEvent.setup();
    render(<ProfileDropdown name="Alice" avatar={"\u{1F98A}"} isGuest={false} />);

    await user.click(screen.getByRole("button", { name: /Alice/ }));

    expect(screen.getByRole("link", { name: /Profile/ })).toHaveAttribute("href", "/profile");
    expect(screen.getByRole("link", { name: /Settings/ })).toHaveAttribute("href", "/settings");
  });
});
