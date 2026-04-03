import { DIMENSIONS, type ProfileVector } from "./dimensions";

export function accumulateProfile(
  current: ProfileVector,
  tags: ProfileVector
): ProfileVector {
  const result = {} as ProfileVector;
  for (const d of DIMENSIONS) {
    result[d] = (current[d] || 0) + (tags[d] || 0);
  }
  return result;
}
