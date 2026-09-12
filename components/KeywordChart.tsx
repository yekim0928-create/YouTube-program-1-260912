"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { KeywordStat } from "@/types/youtube";

interface KeywordChartProps {
  keywords: KeywordStat[];
}

const BAR_COLORS = ["#211e1a", "#453e35", "#685c4e", "#857868", "#aea39a"];

export function KeywordChart({ keywords }: KeywordChartProps) {
  const data = keywords.slice(0, 10).map((k) => ({
    name: k.keyword,
    score: k.weightedScore,
    count: k.count,
  }));

  return (
    <div className="rounded-2xl border border-blush-100 bg-white/80 p-5 shadow-soft backdrop-blur-sm">
      <h3 className="font-serif text-lg text-ink-900">TOP 10 인기 키워드</h3>
      <p className="mb-4 text-xs text-ink-400">제목·설명에서 추출한 트렌드 키워드</p>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e6e2" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: "#857868" }} />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
            tick={{ fontSize: 12, fill: "#453e35" }}
          />
          <Tooltip
            formatter={(value: number, key) =>
              key === "score" ? [value, "가중 스코어"] : [value, "등장 영상 수"]
            }
            contentStyle={{ fontSize: 12, borderRadius: 12, borderColor: "#f6cfc7" }}
          />
          <Bar dataKey="score" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
