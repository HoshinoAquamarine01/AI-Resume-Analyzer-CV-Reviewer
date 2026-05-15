const DEFAULT_STOPWORDS = new Set([
  "the",
  "and",
  "a",
  "an",
  "to",
  "of",
  "in",
  "for",
  "on",
  "with",
  "is",
  "are",
  "by",
  "as",
  "that",
  "this",
  "be",
  "or",
  "from",
  "at",
]);

export const extractKeywords = (text: string, topN = 20) => {
  if (!text) return [] as string[];
  const normalized = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const counts: Record<string, number> = {};
  for (const word of normalized.split(" ")) {
    if (!word || DEFAULT_STOPWORDS.has(word) || word.length <= 2) continue;
    counts[word] = (counts[word] || 0) + 1;
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map((e) => e[0]);
};

export default extractKeywords;
