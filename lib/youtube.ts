import type { BeautyVideo, TrendPeriod } from "@/types/youtube";

export const DEFAULT_KEYWORDS = ["메이크업", "스킨케어", "화장품", "K-Beauty"] as const;

const SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos";
const MAX_RESULTS = 25;

interface YoutubeSearchItem {
  id: { videoId: string };
}

interface YoutubeVideoItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    channelId: string;
    publishedAt: string;
    thumbnails: { medium?: { url: string }; high?: { url: string }; default?: { url: string } };
  };
  statistics: {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
  };
}

export class YoutubeApiError extends Error {
  constructor(message: string, public status = 502) {
    super(message);
    this.name = "YoutubeApiError";
  }
}

function getApiKey(): string {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    throw new YoutubeApiError(
      "YOUTUBE_API_KEY가 설정되지 않았습니다. .env.local에 키를 추가해주세요.",
      500
    );
  }
  return key;
}

async function fetchJson<T>(url: URL): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new YoutubeApiError(
      `YouTube API 요청이 실패했습니다 (${res.status}): ${body.slice(0, 200)}`,
      res.status === 403 ? 403 : 502
    );
  }
  return res.json() as Promise<T>;
}

export async function fetchBeautyVideos(
  query: string,
  period: TrendPeriod
): Promise<Omit<BeautyVideo, "trendScore">[]> {
  const apiKey = getApiKey();
  const publishedAfter = new Date(
    Date.now() - period * 24 * 60 * 60 * 1000
  ).toISOString();

  const searchUrl = new URL(SEARCH_URL);
  searchUrl.searchParams.set("part", "snippet");
  searchUrl.searchParams.set("q", query);
  searchUrl.searchParams.set("type", "video");
  searchUrl.searchParams.set("order", "viewCount");
  searchUrl.searchParams.set("publishedAfter", publishedAfter);
  searchUrl.searchParams.set("maxResults", String(MAX_RESULTS));
  searchUrl.searchParams.set("relevanceLanguage", "ko");
  searchUrl.searchParams.set("safeSearch", "moderate");
  searchUrl.searchParams.set("key", apiKey);

  const searchData = await fetchJson<{ items: YoutubeSearchItem[] }>(searchUrl);
  const videoIds = searchData.items
    .map((item) => item.id?.videoId)
    .filter((id): id is string => Boolean(id));

  if (videoIds.length === 0) {
    return [];
  }

  const videosUrl = new URL(VIDEOS_URL);
  videosUrl.searchParams.set("part", "snippet,statistics");
  videosUrl.searchParams.set("id", videoIds.join(","));
  videosUrl.searchParams.set("key", apiKey);

  const videosData = await fetchJson<{ items: YoutubeVideoItem[] }>(videosUrl);
  const now = Date.now();

  return videosData.items.map((item) => {
    const publishedAt = item.snippet.publishedAt;
    const ageHours = Math.max(
      1,
      (now - new Date(publishedAt).getTime()) / (1000 * 60 * 60)
    );
    const viewCount = Number(item.statistics.viewCount ?? 0);
    const likeCount = Number(item.statistics.likeCount ?? 0);
    const commentCount = Number(item.statistics.commentCount ?? 0);
    const viewVelocity = viewCount / ageHours;
    const engagementRate = (likeCount + commentCount) / Math.max(viewCount, 1);
    const thumbnail =
      item.snippet.thumbnails.high?.url ??
      item.snippet.thumbnails.medium?.url ??
      item.snippet.thumbnails.default?.url ??
      "";

    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      channelTitle: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      publishedAt,
      thumbnailUrl: thumbnail,
      viewCount,
      likeCount,
      commentCount,
      ageHours,
      viewVelocity,
      engagementRate,
    };
  });
}
