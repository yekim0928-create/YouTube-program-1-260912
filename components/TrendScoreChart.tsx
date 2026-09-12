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
import type { BeautyVideo } from "@/types/youtube";
import { formatCompactNumber, formatPercent, truncate } from "@/lib/format";

interface TrendScoreChartProps {
  videos: BeautyVideo[];
}

const BAR_COLORS = ["#d4603d", "#e38569", "#efad9e", "#f6cfc7"];

export function TrendScoreChart({ videos }: TrendScoreChartProps) {
  const data = videos.slice(0, 10).map((v) => ({
    name: truncate(v.title, 24),
    trendScore: v.trendScore,
    viewCount: v.viewCount,
    engagementRate: v.engagementRate,
  }));

  return (
    <div className="rounded-2xl border border-blush-100 bg-white/80 p-5 shadow-soft backdrop-blur-sm">
      <h3 className="font-serif text-lg text-ink-900">TOP 10 Trend Score</h3>
      <p className="mb-4 text-xs text-ink-400">조회수 증가 가능성이 높은 영상 순위</p>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e6e2" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#857868" }} />
          <YAxis
            type="category"
            dataKey="name"
            width={150}
            tick={{ fontSize: 11, fill: "#453e35" }}
          />
          <Tooltip
            formatter={(value: number, key) =>
              key === "trendScore" ? [`${value}점`, "Trend Score"] : [value, key]
            }
            labelFormatter={(label) => label}
            contentStyle={{ fontSize: 12, borderRadius: 12, borderColor: "#f6cfc7" }}
          />
          <Bar dataKey="trendScore" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-2 flex justify-end gap-4 text-xs text-ink-400">
        {data[0] ? (
          <span>
            1위 조회수 {formatCompactNumber(data[0].viewCount)} · 참여율{" "}
            {formatPercent(data[0].engagementRate)}
          </span>
        ) : null}
      </div>
    </div>
  );
}
