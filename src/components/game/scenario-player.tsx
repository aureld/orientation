"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { HeaderBar } from "@/components/layout/header-bar";
import { ProgressBar } from "@/components/layout/progress-bar";
import type { ScenarioDetail, ScenarioScene } from "@/app/actions/scenarios";

interface ScenarioPlayerProps {
  scenario: ScenarioDetail;
  labels: {
    quit: string;
    bravo: string;
    endMessage: string;
    discoveredCareers: string;
    continueAdventures: string;
    viewResults: string;
  };
}

export function ScenarioPlayer({ scenario, labels }: ScenarioPlayerProps) {
  const [currentKey, setCurrentKey] = useState(scenario.scenes[0]?.sceneKey);

  const scene = scenario.scenes.find((s) => s.sceneKey === currentKey);
  if (!scene) return null;

  const sceneIndex = scenario.scenes
    .filter((s) => s.sortOrder <= scene.sortOrder)
    .indexOf(scene);

  function handleChoice(nextSceneKey: string | null) {
    if (!nextSceneKey) return;
    setCurrentKey(nextSceneKey);
  }

  if (scene.isFinal) {
    return <EndScreen scene={scene} scenario={scenario} labels={labels} />;
  }

  return (
    <>
      <HeaderBar title={scenario.icon + " " + scenario.title} showBack />
      <ProgressBar
        current={sceneIndex + 1}
        total={scenario.scenes.filter((s) => !s.isFinal).length + 1}
        label={scenario.title}
      />

      <div className="mt-6 rounded-xl bg-surface p-6 text-lg leading-relaxed">
        <p>{scene.text}</p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {scene.choices.map((choice) => (
          <button
            key={choice.id}
            className="btn-choice"
            onClick={() => handleChoice(choice.nextSceneKey)}
          >
            {choice.text}
          </button>
        ))}
      </div>

      <Link
        href="/scenarios"
        className="btn btn-secondary mt-8 w-full text-center opacity-60"
      >
        {labels.quit}
      </Link>
    </>
  );
}

function EndScreen({
  scene,
  scenario,
  labels,
}: {
  scene: ScenarioScene;
  scenario: ScenarioDetail;
  labels: ScenarioPlayerProps["labels"];
}) {
  return (
    <>
      <HeaderBar title={scenario.title} showBack />

      <div className="mt-6 text-center">
        <div className="text-5xl">{scenario.icon}</div>
        <h2 className="mt-4 text-2xl font-bold">{labels.bravo}</h2>
        <p className="mt-2 text-muted">{labels.endMessage}</p>
      </div>

      {scene.endProfessions.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 text-lg font-bold">{labels.discoveredCareers}</h3>
          <div className="flex flex-col gap-2">
            {scene.endProfessions.map((p) => (
              <Link
                key={p.id}
                href={`/career/${p.id}`}
                className="match-item"
              >
                <span className="text-2xl">{p.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold">{p.name}</div>
                  <div className="text-xs text-muted">
                    {p.type} · {p.duration} ans
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3">
        <Link href="/scenarios" className="btn btn-primary w-full text-center">
          {labels.continueAdventures}
        </Link>
        <Link href="/results" className="btn btn-secondary w-full text-center">
          {labels.viewResults}
        </Link>
      </div>
    </>
  );
}
