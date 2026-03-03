/**
 * Compute the Levenshtein edit distance between two strings.
 */
export function levenshtein(a: string, b: string): number {
  const m = a.length,
    n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

/**
 * Find the closest matching type name using Levenshtein distance.
 * Returns undefined if no candidate is within 60% similarity threshold.
 */
export function findClosestMatch(name: string, available: string[]): string | undefined {
  let best: string | undefined;
  let bestDist = Infinity;

  for (const candidate of available) {
    const dist = levenshtein(name.toLowerCase(), candidate.toLowerCase());
    if (dist < bestDist && dist <= Math.max(name.length, candidate.length) * 0.6) {
      bestDist = dist;
      best = candidate;
    }
  }
  return best;
}

