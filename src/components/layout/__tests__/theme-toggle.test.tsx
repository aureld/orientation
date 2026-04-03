import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "../theme-toggle";

// Mock localStorage since jsdom doesn't fully support it
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorageMock.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("renders a button", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("defaults to light mode (moon icon)", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button")).toHaveTextContent("🌙");
  });

  it("toggles to dark mode on click", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button"));

    expect(screen.getByRole("button")).toHaveTextContent("☀️");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorageMock.getItem("darkMode")).toBe("true");
  });

  it("toggles back to light mode on second click", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("button"));

    expect(screen.getByRole("button")).toHaveTextContent("🌙");
    expect(document.documentElement.getAttribute("data-theme")).toBe("");
    expect(localStorageMock.getItem("darkMode")).toBe("false");
  });

  it("restores dark mode from localStorage on mount", () => {
    localStorageMock.setItem("darkMode", "true");
    render(<ThemeToggle />);

    expect(screen.getByRole("button")).toHaveTextContent("☀️");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });
});
