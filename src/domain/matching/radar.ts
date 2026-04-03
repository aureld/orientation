import { RADAR_PAIRS, type ProfileVector } from "@/domain/profile";

export interface RadarDatum {
  labelKeyA: string;
  labelKeyB: string;
  value: number;
  raw: { a: number; b: number };
}

export function getRadarData(playerProfile: ProfileVector): RadarDatum[] {
  return RADAR_PAIRS.map((pair) => {
    const va = playerProfile[pair.a] || 0;
    const vb = playerProfile[pair.b] || 0;
    const total = va + vb;
    return {
      labelKeyA: pair.labelKeyA,
      labelKeyB: pair.labelKeyB,
      value: total === 0 ? 0.5 : va / total,
      raw: { a: va, b: vb },
    };
  });
}
