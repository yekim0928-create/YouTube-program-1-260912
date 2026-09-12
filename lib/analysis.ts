import type { BeautyVideo, KeywordStat, TrendSummary } from "@/types/youtube";

const STOPWORDS = new Set([
  // English
  "the", "and", "for", "are", "but", "not", "you", "your", "with", "this",
  "that", "from", "have", "will", "all", "can", "how", "what", "when",
  "who", "why", "our", "out", "about", "into", "than", "then", "them",
  "they", "review", "video", "new", "best", "top", "shorts", "short",
  "subscribe", "channel", "like", "comment", "follow", "tutorial",
  // Korean particles / filler words commonly attached to keywords
  "그리고", "그런데", "이렇게", "저렇게", "하지만", "그래서", "너무", "정말",
  "오늘", "영상", "구독", "좋아요", "댓글", "여러분", "많이", "진짜",
]);

/** Roughly matches Korean syllable blocks and Latin word characters, 3+ chars. */
const TOKEN_PATTERN = /[\p{Script=Hangul}]{2,}|[A-Za-z][A-Za-z0-9]{2,}/gu;

function tokenize(text: string): string[] {
  const matches = text.toLowerCase().match(TOKEN_PATTERN) ?? [];
  return matches.filter((t) => !STOPWORDS.has(t));
}

function minMax(values: number[]): [number, number] {
  if (values.length === 0) return [0, 1];
  let min = Infinity;
  let max = -Infinity;
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (min === max) return [min, min + 1];
  return [min, max];
}

function normalize(value: number, min: number, max: number): number {
  return Math.min(1, Math.max(0, (value - min) / (max - min)));
}

/**
 * Composite 0-100 trend score: view velocity carries the most weight since
 * it's the strongest signal of "about to blow up", engagement rate reflects
 * audience resonance, and recency rewards videos that still have runway
 * left in the lookback window.
 */
export function scoreVideos(
  raw: Omit<BeautyVideo, "trendScore">[],
  periodDays: number
): BeautyVideo[] {
  const velocities = raw.map((v) => Math.log1p(v.viewVelocity));
  const [vMin, vMax] = minMax(velocities);
  const engagements = raw.map((v) => v.engagementRate);
  const [eMin, eMax] = minMax(engagements);
  const windowHours = periodDays * 24;

  return raw.map((v, i) => {
    const velocityScore = normalize(velocities[i], vMin, vMax);
    const engagementScore = normalize(engagements[i], eMin, eMax);
    const recencyScore = normalize(windowHours - v.ageHours, 0, windowHours);
    const trendScore = Math.round(
      (velocityScore * 0.5 + engagementScore * 0.3 + recencyScore * 0.2) * 100
    );
    return { ...v, trendScore };
  });
}

export function extractTopKeywords(
  videos: BeautyVideo[],
  limit = 10
): KeywordStat[] {
  const stats = new Map<string, KeywordStat>();

  for (const video of videos) {
    const tokens = new Set(tokenize(`${video.title} ${video.description}`));
    for (const keyword of tokens) {
      const existing = stats.get(keyword);
      if (existing) {
        existing.count += 1;
        existing.weightedScore += video.trendScore;
      } else {
        stats.set(keyword, { keyword, count: 1, weightedScore: video.trendScore });
      }
    }
  }

  return Array.from(stats.values())
    .sort((a, b) => b.weightedScore - a.weightedScore || b.count - a.count)
    .slice(0, limit);
}

export function buildSummary(videos: BeautyVideo[]): TrendSummary {
  if (videos.length === 0) {
    return { totalVideos: 0, totalViews: 0, totalLikes: 0, avgEngagementRate: 0, avgTrendScore: 0 };
  }
  const totalViews = videos.reduce((sum, v) => sum + v.viewCount, 0);
  const totalLikes = videos.reduce((sum, v) => sum + v.likeCount, 0);
  const avgEngagementRate =
    videos.reduce((sum, v) => sum + v.engagementRate, 0) / videos.length;
  const avgTrendScore =
    videos.reduce((sum, v) => sum + v.trendScore, 0) / videos.length;

  return {
    totalVideos: videos.length,
    totalViews,
    totalLikes,
    avgEngagementRate,
    avgTrendScore,
  };
}
