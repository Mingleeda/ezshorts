# ezshorts 로드맵

## 현재 구현 완료

| 기능 | 모델 | 상태 |
|------|------|------|
| 레퍼런스 이미지 생성 | recraft_v4_1 | ✅ |
| 캐릭터 참조 이미지 | flux_kontext | ✅ |
| 영상 생성 (립싱크) | seedance_2_0 | ✅ |
| TTS 음성 생성 | text2speech_v2 (ElevenLabs) | ✅ |
| 시나리오 AI 분할 | llm_text | ✅ |
| 한국어→영어 번역 | Google Translate | ✅ |
| 영상 합성 | FFmpeg | ✅ |

---

## P0 — 즉시 적용

### 1. Clipify (유튜브 클립 자동 추출)
- **모델**: `clipify`
- **용도**: 📦 광고 유즈케이스 핵심
- **기능**: 유튜브 URL → 쇼츠용 하이라이트 클립 자동 생성 + 자막
- **파라미터**: urls, clips_num, clip_aspect, subtitle_highlight_hex, subtitle_position, subtitle_font, track_face_crop, segment_seconds
- **적용 위치**: 광고 탭 → 유튜브 URL 입력 → 자동 클립 추출
- **효과**: 광고 영상 제작 시간 90% 단축

### 2. Sonilo Music (AI BGM 생성)
- **모델**: `sonilo_music`
- **용도**: 합성 단계 공통
- **기능**: 영상 분위기에 맞는 배경음악 자동 생성
- **적용 위치**: 합성 & 편집 스텝 → BGM 토글 ON 시 자동 생성
- **효과**: BGM 없는 밋밋한 영상 → 완성도 높은 쇼츠

### 3. Reframe (비율 자동 변환)
- **모델**: `reframe`
- **용도**: 공통 도구
- **기능**: 16:9 영상 → 9:16 자동 변환 (얼굴 추적 크롭)
- **적용 위치**: 내보내기 단계 또는 광고 탭에서 기존 영상 변환
- **효과**: 기존 가로 영상을 세로 쇼츠로 재활용

### 4. Video Upscale (영상 화질 향상)
- **모델**: `video_upscale` 또는 `topaz_video`
- **용도**: 합성 후 공통
- **기능**: 720p → 1080p/4K 업스케일
- **적용 위치**: 합성 완료 후 최종 내보내기 전
- **효과**: 최종 영상 퀄리티 향상

---

## P1 — 빠른 후속

### 5. Marketing Studio Video (제품 광고 원클릭)
- **모델**: `marketing_studio_video`
- **용도**: 📦 광고 유즈케이스 확장
- **기능**: 제품 사진/URL → 광고 영상 자동 생성 (UGC, 언박싱, 튜토리얼 등)
- **파라미터**: product_ids, hook_id, setting_id, avatars
- **효과**: 제품만 있으면 광고 영상 완성

### 6. Dubbing (다국어 더빙)
- **모델**: `dubbing`
- **용도**: 🧒 교육 / 🎭 시리즈
- **기능**: 한국어 영상 → 영어/일본어/중국어 등 더빙
- **효과**: 해외 시장 확장, 다국어 쇼츠

### 7. Voice Change (음성 변환)
- **모델**: `voice_change`
- **용도**: 공통
- **기능**: 기존 음성을 다른 캐릭터 음성으로 변환
- **효과**: 나레이터 음성 다양화, 캐릭터 음성 교체

### 8. Background Remover (배경 제거)
- **모델**: `image_background_remover`, `sam_3_video` (video)
- **용도**: 📦 광고 / 🎭 시리즈
- **기능**: 배경 제거 → 원하는 배경 합성
- **효과**: 제품 촬영 없이도 프로급 광고

---

## P2 — 이후

### 9. Brain Activity (바이럴 예측)
- **모델**: `brain_activity`
- **용도**: 공통 분석 도구
- **기능**: 완성 영상의 바이럴 가능성/시청자 반응 예측
- **효과**: 게시 전 영상 퀄리티 스코어링, 약한 부분 개선 가이드

### 10. Color Grading LUT (색보정)
- **모델**: `color_grading_lut`
- **용도**: 🎭 시리즈
- **기능**: 시리즈 전체에 동일 색감(LUT) 적용
- **효과**: 시리즈물 비주얼 일관성

### 11. Outpaint (이미지 확장)
- **모델**: `outpaint`
- **용도**: 공통
- **기능**: 이미지 비율 변환 시 빈 영역 AI 채우기
- **효과**: 가로 이미지 → 세로 변환 시 자연스러운 확장

### 12. Draw to Video (그림→영상)
- **모델**: `draw_to_video`
- **용도**: 🧒 교육
- **기능**: 스케치/그림을 영상으로 변환
- **효과**: 유아 교육용 그림 애니메이션

---

## 유즈케이스별 모델 매핑

| 기능 | 📖 썰 | 🎭 시리즈 | 📦 광고 | 🧒 교육 |
|------|:-----:|:--------:|:------:|:------:|
| recraft_v4_1 (이미지) | ✅ | ✅ | | ✅ |
| flux_kontext (캐릭터 참조) | ✅ | ✅ | | ✅ |
| seedance_2_0 (영상) | ✅ | ✅ | | ✅ |
| text2speech_v2 (TTS) | ✅ | ✅ | | ✅ |
| sonilo_music (BGM) | ✅ | ✅ | ✅ | ✅ |
| video_upscale (화질) | ✅ | ✅ | ✅ | ✅ |
| clipify (클립 추출) | | | ✅ | |
| reframe (비율 변환) | ✅ | ✅ | ✅ | ✅ |
| marketing_studio (광고) | | | ✅ | |
| dubbing (더빙) | | ✅ | | ✅ |
| voice_change (음성 변환) | ✅ | ✅ | | |
| background_remover (배경) | | ✅ | ✅ | |
| brain_activity (바이럴) | ✅ | ✅ | ✅ | |
| color_grading_lut (색보정) | | ✅ | | |
| draw_to_video (그림→영상) | | | | ✅ |
