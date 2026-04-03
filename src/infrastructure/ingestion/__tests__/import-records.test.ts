import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock Prisma ──────────────────────────────────────
vi.mock("@/infrastructure/db", () => ({
  prisma: {
    profession: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    professionTranslation: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import { prisma } from "@/infrastructure/db";
import {
  slugify,
  extractDuration,
  swissdocMainGroup,
  extractOrientationId,
  importRecords,
} from "../import-records";
import type { ScrapedRecord } from "@/scrapers/types";

const mockProfFindMany = vi.mocked(prisma.profession.findMany);
const mockProfCreate = vi.mocked(prisma.profession.create);
const mockProfUpdate = vi.mocked(prisma.profession.update);
const mockTransFindUnique = vi.mocked(prisma.professionTranslation.findUnique);
const mockTransCreate = vi.mocked(prisma.professionTranslation.create);
const mockTransUpdate = vi.mocked(prisma.professionTranslation.update);

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── Pure helpers ─────────────────────────────────────

describe("slugify", () => {
  it("extracts first part before CFC and slugifies", () => {
    expect(slugify("Informaticien CFC / Informaticienne CFC")).toBe("informaticien");
  });

  it("removes accented characters", () => {
    expect(slugify("Agent de propreté CFC / Agente de propreté CFC")).toBe(
      "agent-de-proprete"
    );
  });

  it("handles names without CFC suffix", () => {
    expect(slugify("Mécanicien")).toBe("mecanicien");
  });
});

describe("extractDuration", () => {
  it("extracts duration from formation text", () => {
    expect(extractDuration("### Durée\n4 ans de formation")).toBe(4);
  });

  it("defaults to 3 when no match", () => {
    expect(extractDuration("No duration info")).toBe(3);
  });
});

describe("swissdocMainGroup", () => {
  it("extracts main group from swissdoc code", () => {
    expect(swissdocMainGroup("0.561.28.0")).toBe("500");
  });

  it("works for group 100", () => {
    expect(swissdocMainGroup("0.130.4.0")).toBe("100");
  });
});

describe("extractOrientationId", () => {
  it("extracts id from orientation.ch URL", () => {
    expect(
      extractOrientationId("https://www.orientation.ch/dyn/show/1900?id=947")
    ).toBe("947");
  });

  it("returns null for URL without id", () => {
    expect(extractOrientationId("https://example.com/page")).toBeNull();
  });
});

// ─── importRecords (DB logic) ─────────────────────────

function makeRecord(overrides: Partial<ScrapedRecord["data"]> = {}): ScrapedRecord {
  return {
    externalId: "947",
    sourceId: "orientation-ch",
    locale: "fr",
    data: {
      name: "Informaticien CFC / Informaticienne CFC",
      url: "https://www.orientation.ch/dyn/show/1900?id=947",
      orientationId: "947",
      swissdoc: "0.561.28.0",
      domainesProfessionnels: "Informatique",
      niveauxDeFormation: "CFC",
      miseAJour: "2024",
      description: "A profession",
      formation: "### Durée\n4 ans",
      perspectivesProfessionnelles: "Good prospects",
      autresInformations: "Other info",
      adressesUtiles: "Addresses",
      ...overrides,
    },
  };
}

describe("importRecords", () => {
  it("creates new profession when no match found", async () => {
    mockProfFindMany.mockResolvedValueOnce([]);
    mockProfCreate.mockResolvedValueOnce({} as never);
    mockTransFindUnique.mockResolvedValueOnce(null);
    mockTransCreate.mockResolvedValueOnce({} as never);

    const result = await importRecords([makeRecord()], "fr");

    expect(result).toEqual({ created: 1, updated: 0 });
    expect(mockProfCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        id: "informaticien",
        type: "CFC",
        duration: 4,
        swissdoc: "0.561.28.0",
        swissdocGroup: "500",
      }),
    });
  });

  it("matches existing profession by swissdoc", async () => {
    mockProfFindMany.mockResolvedValueOnce([
      { id: "existing-prof", swissdoc: "0.561.28.0", urlOrientation: null },
    ] as never);
    mockProfUpdate.mockResolvedValueOnce({} as never);
    mockTransFindUnique.mockResolvedValueOnce(null);
    mockTransCreate.mockResolvedValueOnce({} as never);

    const result = await importRecords([makeRecord()], "fr");

    expect(result).toEqual({ created: 0, updated: 1 });
    expect(mockProfUpdate).toHaveBeenCalledWith({
      where: { id: "existing-prof" },
      data: { swissdoc: "0.561.28.0", swissdocGroup: "500" },
    });
  });

  it("matches by orientationId when swissdoc misses", async () => {
    mockProfFindMany.mockResolvedValueOnce([
      {
        id: "matched-by-url",
        swissdoc: null,
        urlOrientation: "https://www.orientation.ch/dyn/show/1900?id=947",
      },
    ] as never);
    mockProfUpdate.mockResolvedValueOnce({} as never);
    mockTransFindUnique.mockResolvedValueOnce(null);
    mockTransCreate.mockResolvedValueOnce({} as never);

    const result = await importRecords([makeRecord()], "fr");

    expect(result).toEqual({ created: 0, updated: 1 });
    expect(mockProfUpdate).toHaveBeenCalledWith({
      where: { id: "matched-by-url" },
      data: expect.objectContaining({ swissdoc: "0.561.28.0" }),
    });
  });

  it("matches by slug when swissdoc and orientationId miss", async () => {
    mockProfFindMany.mockResolvedValueOnce([
      { id: "informaticien", swissdoc: null, urlOrientation: null },
    ] as never);
    mockProfUpdate.mockResolvedValueOnce({} as never);
    mockTransFindUnique.mockResolvedValueOnce(null);
    mockTransCreate.mockResolvedValueOnce({} as never);

    const result = await importRecords([makeRecord()], "fr");

    expect(result).toEqual({ created: 0, updated: 1 });
    expect(mockProfUpdate).toHaveBeenCalledWith({
      where: { id: "informaticien" },
      data: expect.objectContaining({ swissdoc: "0.561.28.0" }),
    });
  });

  it("preserves hand-curated fields when translation exists", async () => {
    mockProfFindMany.mockResolvedValueOnce([
      { id: "informaticien", swissdoc: "0.561.28.0", urlOrientation: null },
    ] as never);
    mockProfUpdate.mockResolvedValueOnce({} as never);
    mockTransFindUnique.mockResolvedValueOnce({
      id: 42,
      name: "Curated name",
      description: "Curated desc",
    } as never);
    mockTransUpdate.mockResolvedValueOnce({} as never);

    await importRecords([makeRecord()], "fr");

    // Should update only orientation fields, not overwrite curated data
    expect(mockTransUpdate).toHaveBeenCalledWith({
      where: { id: 42 },
      data: expect.objectContaining({
        orientationUrl: expect.any(String),
        orientationId: "947",
        descriptionFull: "A profession",
      }),
    });
    // Should NOT have called create
    expect(mockTransCreate).not.toHaveBeenCalled();
  });

  it("creates translation when none exists for locale", async () => {
    mockProfFindMany.mockResolvedValueOnce([]);
    mockProfCreate.mockResolvedValueOnce({} as never);
    mockTransFindUnique.mockResolvedValueOnce(null);
    mockTransCreate.mockResolvedValueOnce({} as never);

    await importRecords([makeRecord()], "de");

    expect(mockTransCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        professionId: "informaticien",
        locale: "de",
        name: "Informaticien CFC / Informaticienne CFC",
        description: "",
        activities: [],
        qualities: [],
        orientationId: "947",
      }),
    });
  });

  it("returns correct counts for mixed create/update", async () => {
    const record1 = makeRecord({ swissdoc: "0.561.28.0", orientationId: "947" });
    const record2 = makeRecord({
      name: "Boulanger CFC / Boulangère CFC",
      swissdoc: "0.220.1.0",
      orientationId: "100",
    });

    mockProfFindMany.mockResolvedValueOnce([
      { id: "informaticien", swissdoc: "0.561.28.0", urlOrientation: null },
    ] as never);

    // Record 1: matched by swissdoc → update
    mockProfUpdate.mockResolvedValueOnce({} as never);
    mockTransFindUnique.mockResolvedValueOnce(null);
    mockTransCreate.mockResolvedValueOnce({} as never);

    // Record 2: no match → create
    mockProfCreate.mockResolvedValueOnce({} as never);
    mockTransFindUnique.mockResolvedValueOnce(null);
    mockTransCreate.mockResolvedValueOnce({} as never);

    const result = await importRecords([record1, record2], "fr");

    expect(result).toEqual({ created: 1, updated: 1 });
  });
});
