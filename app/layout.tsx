import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beauty Trend Radar | YouTube 뷰티 트렌드 분석",
  description:
    "YouTube Data API로 메이크업·스킨케어·K-Beauty 영상의 조회수, 참여율, 트렌드 키워드를 분석하는 대시보드",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen font-sans text-ink-800 antialiased">{children}</body>
    </html>
  );
}
