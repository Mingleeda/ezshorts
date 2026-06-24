@AGENTS.md

# ezshorts

누구나 쉽게 만드는 쇼츠 - 수익화 중심 쇼츠/릴스 자동 생성 앱

## Tech Stack
- Next.js 16 (App Router, TypeScript, Tailwind CSS)
- MCP integration (Higgsfield 등 AI 도구)
- Target platforms: YouTube Shorts, Instagram Reels

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── series/            # 시리즈물 쇼츠 (캐릭터 일관성)
│   ├── stories/           # 썰 시리즈 영상
│   ├── ads/               # 제품 광고 영상
│   ├── education/         # 유아 학습용 영상
│   └── api/               # API routes
├── components/
│   ├── ui/                # 공통 UI 컴포넌트
│   ├── layout/            # 레이아웃 컴포넌트
│   ├── series/            # 시리즈 전용 컴포넌트
│   ├── stories/           # 썰 전용 컴포넌트
│   ├── ads/               # 광고 전용 컴포넌트
│   ├── education/         # 교육 전용 컴포넌트
│   └── shared/            # 공유 컴포넌트
├── lib/
│   ├── ai/                # AI 모델 통합
│   ├── mcp/               # MCP 클라이언트 (Higgsfield 등)
│   ├── prompts/           # 프롬프트 템플릿 & 최적화
│   └── youtube/           # YouTube API 연동
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript 타입 정의
└── stores/                # 상태 관리
```

## Commands
- `npm run dev` — 개발 서버
- `npm run build` — 프로덕션 빌드
- `npm run lint` — ESLint

## Conventions
- PR 머지 시 docs/CHANGELOG.md 업데이트
- 한국어 주석/문서 사용
