import type { AIProvider, GenerateImageRequest, GenerateVideoRequest, GenerationResult } from "./provider";
import { HIGGSFIELD_CAPABILITIES } from "./provider";

export class HiggsFieldProvider implements AIProvider {
  name = "Higgsfield";
  capabilities = HIGGSFIELD_CAPABILITIES;

  async generateImage(request: GenerateImageRequest): Promise<GenerationResult> {
    // TODO: Higgsfield MCP 연동
    // mcp__claude_ai_higgsfield__generate_image 호출
    console.log("[Higgsfield] Image generation request:", request.prompt.slice(0, 50));
    return {
      id: `img-${Date.now()}`,
      mediaUrl: "",
      status: "failed",
      error: "Higgsfield 유료 전환 필요 — 연동 준비 완료, API 키 설정 후 활성화",
    };
  }

  async generateVideo(request: GenerateVideoRequest): Promise<GenerationResult> {
    // TODO: Higgsfield MCP 연동
    // mcp__claude_ai_higgsfield__generate_video 호출
    console.log("[Higgsfield] Video generation request:", request.prompt.slice(0, 50));
    return {
      id: `vid-${Date.now()}`,
      mediaUrl: "",
      status: "failed",
      error: "Higgsfield 유료 전환 필요 — 연동 준비 완료, API 키 설정 후 활성화",
    };
  }
}
