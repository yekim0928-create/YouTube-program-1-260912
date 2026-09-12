"use client";

import { useCallback, useEffect, useState } from "react";
import { SearchControls } from "@/components/SearchControls";
import { StatCard } from "@/components/StatCard";
import { TrendScoreChart } from "@/components/TrendScoreChart";
import { KeywordChart } from "@/components/KeywordChart";
import { VideoCard } from "@/components/VideoCard";
import { DEFAULT_KEYWORDS } from "@/lib/youtube";
import { formatCompactNumber, formatPercent } from "@/lib/format";
import type { TrendPeriod, YoutubeSearchResponse } from "@/types/youtube";

export default function HomePage() {
  const [query, setQuery] = useState<string>(DEFAULT_KEYWORDS[0]);
  const [period, setPeriod] = useState<TrendPeriod>(7);
  const [data, setData] = useState<YoutubeSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSearch = useCallback(async (nextQuery: string, nextPeriod: TrendPeriod) => {
    setLoading(true);
    setError(null);
    setQuery(nextQuery);
    setPeriod(nextPeriod);
    try {
      const res = await fetch(
        `/api/youtube/search?q=${encodeURIComponent(nextQuery)}&period=${nextPeriod}`
      );
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? "검색에 실패했습니다.");
      }
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    runSearch(DEFAULT_KEYWORDS[0], 7);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blush-500">
          Beauty Trend Radar
        </p>
        <h1 className="font-serif text-3xl text-ink-900 sm:text-4xl">
          YouTube 뷰티 트렌드 분석 대시보드
        </h1>
        <p className="max-w-2xl text-sm text-ink-500">
          메이크업, 스킨케어, 화장품, K-Beauty 영상의 조회수·참여율 데이터를 기반으로
          떠오르는 영상과 키워드를 찾아보세요.
        </p>
      </header>

      <SearchControls query={query} period={period} loading={loading} onSearch={runSearch} />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      {data ? (
        <>
          <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard
              label="분석 영상 수"
              value={`${data.summary.totalVideos}개`}
              hint={`최근 ${data.period}일 · "${data.query}"`}
            />
            <StatCard label="총 조회수" value={formatCompactNumber(data.summary.totalViews)} />
            <StatCard
              label="평균 참여율"
              value={formatPercent(data.summary.avgEngagementRate)}
              hint="(좋아요+댓글)/조회수"
            />
            <StatCard
              label="평균 Trend Score"
              value={data.summary.avgTrendScore.toFixed(1)}
              hint="100점 만점"
            />
          </section>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <TrendScoreChart videos={data.topVideos} />
            <KeywordChart keywords={data.topKeywords} />
          </section>

          <section>
            <h2 className="mb-4 font-serif text-xl text-ink-900">인기 영상 TOP 10</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.topVideos.map((video, i) => (
                <VideoCard key={video.id} video={video} rank={i + 1} />
              ))}
            </div>
          </section>
        </>
      ) : null}

      {loading && !data ? (
        <div className="flex h-64 items-center justify-center text-sm text-ink-400">
          데이터를 불러오는 중...
        </div>
      ) : null}

      {!loading && !error && data && data.topVideos.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-sm text-ink-400">
          조건에 맞는 영상을 찾지 못했습니다. 다른 키워드로 검색해보세요.
        </div>
      ) : null}
    </main>
  );
}
