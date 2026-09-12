"use client";

import { useState } from "react";
import type { TrendPeriod } from "@/types/youtube";
import { DEFAULT_KEYWORDS } from "@/lib/youtube";

interface SearchControlsProps {
  query: string;
  period: TrendPeriod;
  loading: boolean;
  onSearch: (query: string, period: TrendPeriod) => void;
}

export function SearchControls({ query, period, loading, onSearch }: SearchControlsProps) {
  const [input, setInput] = useState(query);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed) onSearch(trimmed, period);
  };

  return (
    <div className="rounded-2xl border border-blush-100 bg-white/80 p-5 shadow-soft backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="검색어를 입력하세요 (예: 틴트, 선크림, 글로우 메이크업)"
          className="flex-1 rounded-xl border border-ink-100 bg-white px-4 py-2.5 text-sm text-ink-800 outline-none transition focus:border-blush-400 focus:ring-2 focus:ring-blush-100"
        />
        <div className="flex gap-2">
          <div className="flex overflow-hidden rounded-xl border border-ink-100 bg-white text-sm">
            {([7, 30] as TrendPeriod[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onSearch(query, p)}
                className={`px-3.5 py-2.5 font-medium transition ${
                  period === p
                    ? "bg-blush-500 text-white"
                    : "text-ink-500 hover:bg-blush-50"
                }`}
              >
                {p}일
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-ink-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink-800 disabled:opacity-50"
          >
            {loading ? "검색 중..." : "검색"}
          </button>
        </div>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {DEFAULT_KEYWORDS.map((keyword) => (
          <button
            key={keyword}
            type="button"
            onClick={() => {
              setInput(keyword);
              onSearch(keyword, period);
            }}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
              query === keyword
                ? "border-blush-500 bg-blush-500 text-white"
                : "border-blush-200 bg-blush-50 text-blush-600 hover:bg-blush-100"
            }`}
          >
            {keyword}
          </button>
        ))}
      </div>
    </div>
  );
}
