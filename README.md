# Beauty Trend Radar

YouTube Data API v3 기반 뷰티 트렌드 분석 대시보드 (Next.js App Router + TypeScript + Tailwind CSS + Recharts)

## 기능

- 메이크업 / 스킨케어 / 화장품 / K-Beauty 기본 키워드 + 사용자 직접 검색
- 최근 7일 / 30일 기준 영상 수집 (제목, 채널명, 조회수, 좋아요수, 게시일)
- 조회수 증가 가능성을 반영한 **Trend Score**(조회 속도 50% + 참여율 30% + 최신성 20%, 0~100점) 계산
- 제목·설명 텍스트에서 자주 등장하는 키워드 TOP 10 추출
- Trend Score / 조회수 / 참여율 / 인기 영상 TOP 10을 카드와 Recharts 차트로 시각화
- 모바일/PC 반응형 Beauty·Editorial 스타일 UI

## 기술 스택

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · Recharts

YouTube API 키는 서버 전용 환경 변수(`YOUTUBE_API_KEY`)로 관리되며, 브라우저에 노출되지 않도록 Next.js Route Handler(`app/api/youtube/search/route.ts`)를 통해서만 호출됩니다.

## 로컬 실행

```bash
npm install
cp .env.local.example .env.local   # YOUTUBE_API_KEY 값을 채워주세요
npm run dev
```

`http://localhost:3000` 에서 확인할 수 있습니다.

### YouTube API 키 발급

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) 에서 프로젝트 생성
2. "YouTube Data API v3" 활성화
3. API 키 생성 후 `.env.local`의 `YOUTUBE_API_KEY`에 입력

## 빌드

```bash
npm run build
npm start
```

## Vercel 배포

1. 이 저장소를 GitHub에 push (이미 완료됨)
2. [vercel.com](https://vercel.com) 에서 New Project → 이 GitHub 저장소 선택 (Framework: Next.js, 자동 감지)
3. Environment Variables에 `YOUTUBE_API_KEY` 추가 (Production/Preview/Development 모두)
4. Deploy

> Vercel 연동은 GitHub 계정 OAuth가 필요해 로컬/CI 자동화 도구로 대신 수행할 수 없습니다. 위 단계는 대시보드에서 직접 진행해주세요.

## 알려진 이슈

- `next@14.2.35` 기준 npm audit에 남아있는 취약점은 모두 DoS(서비스 거부)급이며, 완전한 패치는 React 19를 요구하는 Next 16 메이저 업그레이드에만 존재합니다. 이 프로젝트 범위에서는 14.x LTS 패치 라인을 유지했습니다.
