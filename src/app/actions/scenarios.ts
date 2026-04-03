"use server";

import { prisma } from "@/lib/db";
import { DIMENSIONS } from "@/lib/profile-dimensions";
import type { ProfileVector } from "@/lib/profile-dimensions";

export interface ScenarioListItem {
  id: string;
  icon: string;
  sectorId: string;
  sectorName: string;
  sectorColor: string;
  title: string;
  description: string;
}

export async function getScenarioList(locale: string): Promise<ScenarioListItem[]> {
  const scenarios = await prisma.scenario.findMany({
    include: {
      translations: { where: { locale }, select: { title: true, description: true } },
      sector: {
        include: { translations: { where: { locale }, select: { name: true } } },
      },
    },
    orderBy: { id: "asc" },
  });

  return scenarios.map((s) => ({
    id: s.id,
    icon: s.icon,
    sectorId: s.sectorId,
    sectorName: s.sector.translations[0]?.name ?? s.sectorId,
    sectorColor: s.sector.color,
    title: s.translations[0]?.title ?? s.id,
    description: s.translations[0]?.description ?? "",
  }));
}

export interface ScenarioChoice {
  id: string;
  text: string;
  nextSceneKey: string | null;
  tags: ProfileVector;
}

export interface ScenarioEndProfession {
  id: string;
  icon: string;
  type: string;
  duration: number;
  name: string;
}

export interface ScenarioScene {
  sceneKey: string;
  text: string;
  isFinal: boolean;
  sortOrder: number;
  choices: ScenarioChoice[];
  endProfessions: ScenarioEndProfession[];
}

export interface ScenarioDetail {
  id: string;
  icon: string;
  title: string;
  description: string;
  scenes: ScenarioScene[];
}

export async function getScenarioById(
  id: string,
  locale: string
): Promise<ScenarioDetail | null> {
  const scenario = await prisma.scenario.findUnique({
    where: { id },
    include: {
      translations: { where: { locale } },
      scenes: {
        orderBy: { sortOrder: "asc" },
        include: {
          translations: { where: { locale }, select: { text: true } },
          choices: {
            orderBy: { sortOrder: "asc" },
            include: {
              translations: { where: { locale }, select: { text: true } },
            },
          },
          endProfessions: {
            include: {
              profession: {
                include: {
                  translations: { where: { locale }, select: { name: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!scenario) return null;

  const t = scenario.translations[0];

  return {
    id: scenario.id,
    icon: scenario.icon,
    title: t?.title ?? scenario.id,
    description: t?.description ?? "",
    scenes: scenario.scenes.map((scene) => {
      const st = scene.translations[0];

      const tags = {} as ProfileVector;
      for (const d of DIMENSIONS) {
        tags[d] = 0;
      }

      return {
        sceneKey: scene.sceneKey,
        text: st?.text ?? "",
        isFinal: scene.isFinal,
        sortOrder: scene.sortOrder,
        choices: scene.choices.map((c) => {
          const choiceTags = {} as ProfileVector;
          for (const d of DIMENSIONS) {
            choiceTags[d] = c[d];
          }
          return {
            id: c.id,
            text: c.translations[0]?.text ?? "",
            nextSceneKey: c.nextSceneKey,
            tags: choiceTags,
          };
        }),
        endProfessions: scene.endProfessions.map((ep) => ({
          id: ep.profession.id,
          icon: ep.profession.icon,
          type: ep.profession.type,
          duration: ep.profession.duration,
          name: ep.profession.translations[0]?.name ?? ep.profession.id,
        })),
      };
    }),
  };
}
