import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressBar } from "../progress-bar";

describe("ProgressBar", () => {
  it("renders without label", () => {
    const { container } = render(<ProgressBar current={3} total={10} />);
    // Should have the bar but no label text
    const bar = container.querySelector("[style]");
    expect(bar).toBeInTheDocument();
    expect(screen.queryByText("3/10")).not.toBeInTheDocument();
  });

  it("renders label and counter when label is provided", () => {
    render(<ProgressBar current={3} total={10} label="Progress" />);
    expect(screen.getByText("Progress")).toBeInTheDocument();
    expect(screen.getByText("3/10")).toBeInTheDocument();
  });

  it("sets width to correct percentage", () => {
    const { container } = render(<ProgressBar current={3} total={10} />);
    const innerBar = container.querySelector(".bg-accent");
    expect(innerBar).toHaveStyle({ width: "30%" });
  });

  it("handles 0/0 gracefully (no division by zero)", () => {
    const { container } = render(<ProgressBar current={0} total={0} />);
    const innerBar = container.querySelector(".bg-accent");
    expect(innerBar).toHaveStyle({ width: "0%" });
  });

  it("shows 100% when current equals total", () => {
    const { container } = render(<ProgressBar current={5} total={5} />);
    const innerBar = container.querySelector(".bg-accent");
    expect(innerBar).toHaveStyle({ width: "100%" });
  });

  it("shows 0% when current is 0", () => {
    const { container } = render(<ProgressBar current={0} total={10} />);
    const innerBar = container.querySelector(".bg-accent");
    expect(innerBar).toHaveStyle({ width: "0%" });
  });
});
