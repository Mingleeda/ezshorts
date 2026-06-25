# ezshorts 작업 히스토리

프로젝트 시작일: 2026-06-24

---

## Day 1 (2026-06-24) — 프로젝트 설계 & MVP 구현

### 1. 프로젝트 기획
- 시장조사: AutoShorts.ai, ShortGenius, Virvid, Vrew, AICO 경쟁사 분석
- 차별점 도출: 프롬프트 자동 최적화 + 멀티 AI 도구 오케스트레이션 + 시리즈 시나리오 관리
- `/회의` 스킬 생성 (10명 가상 팀원 회의 시뮬레이션) → 글로벌 커맨드로 등록
- 회의를 통한 요구사항 도출: 4개 유즈케이스 + 기술 스펙 + 우선순위

### 2. 유즈케이스 정의
| 유즈케이스 | 설명 |
|-----------|------|
| 📖 썰 쇼츠 | 재밌는 썰을 짧은 영상 시리즈로 변환 |
| 🎭 시리즈 쇼츠 | 동일 캐릭터로 연속 에피소드 생성 |
| 📦 제품 광고 | 유튜브 구간 추출 + 판매 링크 첨부 |
| 🧒 유아 학습 | 아이들을 위한 교육 콘텐츠 쇼츠 |

### 3. 기술 스택 결정
- Next.js 16 (App Router, TypeScript, Tailwind CSS)
- shadcn/ui 컴포넌트
- Pretendard 폰트 (한국어 최적화)
- Higgsfield MCP/API (AI 영상/이미지 생성)
- FFmpeg (영상 합성)

### 4. MVP 구현 (커밋 6f76aec ~ 9646f99)
- GitHub 레포 생성: https://github.com/Mingleeda/ezshorts
- 프로젝트 폴더 구조 설계 (4개 유즈케이스별)
- 홈 화면: 4개 유즈케이스 카드 + 최근 프로젝트
- 썰 쇼츠 5단계 위저드: 입력 → 분위기 → 시나리오 → 레퍼런스 → 생성
- 프롬프트 파이프라인: 한국어→영어 변환 + 콘텐츠 타입별 템플릿
- 영상 길이 추천 시스템 (AI 도구 클립 제한 기반)
- AI Provider 추상화 인터페이스 + Higgsfield 스텁
- 데이터 모델 정의 (Project, Scene, Character, Episode 등)

### 5. Higgsfield 유료 전환 & MCP 연동
- Higgsfield Plus 플랜 가입 ($49/월)
- MCP를 통한 이미지 생성 테스트 (Recraft V4.1 모델)
- MCP를 통한 영상 생성 테스트 (Kling 3.0 Turbo 모델)

---

## Day 2 (2026-06-25) — 기능 고도화 & Higgsfield API 직접 연동

### 6. Higgsfield API 직접 연동 (커밋 80f2faa ~ e6512d5)
- Higgsfield Cloud API 키 발급 + CLI 인증
- CLI 기반 API 호출 구조 구축 (Python SDK는 인증 불일치로 사용 불가)
- `/api/images/generate` — Recraft V4.1 이미지 생성
- `/api/videos/generate` — Seedance 2.0 영상 생성
- `/api/images/upload` — Higgsfield 미디어 업로드

### 7. 캐릭터 일관성 시스템 (커밋 e6512d5 ~ e6c765c)
- Flux Kontext 모델로 캐릭터 참조 이미지 기반 씬 이미지 생성
- 레퍼런스 이미지 → Flux Kontext (캐릭터 유지) → 씬 이미지 → Seedance 영상
- 프롬프트에 캐릭터 일관성 지시 추가
- "no text, no subtitles" 프롬프트 추가 (영상 내 자막 방지)

### 8. 위저드 플로우 리팩터링 (커밋 b66ad40 ~ 06a8a23)
- 6단계 위저드: 입력 → 분위기 → 시나리오 → 캐릭터확인 → 영상생성 → 합성
- 레퍼런스 이미지: 씬별 여러 장 → 캐릭터+분위기 확인용 1장으로 변경
- 시나리오: 균등분할 → 맥락 기반 분할 (전환어/줄바꿈 인식)
- 영어 프롬프트: 시나리오 단계에서 → 영상생성 단계에서 일괄 생성으로 변경
- WizardState 리프팅: 이전 단계로 돌아가도 데이터 유지

### 9. 시나리오 고도화 (커밋 aa13f49 ~ eb25664)
- 씬별 길이 추천: 역할(도입/전개/클라이맥스/결말) + 내용 기반 가중치
- 씬별 길이 슬라이더 + 숫자 입력 (3~30초)
- 씬 추가/삭제/편집 기능
- 시나리오 저장/불러오기 (localStorage 템플릿)
- Higgsfield LLM으로 AI 시나리오 분할 + 랜덤 폴백

### 10. 프롬프트 파이프라인 개선 (커밋 3b45b8f ~ 802fbfa)
- 한국어→영어 번역 API (Google Translate)
- 따옴표 안 대사는 한국어 유지 (유니코드 따옴표 지원)
- 5단계에서 씬 설명 인라인 수정 + 재번역
- 태그 수정/추가/삭제 → 프롬프트에 반영

### 11. 영상 생성 개선 (커밋 ca5ed68 ~ 2fea0c6)
- Seedance 2.0으로 모델 교체 (identity consistency 내장)
- Shell escaping 문제 해결 (임시 스크립트 파일 방식)
- Higgsfield API 502/503 자동 재시도 (최대 2회)
- 씬별 개별 생성/재생성 버튼

### 12. 캐릭터 음성 시스템 (커밋 97a6e77 ~ 85a38fc)
- `/api/tts/generate` — Higgsfield text2speech_v2 + ElevenLabs
- `/api/tts/voices` — 20종 프리셋 음성 목록
- VoiceSetup 컴포넌트: 캐릭터별 음성 고정 + 미리듣기
- TTS 오디오 → Seedance 영상 생성 시 함께 전달 (립싱크)
- 씬 설명에서 대사 자동 추출 → 캐릭터 매칭 → TTS 생성

### 13. 영상 합성 (커밋 f728689 ~ abcc35d)
- `/api/videos/compose` — FFmpeg 기반 영상 합성
- 전환 효과: 컷/페이드/디졸브 (xfade 필터)
- 오디오 크로스페이드
- 합성 영상 미리보기 + 다운로드 (`ezshorts_final.mp4`)
- 개별 씬 다운로드 (blob 방식)

### 14. 문서화 (커밋 01eec4b)
- `docs/ROADMAP.md` — Higgsfield 12개 기능 P0/P1/P2 계획
- `docs/CHANGELOG.md` — v0.1.0, v0.2.0 릴리즈 노트

---

## 커밋 히스토리 (33 commits)

| # | 커밋 | 설명 |
|---|------|------|
| 33 | 01eec4b | Add ROADMAP.md + update CHANGELOG.md |
| 32 | f728689 | Add video composition: merge scenes into single video with transitions |
| 31 | abcc35d | Fix download: fetch blob and save as file instead of opening URL |
| 30 | 85a38fc | Fix: use --image and --audio CLI flags instead of --medias JSON |
| 29 | ad1edfb | Integrate TTS audio into video generation for lip sync |
| 28 | 97a6e77 | Add character voice system with TTS integration |
| 27 | 1e8722e | Enable audio generation for Seedance 2.0 videos |
| 26 | 2fea0c6 | Add auto-retry for Higgsfield API 502/503/timeout errors |
| 25 | 16c46a3 | Fix story splitting: preserve quotes, include all segments |
| 24 | a165cf4 | Add editable tags + scenario save/load templates |
| 23 | 8e2f42d | Fix shell escaping: write commands to temp script files |
| 22 | 802fbfa | Fix dialogue preservation: handle Unicode curly quotes properly |
| 21 | 8673887 | Preserve Korean dialogue in translation, only translate descriptions |
| 20 | eb25664 | Add scene insert button in scenario step |
| 19 | fdb5ed0 | Fix scene regeneration: use Higgsfield LLM + randomized fallback |
| 18 | be03962 | Fix seedance_2_0: use --image flag instead of --medias JSON |
| 17 | ca5ed68 | Fix: use seedance_2_0 model in frontend + model-specific params |
| 16 | e6c765c | Improve character consistency + remove text from generated content |
| 15 | aa13f49 | Smart per-scene duration: context-based recommendation with adjustment |
| 14 | e65012f | Add inline scene editing with auto re-translation in generate step |
| 13 | 06a8a23 | Fix state persistence, per-scene generation, character consistency |
| 12 | 3b45b8f | Add Korean→English translation for scene prompts |
| 11 | e6512d5 | Fix character consistency: use Flux Kontext with reference image |
| 10 | ec554d7 | Fix: generate per-scene start image instead of using reference sheet |
| 9 | aae2baa | Add character consistency via reference image + compose step |
| 8 | f8c5ec2 | Wire up video generation button to Higgsfield API |
| 7 | 80f2faa | Integrate Higgsfield API for image and video generation in app |
| 6 | b66ad40 | Restructure wizard flow: context-based scenes, single reference image |
| 5 | 15bde60 | Integrate Higgsfield MCP for reference image generation |
| 4 | 091dcec | Add project management, LLM prompt pipeline, localStorage persistence |
| 3 | 9646f99 | Implement MVP UI: home, story wizard, prompt pipeline, AI provider |
| 2 | 02b0f1b | Add project structure for 4 core use cases |
| 1 | 6f76aec | Initial commit from Create Next App |

---

## 비용 현황

| 항목 | 비용 |
|------|------|
| Higgsfield Plus | $49/월 (1,000 크레딧) |
| Vercel | 미적용 (로컬 개발 중) |
| Anthropic API | 미적용 (Higgsfield LLM 사용) |
| FFmpeg | 무료 |
| 총 월 비용 | ~$49 |
