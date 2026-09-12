export interface BeautyVideo {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  channelId: string;
  publishedAt: string;
  thumbnailUrl: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  /** Hours elapsed between publish time and the API call. */
  ageHours: number;
  /** Views per hour since publish — the core velocity signal. */
  viewVelocity: number;
  /** (likes + comments) / views. */
  engagementRate: number;
  /** 0-100 composite score blending velocity, engagement, and recency. */
  trendScore: number;
}

export interface KeywordStat {
  keyword: string;
  count: number;
  /** Sum of trendScore across videos mentioning this keyword. */
  weightedScore: number;
}

export type TrendPeriod = 7 | 30;

export interface TrendSummary {
  totalVideos: number;
  totalViews: number;
  totalLikes: number;
  avgEngagementRate: number;
  avgTrendScore: number;
}

export interface YoutubeSearchResponse {
  videos: BeautyVideo[];
  topVideos: BeautyVideo[];
  topKeywords: KeywordStat[];
  summary: TrendSummary;
  query: string;
  period: TrendPeriod;
}
