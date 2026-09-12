import { NextRequest, NextResponse } from "next/server";
import { fetchBeautyVideos, YoutubeApiError } from "@/lib/youtube";
import { scoreVideos, extractTopKeywords, buildSummary } from "@/lib/analysis";
import type { TrendPeriod, YoutubeSearchResponse } from "@/types/youtube";

export const runtime = "nodejs";

function parsePeriod(value: string | null): TrendPeriod {
  return value === "30" ? 30 : 7;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = (searchParams.get("q") ?? "").trim();
  const period = parsePeriod(searchParams.get("period"));

  if (!query) {
    return NextResponse.json({ error: "검색어(q)를 입력해주세요." }, { status: 400 });
  }

  try {
    const raw = await fetchBeautyVideos(query, period);
    const videos = scoreVideos(raw, period).sort((a, b) => b.trendScore - a.trendScore);
    const topVideos = videos.slice(0, 10);
    const topKeywords = extractTopKeywords(videos, 10);
    const summary = buildSummary(videos);

    const payload: YoutubeSearchResponse = {
      videos,
      topVideos,
      topKeywords,
      summary,
      query,
      period,
    };

    return NextResponse.json(payload);
  } catch (error) {
    if (error instanceof YoutubeApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error(error);
    return NextResponse.json(
      { error: "알 수 없는 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
