import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AVATARS } from "@/domain/profile";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      chooseAvatar: "Choose your avatar",
    };
    return messages[key] ?? key;
  },
}));

import { AvatarPicker } from "../avatar-picker";

describe("AvatarPicker", () => {
  it("renders all avatar options", () => {
    render(<AvatarPicker selected={AVATARS[0]} onSelect={vi.fn()} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(AVATARS.length);
  });

  it("marks the selected avatar", () => {
    render(<AvatarPicker selected={AVATARS[2]} onSelect={vi.fn()} />);
    const buttons = screen.getAllByRole("button");
    const selected = buttons.find((b) => b.getAttribute("aria-pressed") === "true");
    expect(selected).toBeDefined();
    expect(selected!.textContent).toBe(AVATARS[2]);
  });

  it("calls onSelect when an avatar is clicked", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<AvatarPicker selected={AVATARS[0]} onSelect={onSelect} />);

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[3]);

    expect(onSelect).toHaveBeenCalledWith(AVATARS[3]);
  });
});
