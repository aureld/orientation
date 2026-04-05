import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = { logout: "Log out" };
    return messages[key] ?? key;
  },
}));

// Mock the server action
const mockLogoutUser = vi.fn();
vi.mock("@/app/actions/auth", () => ({
  logoutUser: (...args: unknown[]) => mockLogoutUser(...args),
}));

// Mock locale-aware navigation
const mockRefresh = vi.fn();
const mockPush = vi.fn();
vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ refresh: mockRefresh, push: mockPush }),
}));

import { LogoutButton } from "../logout-button";

describe("LogoutButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogoutUser.mockResolvedValue(undefined);
  });

  it("renders a button with logout text", () => {
    render(<LogoutButton />);
    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
  });

  it("calls logoutUser and redirects on click", async () => {
    const user = userEvent.setup();
    render(<LogoutButton />);

    await user.click(screen.getByRole("button", { name: "Log out" }));

    expect(mockLogoutUser).toHaveBeenCalledOnce();
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("disables the button while logging out", async () => {
    // Make logoutUser hang so we can check the pending state
    mockLogoutUser.mockImplementation(
      () => new Promise<void>(() => {/* never resolves */}),
    );
    const user = userEvent.setup();
    render(<LogoutButton />);

    await user.click(screen.getByRole("button", { name: "Log out" }));

    expect(screen.getByRole("button")).toBeDisabled();
  });
});
