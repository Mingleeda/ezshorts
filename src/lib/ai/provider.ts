import type { ProviderCapability } from "@/types";

export interface GenerateImageRequest {
  prompt: string;
  negativePrompt?: string;
  aspectRatio: "9:16" | "16:9" | "1:1";
}

export interface GenerateVideoRequest {
  prompt: string;
  referenceImageUrl?: string;
  duration: number;
  aspectRatio: "9:16" | "16:9" | "1:1";
}

export interface GenerationResult {
  id: string;
  mediaUrl: string;
  status: "completed" | "failed";
  error?: string;
}

export interface AIProvider {
  name: string;
  capabilities: ProviderCapability;
  generateImage(request: GenerateImageRequest): Promise<GenerationResult>;
  generateVideo(request: GenerateVideoRequest): Promise<GenerationResult>;
}

export const HIGGSFIELD_CAPABILITIES: ProviderCapability = {
  name: "Higgsfield",
  maxClipDuration: 8,
  supportedRatios: ["9:16", "1:1"],
  costPerImage: 0.15,
  costPerClip: 0.35,
};
