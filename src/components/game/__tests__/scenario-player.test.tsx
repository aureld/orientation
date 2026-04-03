import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ScenarioPlayer } from "../scenario-player";
import type { ScenarioDetail } from "@/app/actions/scenarios";

// Mock next-intl navigation
vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

// Mock next/navigation (used by HeaderBar)
vi.mock("next/navigation", () => ({
  useRouter: () => ({ back: vi.fn() }),
}));

// Mock next-intl (used by HeaderBar)
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

const scenario: ScenarioDetail = {
  id: "hopital",
  icon: "🏥",
  title: "Une journée à l'hôpital",
  description: "Découvre les coulisses...",
  scenes: [
    {
      sceneKey: "arrivee", text: "Tu arrives à l'hôpital.", isFinal: false, sortOrder: 0,
      choices: [
        { id: "c1", text: "Les urgences", nextSceneKey: "urgencesFin", tags: { manuel: 0, intellectuel: 0, creatif: 0, analytique: 0, interieur: 0, exterieur: 0, equipe: 1, independant: 0, contactHumain: 2, technique: 0, routine: 0, variete: 2 } },
        { id: "c2", text: "Le labo", nextSceneKey: "laboFin", tags: { manuel: 0, intellectuel: 0, creatif: 0, analytique: 2, interieur: 0, exterieur: 0, equipe: 0, independant: 1, contactHumain: 0, technique: 2, routine: 0, variete: 0 } },
      ],
      endProfessions: [],
    },
    {
      sceneKey: "urgencesFin", text: "Fin des urgences.", isFinal: true, sortOrder: 1,
      choices: [],
      endProfessions: [
        { id: "assc", icon: "⚕️", type: "CFC", duration: 3, name: "ASSC" },
      ],
    },
    {
      sceneKey: "laboFin", text: "Fin du labo.", isFinal: true, sortOrder: 2,
      choices: [],
      endProfessions: [
        { id: "laborantin", icon: "🔬", type: "CFC", duration: 3, name: "Laborantin/e" },
      ],
    },
  ],
};

const labels = {
  quit: "Quitter",
  bravo: "Bravo !",
  endMessage: "Tu as terminé le scénario.",
  discoveredCareers: "Métiers découverts",
  continueAdventures: "Continuer",
  viewResults: "Voir mes résultats",
};

describe("ScenarioPlayer", () => {
  it("renders the first scene text", () => {
    render(<ScenarioPlayer scenario={scenario} labels={labels} />);
    expect(screen.getByText("Tu arrives à l'hôpital.")).toBeInTheDocument();
  });

  it("renders all choices for the current scene", () => {
    render(<ScenarioPlayer scenario={scenario} labels={labels} />);
    expect(screen.getByText("Les urgences")).toBeInTheDocument();
    expect(screen.getByText("Le labo")).toBeInTheDocument();
  });

  it("advances to the end screen when a choice leads to a final scene", async () => {
    const user = userEvent.setup();
    render(<ScenarioPlayer scenario={scenario} labels={labels} />);

    await user.click(screen.getByText("Les urgences"));

    // End screen is shown instead of the scene text
    expect(screen.getByText("Bravo !")).toBeInTheDocument();
    expect(screen.queryByText("Tu arrives à l'hôpital.")).not.toBeInTheDocument();
  });

  it("shows end screen with discovered professions on final scene", async () => {
    const user = userEvent.setup();
    render(<ScenarioPlayer scenario={scenario} labels={labels} />);

    await user.click(screen.getByText("Les urgences"));

    expect(screen.getByText("Bravo !")).toBeInTheDocument();
    expect(screen.getByText("Métiers découverts")).toBeInTheDocument();
    expect(screen.getByText("ASSC")).toBeInTheDocument();
  });

  it("shows quit button during non-final scenes", () => {
    render(<ScenarioPlayer scenario={scenario} labels={labels} />);
    expect(screen.getByText("Quitter")).toBeInTheDocument();
  });

  it("shows continue link on final scene", async () => {
    const user = userEvent.setup();
    render(<ScenarioPlayer scenario={scenario} labels={labels} />);

    await user.click(screen.getByText("Le labo"));

    expect(screen.getByText("Continuer")).toBeInTheDocument();
  });

  it("renders the correct end professions for the chosen path", async () => {
    const user = userEvent.setup();
    render(<ScenarioPlayer scenario={scenario} labels={labels} />);

    await user.click(screen.getByText("Le labo"));

    expect(screen.getByText("Laborantin/e")).toBeInTheDocument();
    expect(screen.queryByText("ASSC")).not.toBeInTheDocument();
  });
});
