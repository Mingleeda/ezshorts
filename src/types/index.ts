export type Platform = "youtube_shorts" | "instagram_reels";

export type ContentType = "series" | "stories" | "ads" | "education";

export type AspectRatio = "9:16" | "1:1";

export interface Project {
  id: string;
  name: string;
  type: ContentType;
  platform: Platform;
  createdAt: Date;
  updatedAt: Date;
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
  mediaUrl?: string;
  duration: number;
}

export interface AdProject extends Project {
  type: "ads";
  sourceVideoUrl: string;
  productLink: string;
  extractedClips: VideoClip[];
}

export interface VideoClip {
  id: string;
  startTime: number;
  endTime: number;
  sourceUrl: string;
}

export interface PromptTemplate {
  id: string;
  contentType: ContentType;
  name: string;
  template: string;
  variables: string[];
}
