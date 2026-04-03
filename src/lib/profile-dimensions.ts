export const DIMENSIONS = [
  "manuel",
  "intellectuel",
  "creatif",
  "analytique",
  "interieur",
  "exterieur",
  "equipe",
  "independant",
  "contactHumain",
  "technique",
  "routine",
  "variete",
] as const;

export type Dimension = (typeof DIMENSIONS)[number];

export type ProfileVector = Record<Dimension, number>;

/** The 6 opposing pairs used for the radar chart */
export const RADAR_PAIRS: {
  a: Dimension;
  b: Dimension;
  labelKeyA: string;
  labelKeyB: string;
}[] = [
  { a: "manuel", b: "intellectuel", labelKeyA: "dim.manuel", labelKeyB: "dim.intellectuel" },
  { a: "creatif", b: "analytique", labelKeyA: "dim.creatif", labelKeyB: "dim.analytique" },
  { a: "exterieur", b: "interieur", labelKeyA: "dim.exterieur", labelKeyB: "dim.interieur" },
  { a: "equipe", b: "independant", labelKeyA: "dim.equipe", labelKeyB: "dim.independant" },
  { a: "contactHumain", b: "technique", labelKeyA: "dim.contactHumain", labelKeyB: "dim.technique" },
  { a: "variete", b: "routine", labelKeyA: "dim.variete", labelKeyB: "dim.routine" },
];

export function emptyProfile(): ProfileVector {
  return Object.fromEntries(DIMENSIONS.map((d) => [d, 0])) as ProfileVector;
}
