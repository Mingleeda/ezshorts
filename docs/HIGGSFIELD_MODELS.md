# Higgsfield API 모델 스펙

총 78개 모델


---

## 3D 모델

### 3D Objects (`sam_3_3d`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| detection_threshold | object |  |  |  |
| export_textured_glb | boolean |  | True |  |
| folder_id | object |  |  |  |
| medias | array | ✅ |  |  |
| prompt | string |  |  |  |
| seed | object |  |  |  |

### 3D Rigging (`3d_rigging`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| animation_action_id | object |  |  |  |
| enable_animation | boolean |  | False |  |
| enable_safety_checker | object |  |  |  |
| folder_id | object |  |  |  |
| height_meters | object |  |  |  |
| model_url | string | ✅ |  |  |

### Image to 3D (`image_to_3d`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| animation_action_id | object |  |  |  |
| enable_animation | boolean |  | False |  |
| enable_pbr | object |  |  |  |
| enable_rigging | boolean |  | False |  |
| enable_safety_checker | object |  |  |  |
| folder_id | object |  |  |  |
| medias | array | ✅ |  |  |
| pose_mode | object |  |  |  |
| rigging_height_meters | object |  |  |  |
| seed | object |  |  |  |
| should_remesh | object |  |  |  |
| should_texture | boolean |  | False |  |
| symmetry_mode | object |  |  |  |
| target_polycount | object |  |  |  |
| texture_image_url | object |  |  |  |
| texture_prompt | object |  |  |  |
| topology | object |  |  |  |

### Multi-Image to 3D (`multi_image_to_3d`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| animation_action_id | object |  |  |  |
| enable_animation | boolean |  | False |  |
| enable_pbr | object |  |  |  |
| enable_rigging | boolean |  | False |  |
| enable_safety_checker | object |  |  |  |
| folder_id | object |  |  |  |
| medias | array | ✅ |  |  |
| pose_mode | object |  |  |  |
| rigging_height_meters | object |  |  |  |
| seed | object |  |  |  |
| should_remesh | object |  |  |  |
| should_texture | boolean |  | False |  |
| symmetry_mode | object |  |  |  |
| target_polycount | object |  |  |  |
| texture_image_url | object |  |  |  |
| texture_prompt | object |  |  |  |
| topology | object |  |  |  |

### Text to 3D (`tripo_3d`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| auto_size | boolean |  | False |  |
| face_limit | object |  |  |  |
| folder_id | object |  |  |  |
| geometry_quality | string |  | standard | standard, detailed |
| negative_prompt | object |  |  |  |
| pbr | boolean |  | True |  |
| prompt | string | ✅ |  |  |
| seed | object |  |  |  |
| texture | boolean |  | True |  |
| texture_quality | string |  | standard | standard, detailed |


---

## AUDIO 모델

### Inworld Text to Speech (`inworld_text_to_speech`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| prompt | string | ✅ |  |  |
| voice | string | ✅ |  |  |

### Mirelo Text to Audio (`mirelo_text_to_audio`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| duration | number | ✅ |  |  |
| prompt | string | ✅ |  |  |

### Sonilo Music (`sonilo_music`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| duration | number | ✅ |  |  |
| prompt | string | ✅ |  |  |

### text2speech_v2 (`text2speech_v2`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| model | string | ✅ |  | elevenlabs, minimax, seed_speech, vibe_voice, cozy_voice |
| prompt | string | ✅ |  |  |
| voice_id | string | ✅ |  |  |
| voice_type | string | ✅ |  | preset, element |


---

## IMAGE 모델

### AutoSprite Animation (`autosprite`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| folder_id | object |  |  |  |
| frame_count | integer |  | 25 |  |
| frame_size | integer |  | 256 |  |
| image_url | string | ✅ |  |  |
| is_humanoid | boolean |  | True |  |
| kind | string |  | idle | idle, walk, run, attack, jump, custom, iso_idle_up, iso_idle_northeast, iso_idle_right, iso_idle_southeast, iso_idle_down, iso_walk_up, iso_walk_northeast, iso_walk_right, iso_walk_southeast, iso_walk_down, iso_run_up, iso_run_northeast, iso_run_right, iso_run_southeast, iso_run_down, iso_jump_up, iso_jump_northeast, iso_jump_right, iso_jump_southeast, iso_jump_down |
| name | object |  |  |  |
| prompt | object |  |  |  |
| remove_bg | string |  | default | default, ultra |
| video_tier | string |  | turbo | turbo, pro, max |
| with_sound | boolean |  | False |  |

### Bytedance Image Upscale (`bytedance_image_upscale`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| folder_id | object |  |  |  |
| medias | array | ✅ |  |  |
| resolution | string |  | 4k | 2k, 4k |

### Cinematic Studio 2.5 (`cinematic_studio_2_5`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 1:1 | 1:1, 4:3, 3:4, 16:9, 9:16 |
| medias | array |  |  |  |
| prompt | string | ✅ |  |  |
| resolution | string |  | 1k | 1k, 2k, 4k |

### Cinematic Studio Image (`cinematic_studio_image`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 16:9 | 1:1, 4:3, 3:4, 16:9, 9:16, 3:2, 2:3, 21:9 |
| batch_size | integer |  | 1 |  |
| camera_aperture_id | object |  |  |  |
| camera_focal_length_id | string | ✅ |  |  |
| camera_lens_id | string | ✅ |  |  |
| camera_model_id | string | ✅ |  |  |
| medias | array |  |  |  |
| prompt | string | ✅ |  |  |
| resolution | string |  | 2k | 1k, 2k, 4k |

### Cinematic Studio Soul Cast (`cinematic_studio_soul_cast`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 1:1 | 1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3, 5:4, 4:5, 21:9, 9:21 |
| budget | integer |  | 50 |  |
| prompt | object |  |  |  |

### Cinematic Studio Soul Location (`cinematic_studio_soul_location`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 1:1 | 1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3, 21:9, 9:21 |
| prompt | string | ✅ |  |  |

### Color Grading LUT (`color_grading_lut`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| folder_id | object |  |  |  |
| medias | array | ✅ |  |  |

### FLUX.2 (`flux_2`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 1:1 | 1:1, 4:3, 3:4, 16:9, 9:16 |
| input_images | array |  |  |  |
| model | string |  | pro | pro, flex, max |
| prompt | string | ✅ |  |  |
| resolution | string |  | 1k | 1k, 2k |

### Flux Kontext (`flux_kontext`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 1:1 | 1:1, 4:3, 3:4, 16:9, 9:16 |
| input_images | array |  |  |  |
| prompt | string | ✅ |  |  |

### GPT Image 2 (`gpt_image_2`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 1:1 | 1:1, 4:3, 3:4, 16:9, 9:16, 3:2, 2:3 |
| batch_size | integer |  | 1 |  |
| medias | array |  |  |  |
| prompt | string | ✅ |  |  |
| quality | string |  | high | low, medium, high |
| resolution | string |  | 2k | 1k, 2k, 4k |

### Grok Image (`grok_image`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 1:1 | 1:1, 4:3, 3:4, 16:9, 9:16 |
| medias | array |  |  |  |
| mode | string |  | std | std, quality |
| prompt | string | ✅ |  |  |

### Higgsfield Soul V2 (`text2image_soul_v2`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 1:1 | 1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3 |
| custom_reference_id | object |  |  |  |
| medias | array |  |  |  |
| prompt | string | ✅ |  |  |
| quality | string |  | 2k | 1.5k, 2k |

### Image Auto (`image_auto`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 1:1 | 1:1, 4:3, 3:4, 16:9, 9:16 |
| medias | array |  |  |  |
| prompt | string | ✅ |  |  |

### Image Background Remover (`image_background_remover`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| medias | array | ✅ |  |  |

### Image Decompose (`image_decompose`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| folder_id | object |  |  |  |
| medias | array | ✅ |  |  |
| mode | string |  | granular | granular, standard |

### Kling O1 Image (`kling_omni_image`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 1:1 | 1:1, auto, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3, 21:9 |
| input_images | array |  |  |  |
| prompt | string | ✅ |  |  |
| resolution | string |  | 1k | 1k, 2k |

### MS Image (`ms_image`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 1:1 | auto, 1:1, 3:2, 2:3, 4:3, 3:4, 4:5, 5:4, 9:16, 16:9, 21:9 |
| avatars | array |  |  |  |
| batch_size | integer |  | 1 |  |
| brand_kit_id | object |  |  |  |
| folder_id | object |  |  |  |
| medias | array |  |  |  |
| product_ids | array |  |  |  |
| prompt | string | ✅ |  |  |
| quality | string |  | low | low, medium, high |
| resolution | string |  | 1k |  |
| style_id | object |  |  |  |

### Marketing Studio Image (`marketing_studio_image`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 1:1 | auto, 1:1, 3:2, 2:3, 4:3, 3:4, 4:5, 5:4, 9:16, 16:9, 21:9 |
| input_images | array |  |  |  |
| prompt | string | ✅ |  |  |
| resolution | string |  | 1k | 1k, 2k, 4k |

### Nano Banana (`nano_banana`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 1:1 | auto, 1:1, 3:2, 2:3, 4:3, 3:4, 4:5, 5:4, 9:16, 16:9, 21:9 |
| input_images | array |  |  |  |
| prompt | string | ✅ |  |  |

### Nano Banana 2 (`nano_banana_flash`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 1:1 | 1:1, 3:2, 2:3, 4:3, 3:4, 4:5, 5:4, 9:16, 16:9, 21:9 |
| medias | array |  |  |  |
| prompt | string | ✅ |  |  |
| resolution | string |  | 1k | 1k, 2k, 4k |

### Nano Banana Pro (`nano_banana_2`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 1:1 | auto, 1:1, 3:2, 2:3, 4:3, 3:4, 4:5, 5:4, 9:16, 16:9, 21:9 |
| folder_id | object |  |  |  |
| input_images | array |  |  |  |
| prompt | string | ✅ |  |  |
| resolution | string |  | 2k | 1k, 2k, 4k |

### Nano Banana Pro (`nano_banana_2_ai_stylist`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| background_preset_id | object |  |  |  |
| folder_id | object |  |  |  |
| input_image | object | ✅ |  |  |
| outfit_preset_ids | array |  |  |  |
| pose_preset_id | object |  |  |  |
| user_outfit_ids | array |  |  |  |

### Nano Banana Pro (`nano_banana_2_skin_enhancer`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| folder_id | object |  |  |  |
| input_image | object | ✅ |  |  |
| preset_id | string | ✅ |  |  |

### Nano Banana Pro (`nano_banana_2_shots`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | auto | auto, 1:1, 3:2, 2:3, 4:3, 3:4, 4:5, 5:4, 9:16, 16:9, 21:9 |
| folder_id | object |  |  |  |
| input_images | array | ✅ |  |  |

### OpenAI Hazel (`openai_hazel`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 1:1 | 1:1, 3:2, 2:3, auto |
| input_images | array |  |  |  |
| prompt | string | ✅ |  |  |
| quality | string |  | medium | low, medium, high |

### Outpaint (`outpaint`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 21:9 | auto, 1:1, 3:2, 2:3, 4:3, 3:4, 4:5, 5:4, 9:16, 16:9, 21:9 |
| folder_id | object |  |  |  |
| medias | array | ✅ |  |  |

### Recraft V4.1 (`recraft_v4_1`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 1:1 | 1:1, 3:4, 4:3, 4:5, 5:4, 3:2, 2:3, 16:9, 9:16, 21:9 |
| background_color | object |  |  |  |
| batch_size | integer |  | 1 |  |
| colors | array |  |  |  |
| model_type | string |  | standard | standard, vector, utility, utility_vector |
| prompt | string | ✅ |  |  |
| resolution | string |  | 1k | 1k, 2k |

### Seedream 4.5 (`seedream_v4_5`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 1:1 | 1:1, 4:3, 16:9, 3:2, 21:9, 3:4, 9:16, 2:3 |
| input_images | array |  |  |  |
| prompt | string | ✅ |  |  |
| quality | string |  | basic | basic, high |

### Seedream V5 Lite (`seedream_v5_lite`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 1:1 | 1:1, 4:3, 3:4, 16:9, 9:16 |
| medias | array |  |  |  |
| prompt | string | ✅ |  |  |
| quality | string |  | basic | basic, high |

### Soul Cast (`soul_cast`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 1:1 | 1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3, 5:4, 4:5, 21:9, 9:21 |
| budget | integer |  | 50 |  |
| prompt | object |  |  |  |

### Soul Cinematic (`soul_cinematic`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 1:1 | 1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3, 21:9 |
| custom_reference_id | object |  |  |  |
| medias | array |  |  |  |
| prompt | string | ✅ |  |  |
| quality | string |  | 2k | 1.5k, 2k |

### Soul Location (`soul_location`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 1:1 | 1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3, 21:9, 9:21 |
| prompt | string | ✅ |  |  |

### Topaz (`topaz_image`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| denoise | number |  | 0 |  |
| face_enhancement | boolean |  | False |  |
| face_enhancement_creativity | number |  | 0 |  |
| face_enhancement_strength | number |  | 0 |  |
| folder_id | object |  |  |  |
| input_image | object | ✅ |  |  |
| model | string |  | Standard V2 | Standard V2, Low Resolution V2, CGI, High Fidelity V2, Text Refine |
| output_height | integer | ✅ |  |  |
| output_width | integer | ✅ |  |  |
| sharpen | number |  | 0 |  |

### Topaz (`topaz_image_generative`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| autoprompt | boolean |  | True |  |
| creativity | integer |  | 1 |  |
| denoise | number |  | 0 |  |
| face_enhancement | boolean |  | False |  |
| face_enhancement_creativity | number |  | 0 |  |
| face_enhancement_strength | number |  | 0 |  |
| folder_id | object |  |  |  |
| input_image | object | ✅ |  |  |
| model | string |  | Redefine | Standard MAX, Redefine, Recovery, Recovery V2 |
| output_height | integer | ✅ |  |  |
| output_width | integer | ✅ |  |  |
| prompt | string |  |  |  |
| sharpen | number |  | 0 |  |
| texture | integer |  | 1 |  |

### Z Image (`z_image`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 1:1 | 1:1, 4:3, 3:4, 16:9, 9:16 |
| prompt | string | ✅ |  |  |

### soul_cinema_studio (`soul_cinema_studio`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 16:9 | 1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3, 21:9 |
| custom_reference_id | object |  |  |  |
| enhance_prompt | boolean |  | False |  |
| medias | array |  |  |  |
| prompt | string | ✅ |  |  |
| quality | string |  | 2k | 1.5k, 2k |
| style_id | object |  |  |  |


---

## TEXT 모델

### Brain Activity (`brain_activity`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| folder_id | object |  |  |  |
| medias | array | ✅ |  |  |


---

## VIDEO 모델

### Bytedance Video Upscale (`bytedance_video_upscale`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| duration | object |  |  |  |
| folder_id | object |  |  |  |
| fps | integer |  | 24 |  |
| medias | array |  |  |  |
| model_version | string |  | standard | standard, pro |
| preset | string |  | common | common, aigc, short_series, ugc, old_film |
| resolution | string |  | 2k | 1080p, 2k, 4k |

### Cinematic Studio 3.0 (`cinematic_studio_3_0`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 16:9 | 16:9, 9:16, 1:1 |
| duration | integer |  | 5 |  |
| generate_audio | boolean |  | False |  |
| medias | array |  |  |  |
| prompt | string | ✅ |  |  |

### Cinematic Studio Video (`cinematic_studio_video`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 16:9 | 1:1, 4:3, 3:4, 16:9, 9:16 |
| duration | string |  | 5 | 5, 10 |
| medias | array |  |  |  |
| prompt | string | ✅ |  |  |
| slow_motion | boolean |  | False |  |
| sound | boolean |  | True |  |

### Cinematic Studio Video 3.5 (`cinematic_studio_video_3_5`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | auto | auto, 21:9, 16:9, 4:3, 1:1, 3:4, 9:16 |
| batch_size | integer |  | 1 |  |
| camera_aperture_id | object |  |  |  |
| camera_focal_length_id | object |  |  |  |
| camera_lens_id | object |  |  |  |
| camera_model_id | object |  |  |  |
| camera_style | object |  |  |  |
| color_grading | object |  |  |  |
| duration | integer |  | 15 |  |
| enhance_prompt | boolean |  | False |  |
| folder_id | object |  |  |  |
| generate_audio | boolean |  | False |  |
| genre | string |  | auto | auto, action, horror, comedy, noir, drama, epic |
| light_scheme | object |  |  |  |
| medias | array |  |  |  |
| multi_prompt | array |  |  |  |
| multi_shot_mode | string |  | custom | auto, custom |
| multi_shots | boolean |  | False |  |
| prompt | string |  |  |  |
| prompt_language | string |  | zh | en, zh |
| resolution | string |  | 720p | 480p, 720p, 1080p |
| style_id | object |  |  |  |
| style_prompt | object |  |  |  |

### Cinematic Studio Video V2 (`cinematic_studio_video_v2`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 16:9 | 1:1, 4:3, 3:4, 16:9, 9:16 |
| duration | integer |  | 5 |  |
| genre | string |  | auto | auto, action, horror, comedy, western, suspense, intimate, spectacle |
| medias | array |  |  |  |
| mode | string |  | std | pro, std |
| prompt | string | ✅ |  |  |
| sound | string |  | on | on, off |

### Clipify (`clipify`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| clip_aspect | string |  | 9:16 | 9:16, 1:1, 16:9 |
| clips_num | integer |  | 10 |  |
| folder_id | object |  |  |  |
| max_height | integer |  | 1080 |  |
| segment_seconds | integer |  | 10 |  |
| subtitle_case | string |  | as-is | lower, upper, as-is |
| subtitle_font | string |  | notosans |  |
| subtitle_highlight_hex | string |  | #FFE84D |  |
| subtitle_position | string |  | bottom | bottom, center, top |
| track_face_crop | boolean |  | True |  |
| urls | array | ✅ |  |  |

### Draw To Video (`draw_to_video`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | auto | auto, 21:9, 16:9, 4:3, 1:1, 3:4, 9:16 |
| duration | object |  |  |  |
| enhancer | boolean |  | True |  |
| folder_id | object |  |  |  |
| generate_audio | boolean |  | False |  |
| prompt | string | ✅ |  |  |
| ref_image | object |  |  |  |
| resolution | string |  | 720p | 480p, 720p, 1080p |
| sketch | object | ✅ |  |  |
| video | object | ✅ |  |  |

### Google Veo 3 (`veo3`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 16:9 | 16:9, 9:16 |
| input_image | object | ✅ |  |  |
| model | string |  | veo-3-fast | veo-3-preview, veo-3-fast |
| prompt | string | ✅ |  |  |

### Google Veo 3.1 (`veo3_1`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 16:9 | 16:9, 9:16 |
| duration | string |  | 8 | 4, 6, 8 |
| input_image | object |  |  |  |
| model | string |  | veo-3-1-fast | veo-3-1-preview, veo-3-1-fast |
| prompt | string | ✅ |  |  |
| quality | string |  | basic | basic, high, ultra |

### Google Veo 3.1 Lite (`veo3_1_lite`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 16:9 | 16:9, 9:16, auto |
| duration | string |  | 8 | 4, 6, 8 |
| generate_audio | boolean |  | False |  |
| medias | array |  |  |  |
| prompt | string | ✅ |  |  |

### Grok Video (`grok_video`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 16:9 | 16:9, 9:16, 1:1 |
| duration | integer |  | 5 |  |
| medias | array |  |  |  |
| prompt | string | ✅ |  |  |

### Grok Video 1.5 (`grok_video_v15`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| duration | integer |  | 5 |  |
| medias | array | ✅ |  |  |
| prompt | string | ✅ |  |  |
| resolution | string |  | 720p | 480p, 720p |

### Kling 2.6 Video (`kling2_6`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 16:9 | 16:9, 9:16, 1:1 |
| duration | string |  | 5 | 5, 10 |
| input_image | object |  |  |  |
| prompt | string | ✅ |  |  |
| sound | boolean |  | True |  |

### Kling 3.0 Motion Control (`kling3_0_motion_control`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| background_source | string |  | input_image | input_image, input_video |
| folder_id | object |  |  |  |
| medias | array | ✅ |  |  |
| mode | string |  | std | std, pro |

### Kling 3.0 Turbo (`kling3_0_turbo`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 16:9 | 16:9, 9:16, 1:1 |
| duration | integer |  | 5 |  |
| medias | array |  |  |  |
| prompt | string | ✅ |  |  |
| resolution | string |  | 720p | 720p, 1080p |

### Kling v3.0 (`kling3_0`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 16:9 | 16:9, 9:16, 1:1 |
| duration | integer |  | 5 |  |
| medias | array |  |  |  |
| mode | string |  | std | pro, std, 4k |
| prompt | string | ✅ |  |  |
| sound | string |  | on | on, off |

### LLM Generation (`llm_text`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| input_images | array |  |  |  |
| model | string | ✅ |  |  |
| reasoning_effort | object |  |  |  |
| system_prompt | string |  |  |  |
| user_prompt | string |  |  |  |

### Marketing Studio Video (`marketing_studio_video`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| ad_reference_id | object |  |  |  |
| aspect_ratio | string |  | 16:9 | auto, 21:9, 16:9, 4:3, 1:1, 3:4, 9:16 |
| avatar_ids | array |  |  |  |
| avatars | array |  |  |  |
| duration | integer |  | 15 |  |
| generate_audio | boolean |  | False |  |
| hook_id | object |  |  |  |
| medias | array |  |  |  |
| mode | string |  | ugc |  |
| product_ids | array |  |  |  |
| prompt | string | ✅ |  |  |
| resolution | string |  | 720p | 480p, 720p, 1080p |
| setting_id | object |  |  |  |
| web_product_ids | array |  |  |  |

### Minimax Hailuo (`minimax_hailuo`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| duration | string |  | 6 | 6, 10 |
| input_images | array |  |  |  |
| model | string |  | minimax-2.3 | minimax, minimax-fast, minimax-2.3, minimax-2.3-fast |
| prompt | string | ✅ |  |  |
| resolution | string |  | 768 | 512, 768, 1080 |

### Reframe (`reframe`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string | ✅ |  | 21:9, 16:9, 4:3, 1:1, 3:4, 9:16 |
| duration | object |  |  |  |
| folder_id | object |  |  |  |
| medias | array | ✅ |  |  |
| resolution | string |  | 720p | 480p, 720p, 1080p |

### Remove Background (`sam_3_video`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| apply_mask | boolean |  | True |  |
| folder_id | object |  |  |  |
| frames_count | object |  |  |  |
| medias | array | ✅ |  |  |
| prompt | string |  |  |  |

### Seedance 1.5 Pro (`seedance1_5`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 16:9 | auto, 16:9, 9:16, 4:3, 3:4, 1:1, 21:9 |
| duration | string |  | 4 | 4, 8, 12 |
| generate_audio | boolean |  | True |  |
| medias | array |  |  |  |
| prompt | string | ✅ |  |  |
| resolution | string |  | 720p | 480p, 720p, 1080p |

### Seedance 2.0 (`seedance_2_0`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 16:9 | auto, 16:9, 9:16, 4:3, 3:4, 1:1, 21:9 |
| bitrate_mode | string |  | standard | standard, high |
| duration | integer |  | 5 |  |
| generate_audio | boolean |  | True |  |
| genre | string |  | auto | auto, action, horror, comedy, noir, drama, epic |
| medias | array |  |  |  |
| mode | string |  | std | std, fast |
| prompt | string | ✅ |  |  |
| resolution | string |  | 720p | 480p, 720p, 1080p, 4k |

### Seedance 2.0 Mini (`seedance_2_0_mini`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 16:9 | auto, 16:9, 9:16, 4:3, 3:4, 1:1, 21:9 |
| bitrate_mode | string |  | standard | standard, high |
| duration | integer |  | 5 |  |
| generate_audio | boolean |  | True |  |
| genre | string |  | auto | auto, action, horror, comedy, noir, drama, epic |
| medias | array |  |  |  |
| prompt | string | ✅ |  |  |
| resolution | string |  | 720p | 480p, 720p |

### Topaz (`topaz_video`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | auto | auto, 21:9, 16:9, 4:3, 1:1, 3:4, 9:16 |
| duration | object |  |  |  |
| enhancement | object |  |  |  |
| folder_id | object |  |  |  |
| frame_interpolation | object |  |  |  |
| frame_rate | number |  | 30 |  |
| frames_count | object |  |  |  |
| input_height | object |  |  |  |
| input_video | object |  |  |  |
| input_video_size | integer |  | 0 |  |
| input_width | object |  |  |  |
| resolution | string |  | 1080p | 1080p, 2160p |

### Video Background Remover (`video_background_remover`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| medias | array | ✅ |  |  |

### Video Deflicker (`video_deflicker`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| duration | object |  |  |  |
| folder_id | object |  |  |  |
| input_video | object | ✅ |  |  |

### Video Upscale (`video_upscale`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| duration | object |  |  |  |
| folder_id | object |  |  |  |
| input_video | object | ✅ |  |  |

### Wan 2.6 Video (`wan2_6`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 16:9 | 16:9, 9:16, 1:1 |
| duration | string |  | 5 | 5, 10, 15 |
| medias | array |  |  |  |
| prompt | string | ✅ |  |  |
| quality | string |  | 720p | 720p, 1080p |

### Wan 2.7 (`wan2_7`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| aspect_ratio | string |  | 16:9 | 16:9, 9:16, 1:1, 4:3, 3:4 |
| duration | integer |  | 5 |  |
| medias | array |  |  |  |
| prompt | string | ✅ |  |  |
| resolution | string |  | 720p | 720p, 1080p |

### dubbing (`dubbing`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| folder_id | object |  |  |  |
| input_video | object | ✅ |  |  |
| target_language | string | ✅ |  | eng, cmn, fra, hin, ita, jpn, kor, por, rus, tur, spa, deu, ara, pol, ind, fil, swe, fin |

### voice_change (`voice_change`)

| 파라미터 | 타입 | 필수 | 기본값 | 옵션 |
|---------|------|------|--------|------|
| folder_id | object |  |  |  |
| input_video | object | ✅ |  |  |
| voice_id | string | ✅ |  |  |
| voice_type | string |  | preset | preset, element |

