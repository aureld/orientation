export interface EmbeddableTranslation {
  name: string;
  description: string;
  activities: string[];
  qualities: string[];
  domainesProfessionnels: string | null;
  descriptionFull: string | null;
  autresInformations: string | null;
}

const MAX_LENGTH = 8000;

export function composeEmbeddingText(t: EmbeddableTranslation): string {
  const parts: string[] = [t.name];

  if (t.domainesProfessionnels) {
    parts.push(`Domaine: ${t.domainesProfessionnels}`);
  }
  if (t.description) {
    parts.push(t.description);
  }
  if (t.activities.length > 0) {
    parts.push(`Activités: ${t.activities.join(", ")}`);
  }
  if (t.qualities.length > 0) {
    parts.push(`Qualités: ${t.qualities.join(", ")}`);
  }
  if (t.descriptionFull) {
    parts.push(t.descriptionFull);
  }
  if (t.autresInformations) {
    parts.push(t.autresInformations);
  }

  return parts.join("\n\n").slice(0, MAX_LENGTH);
}
