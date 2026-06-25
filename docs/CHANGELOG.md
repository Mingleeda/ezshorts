# Changelog

## [0.2.0] - 2026-06-25

### Added
- 썰 쇼츠 6단계 위저드: 입력 → 분위기 → 시나리오 → 캐릭터 확인 → 영상 생성 → 합성
- Higgsfield API 연동 (CLI 기반): recraft_v4_1, flux_kontext, seedance_2_0, text2speech_v2
- 캐릭터 참조 시스템 (Flux Kontext + 레퍼런스 이미지)
- 캐릭터별 고정 음성 TTS (ElevenLabs 20종 프리셋)
- TTS 오디오 → Seedance 영상 립싱크 연동
- 한국어→영어 프롬프트 자동 번역 (대화는 한국어 유지)
- 맥락 기반 시나리오 분할 (LLM + 로컬 폴백)
- 씬별 길이 추천 (도입/전개/클라이맥스/결말 기반)
- 씬별 개별 생성/재생성
- 씬 추가/삭제/편집
- 영상 합성 (FFmpeg, 페이드/디졸브/컷 전환)
- 프롬프트 태그 수정/추가/삭제
- 시나리오 템플릿 저장/불러오기
- 프로젝트 localStorage 자동 저장
- Higgsfield API 502/503 자동 재시도

### Fixed
- 씬 분할 시 따옴표 안 마침표에서 잘못 분할되는 문제
- 마지막 문장 누락 버그
- Shell 특수문자로 CLI 명령 실패하는 문제
- 이전 단계로 돌아갈 때 데이터 유실 문제

## [0.1.0] - 2026-06-25

### Added
- Initial project setup with Next.js 16, TypeScript, Tailwind CSS
- Folder structure for 4 core use cases: series, stories, ads, education
- shadcn/ui 컴포넌트, Pretendard 폰트
- 홈 화면 4개 유즈케이스 카드
