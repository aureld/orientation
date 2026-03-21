import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FlipCard } from "../flip-card";
import type { CareerDetail } from "@/app/actions/career";

const career: CareerDetail = {
  id: "assc",
  icon: "🏥",
  type: "CFC",
  duration: 3,
  urlOrientation: "https://orientation.ch/assc",
  name: "Assistant/e en soins",
  description: "Aide les patients au quotidien.",
  activities: ["Soins de base", "Prise de tension"],
  qualities: ["Empathie", "Rigueur"],
  passerelle: null,
  sectorId: "sante",
  sectorName: "Santé",
  sectorColor: "--color-sante",
  salary: {
    apprenticeYears: [
      { year: 1, amount: 1100 },
      { year: 2, amount: 1300 },
      { year: 3, amount: 1500 },
    ],
    postCfcMin: 4800,
    postCfcMax: 5500,
  },
  profile: {
    manuel: 3, intellectuel: 7, creatif: 2, analytique: 5,
    interieur: 8, exterieur: 2, equipe: 9, independant: 1,
    contactHumain: 10, technique: 4, routine: 5, variete: 5,
  },
};

describe("FlipCard", () => {
  it("renders the profession name and icon", () => {
    render(<FlipCard career={career} />);
    expect(screen.getByText("🏥")).toBeInTheDocument();
    expect(screen.getByText("Assistant/e en soins")).toBeInTheDocument();
  });

  it("renders type and duration on the front", () => {
    render(<FlipCard career={career} />);
    const front = document.querySelector(".flip-card-front")!;
    expect(front.textContent).toContain("CFC");
    expect(front.textContent).toContain("3");
  });

  it("renders the sector name", () => {
    render(<FlipCard career={career} />);
    expect(screen.getByText("Santé")).toBeInTheDocument();
  });

  it("renders the description on the back", () => {
    render(<FlipCard career={career} />);
    expect(screen.getByText("Aide les patients au quotidien.")).toBeInTheDocument();
  });

  it("renders all activities", () => {
    render(<FlipCard career={career} />);
    expect(screen.getByText("Soins de base")).toBeInTheDocument();
    expect(screen.getByText("Prise de tension")).toBeInTheDocument();
  });

  it("renders all qualities", () => {
    render(<FlipCard career={career} />);
    expect(screen.getByText("Empathie")).toBeInTheDocument();
    expect(screen.getByText("Rigueur")).toBeInTheDocument();
  });

  it("renders apprentice salary years", () => {
    const { container } = render(<FlipCard career={career} />);
    const salaryGrid = container.querySelector(".salary-grid")!;
    const text = salaryGrid.textContent!;
    expect(text).toMatch(/1.?100/);
    expect(text).toMatch(/1.?300/);
    expect(text).toMatch(/1.?500/);
  });

  it("renders post-CFC salary range", () => {
    const { container } = render(<FlipCard career={career} />);
    const salaryPost = container.querySelector(".salary-post")!;
    const text = salaryPost.textContent!;
    expect(text).toMatch(/4.?800/);
    expect(text).toMatch(/5.?500/);
  });

  it("renders the orientation.ch link", () => {
    render(<FlipCard career={career} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://orientation.ch/assc");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("toggles flipped state on click", async () => {
    const user = userEvent.setup();
    const { container } = render(<FlipCard career={career} />);
    const card = container.querySelector("[data-flip-card]")!;

    expect(card).not.toHaveClass("flipped");
    await user.click(card);
    expect(card).toHaveClass("flipped");
    await user.click(card);
    expect(card).not.toHaveClass("flipped");
  });

  it("renders passerelle when present", () => {
    const withPasserelle = {
      ...career,
      passerelle: "Accès au brevet fédéral aéronautique",
    };
    render(<FlipCard career={withPasserelle} />);
    expect(screen.getByText("Accès au brevet fédéral aéronautique")).toBeInTheDocument();
  });

  it("does not render passerelle section when null", () => {
    render(<FlipCard career={career} />);
    expect(screen.queryByText(/passerelle/i)).not.toBeInTheDocument();
  });

  it("handles missing salary gracefully", () => {
    const noSalary = { ...career, salary: null };
    render(<FlipCard career={noSalary} />);
    // Should still render without crashing
    expect(screen.getByText("Assistant/e en soins")).toBeInTheDocument();
  });
});
