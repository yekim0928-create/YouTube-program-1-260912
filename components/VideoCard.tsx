import Image from "next/image";
import type { BeautyVideo } from "@/types/youtube";
import { formatCompactNumber, formatDate, formatPercent, truncate } from "@/lib/format";

interface VideoCardProps {
  video: BeautyVideo;
  rank: number;
}

export function VideoCard({ video, rank }: VideoCardProps) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-2xl border border-blush-100 bg-white/80 shadow-soft backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-ink-100">
        {video.thumbnailUrl ? (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : null}
        <span className="absolute left-2 top-2 rounded-full bg-ink-900/80 px-2.5 py-1 text-xs font-semibold text-white">
          #{rank}
        </span>
        <span className="absolute right-2 top-2 rounded-full bg-blush-500/90 px-2.5 py-1 text-xs font-semibold text-white">
          Trend {video.trendScore}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 font-serif text-sm leading-snug text-ink-900">
          {truncate(video.title, 80)}
        </h3>
        <p className="text-xs text-ink-400">{video.channelTitle}</p>
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-ink-500">
          <span>{formatCompactNumber(video.viewCount)} 조회</span>
          <span>{formatCompactNumber(video.likeCount)} 좋아요</span>
          <span>{formatDate(video.publishedAt)}</span>
        </div>
        <div className="text-xs font-medium text-blush-600">
          참여율 {formatPercent(video.engagementRate)}
        </div>
      </div>
    </a>
  );
}
