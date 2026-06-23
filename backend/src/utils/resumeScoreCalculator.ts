import { extractKeywords } from "./extractKeywords";

export const calculateResumeScore = (
  text: string,
  expectedKeywords: string[] = [],
): number => {
  if (!text) return 0;

  const found = new Set<string>(extractKeywords(text, 200));
  if (!expectedKeywords || expectedKeywords.length === 0) {
    const kwCount = found.size;
    const score = Math.min(100, Math.round((kwCount / 50) * 100));
    return score;
  }

  const matches = expectedKeywords.filter((k) => found.has(k.toLowerCase()));
  const ratio = matches.length / expectedKeywords.length;
  return Math.round(Math.min(1, ratio) * 100);
};

export default calculateResumeScore;
