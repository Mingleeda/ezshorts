import type { Atmosphere, ArtStyle, ContentType } from "@/types";

const ATMOSPHERE_DESCRIPTORS: Record<Atmosphere, string> = {
  funny: "humorous, comedic, lighthearted, playful expressions",
  scary: "dark, eerie, suspenseful, dramatic shadows, horror atmosphere",
  touching: "emotional, heartwarming, sentimental, soft warm lighting",
  shocking: "dramatic, intense, surprising twist, high contrast",
  calm: "peaceful, serene, gentle, pastel tones, soft focus",
  exciting: "dynamic, energetic, thrilling, vivid colors, motion blur",
};

const ART_STYLE_DESCRIPTORS: Record<ArtStyle, string> = {
  semi_realistic:
    "semi-realistic digital art, detailed illustration with realistic proportions, polished render",
  anime:
    "anime style, Japanese animation aesthetic, vibrant colors, clean lines, expressive eyes",
  "3d": "3D rendered, Pixar-style, smooth shading, volumetric lighting, soft ambient occlusion",
  illustration:
    "flat illustration, clean vector art, minimalist design, bold shapes",
  cinematic:
    "cinematic photography style, dramatic lighting, shallow depth of field, 35mm film grain, anamorphic lens",
};

export function buildSystemPrompt(contentType: ContentType): string {
  return `You are an expert visual prompt engineer specializing in AI video and image generation.
Your task is to convert Korean story descriptions into high-quality English prompts optimized for Higgsfield AI.

Rules:
- Output ONLY valid JSON, no markdown or explanation
- Each scene prompt must be vivid, specific, and visually descriptive
- Include camera angles, lighting, composition details
- Maintain character consistency across scenes
- Always specify "vertical 9:16 aspect ratio" in each prompt
- Add "high quality, 4K, detailed" to every prompt
- Generate a negative prompt to avoid common issues
- Output Korean tags for user-friendly display`;
}

export function buildSceneGenerationPrompt(
  storyText: string,
  atmosphere: Atmosphere,
  artStyle: ArtStyle,
  targetDuration: number,
  sceneCount: number
): string {
  return `Convert this Korean story into ${sceneCount} visual scenes for a ${targetDuration}-second short video.

Story: "${storyText}"

Visual Style: ${ART_STYLE_DESCRIPTORS[artStyle]}
Mood: ${ATMOSPHERE_DESCRIPTORS[atmosphere]}

Respond in this exact JSON format:
{
  "scenes": [
    {
      "description": "한국어 씬 설명",
      "prompt": "English visual prompt for AI image/video generation, ${ART_STYLE_DESCRIPTORS[artStyle]}, ${ATMOSPHERE_DESCRIPTORS[atmosphere]}, vertical 9:16 aspect ratio, high quality, 4K, detailed",
      "negative_prompt": "blurry, low quality, distorted, watermark, text overlay",
      "tags": ["한국어태그1", "한국어태그2", "한국어태그3"],
      "duration": ${Math.floor(targetDuration / sceneCount)}
    }
  ]
}

Important:
- Scene descriptions in Korean
- Prompts in English, optimized for Higgsfield
- Tags in Korean for user display
- Each scene should advance the story naturally
- Maintain visual consistency across all scenes`;
}

export function buildPromptOptimizationPrompt(
  originalPrompt: string,
  artStyle: ArtStyle,
  atmosphere: Atmosphere
): string {
  return `Optimize this AI image generation prompt for better results with Higgsfield:

Original: "${originalPrompt}"

Target style: ${ART_STYLE_DESCRIPTORS[artStyle]}
Target mood: ${ATMOSPHERE_DESCRIPTORS[atmosphere]}

Return only the optimized English prompt, no explanation.
Include: composition, lighting, camera angle, specific visual details.
Always include: "vertical 9:16 aspect ratio, high quality, 4K, detailed"`;
}
