export type Platform = "youtube_shorts" | "instagram_reels";

export type ContentType = "series" | "stories" | "ads" | "education";

export type AspectRatio = "9:16" | "1:1";

export type Atmosphere = "funny" | "scary" | "touching" | "shocking" | "calm" | "exciting";

export type ArtStyle = "semi_realistic" | "anime" | "3d" | "illustration" | "cinematic";

export interface Project {
  id: string;
  name: string;
  type: ContentType;
  platform: Platform;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoryProject extends Project {
  type: "stories";
  storyText: string;
  atmosphere: Atmosphere;
  artStyle: ArtStyle;
  moodboard: MoodBoard;
  targetDuration: number;
  scenes: Scene[];
}

export interface SeriesProject extends Project {
  type: "series";
  characters: Character[];
  seriesStyle: ArtStyle;
  episodes: Episode[];
}

export interface AdProject extends Project {
  type: "ads";
  sourceVideoUrl: string;
  productName: string;
  productLink: string;
  extractedClips: VideoClip[];
}

export interface EducationProject extends Project {
  type: "education";
  topic: string;
  targetAge: string;
  characterStyle: string;
  episodes: Episode[];
}

export interface Character {
  id: string;
  name: string;
  description: string;
  referenceImageUrl?: string;
  stylePrompt: string;
}

export interface Episode {
  id: string;
  projectId: string;
  episodeNumber: number;
  title: string;
  script: string;
  scenes: Scene[];
  status: "draft" | "generating" | "ready" | "published";
}

export interface Scene {
  id: string;
  order: number;
  description: string;
  prompt: string;
  promptTags: string[];
  referenceImageUrl?: string;
  clips: GeneratedClip[];
  duration: number;
}

export interface GeneratedClip {
  id: string;
  sceneId: string;
  order: number;
  mediaUrl?: string;
  duration: number;
  status: "pending" | "generating" | "ready" | "failed";
}

export interface VideoClip {
  id: string;
  startTime: number;
  endTime: number;
  sourceUrl: string;
}

export interface MoodBoard {
  atmosphere: Atmosphere;
  artStyle: ArtStyle;
  colorPalette?: string;
  cameraAngle?: string;
  timeOfDay?: string;
}

export interface PromptTemplate {
  id: string;
  contentType: ContentType;
  name: string;
  template: string;
  variables: string[];
}

export interface ProviderCapability {
  name: string;
  maxClipDuration: number;
  supportedRatios: AspectRatio[];
  costPerImage: number;
  costPerClip: number;
}

export interface ComposedVideo {
  id: string;
  clips: GeneratedClip[];
  transitions: TransitionEffect[];
  subtitleEnabled: boolean;
  narrationUrl?: string;
  bgmUrl?: string;
  totalDuration: number;
  outputUrl?: string;
}

export interface TransitionEffect {
  type: "cut" | "fade" | "dissolve" | "slide";
  afterClipId: string;
  duration: number;
}

export interface DurationRecommendation {
  recommended: number;
  label: string;
  reason: string;
  sceneCount: number;
  clipsPerScene: number;
}
