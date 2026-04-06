/**
 * Curated list of emoji avatars for the career orientation game.
 * Gender-neutral, fun, and career-themed.
 */
export const AVATARS = [
  "\u{1F9D1}\u200D\u{1F52C}", // scientist
  "\u{1F9D1}\u200D\u{1F373}", // cook
  "\u{1F9D1}\u200D\u{1F4BB}", // technologist
  "\u{1F9D1}\u200D\u{1F3A8}", // artist
  "\u{1F9D1}\u200D\u2695\uFE0F",  // health worker
  "\u{1F9D1}\u200D\u{1F3EB}", // teacher
  "\u{1F9D1}\u200D\u{1F527}", // mechanic
  "\u{1F9D1}\u200D\u{1F33E}", // farmer
  "\u{1F9D1}\u200D\u2708\uFE0F",  // pilot
  "\u{1F9D1}\u200D\u{1F692}", // firefighter
  "\u{1F98A}",                 // fox
  "\u{1F431}",                 // cat
  "\u{1F436}",                 // dog
  "\u{1F981}",                 // lion
  "\u{1F43C}",                 // panda
  "\u{1F984}",                 // unicorn
  "\u{1F409}",                 // dragon
  "\u{1F98B}",                 // butterfly
  "\u{1F31F}",                 // star
  "\u26A1",                    // lightning
  "\u{1F525}",                 // fire
  "\u{1F308}",                 // rainbow
] as const;

export type Avatar = (typeof AVATARS)[number];

export const DEFAULT_AVATAR = AVATARS[0];

export function isValidAvatar(value: string): value is Avatar {
  return (AVATARS as readonly string[]).includes(value);
}
