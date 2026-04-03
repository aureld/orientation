import { describe, it, expect } from "vitest";
import {
  composeEmbeddingText,
  type EmbeddableTranslation,
} from "../embeddings/compose-text";

function makeTranslation(
  overrides: Partial<EmbeddableTranslation> = {}
): EmbeddableTranslation {
  return {
    name: "Informaticien/ne CFC",
    description: "Développe des logiciels et solutions informatiques",
    activities: [
      "Programmer des applications",
      "Analyser les besoins des clients",
    ],
    qualities: ["Logique", "Précision", "Travail en équipe"],
    domainesProfessionnels: "Informatique, multimédia",
    descriptionFull: "Description complète du métier d'informaticien.",
    autresInformations: "Intérêts: technologies, résolution de problèmes",
    ...overrides,
  };
}

describe("composeEmbeddingText", () => {
  it("includes the profession name", () => {
    const text = composeEmbeddingText(makeTranslation());
    expect(text).toContain("Informaticien/ne CFC");
  });

  it("includes the description", () => {
    const text = composeEmbeddingText(makeTranslation());
    expect(text).toContain(
      "Développe des logiciels et solutions informatiques"
    );
  });

  it("includes activities as a comma-separated list", () => {
    const text = composeEmbeddingText(makeTranslation());
    expect(text).toContain("Programmer des applications");
    expect(text).toContain("Analyser les besoins des clients");
  });

  it("includes qualities as a comma-separated list", () => {
    const text = composeEmbeddingText(makeTranslation());
    expect(text).toContain("Logique");
    expect(text).toContain("Précision");
  });

  it("includes domainesProfessionnels", () => {
    const text = composeEmbeddingText(makeTranslation());
    expect(text).toContain("Informatique, multimédia");
  });

  it("includes descriptionFull", () => {
    const text = composeEmbeddingText(makeTranslation());
    expect(text).toContain("Description complète du métier d'informaticien.");
  });

  it("includes autresInformations", () => {
    const text = composeEmbeddingText(makeTranslation());
    expect(text).toContain("technologies, résolution de problèmes");
  });

  it("omits null fields gracefully", () => {
    const text = composeEmbeddingText(
      makeTranslation({
        domainesProfessionnels: null,
        descriptionFull: null,
        autresInformations: null,
      })
    );
    expect(text).not.toContain("null");
    expect(text).not.toContain("undefined");
    expect(text).toContain("Informaticien/ne CFC");
  });

  it("omits empty arrays gracefully", () => {
    const text = composeEmbeddingText(
      makeTranslation({ activities: [], qualities: [] })
    );
    expect(text).not.toContain("Activités:");
    expect(text).not.toContain("Qualités:");
  });

  it("omits empty description", () => {
    const text = composeEmbeddingText(makeTranslation({ description: "" }));
    // Should still have the name and other fields, but no empty line for description
    expect(text).toContain("Informaticien/ne CFC");
    expect(text.split("\n\n").every((part) => part.trim().length > 0)).toBe(
      true
    );
  });

  it("handles a minimal profession with only a name", () => {
    const text = composeEmbeddingText(
      makeTranslation({
        description: "",
        activities: [],
        qualities: [],
        domainesProfessionnels: null,
        descriptionFull: null,
        autresInformations: null,
      })
    );
    expect(text).toBe("Informaticien/ne CFC");
  });

  it("produces deterministic output", () => {
    const t = makeTranslation();
    expect(composeEmbeddingText(t)).toBe(composeEmbeddingText(t));
  });

  it("truncates to 8000 characters max", () => {
    const longDescription = "A".repeat(10000);
    const text = composeEmbeddingText(
      makeTranslation({ descriptionFull: longDescription })
    );
    expect(text.length).toBeLessThanOrEqual(8000);
  });
});
