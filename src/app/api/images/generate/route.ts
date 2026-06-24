import { NextRequest, NextResponse } from "next/server";

interface GenerateImageRequest {
  prompt: string;
  aspectRatio?: string;
  model?: string;
}

const HIGGSFIELD_API_BASE = "https://api.higgsfield.ai/v1";

export async function POST(request: NextRequest) {
  const body: GenerateImageRequest = await request.json();
  const { prompt, aspectRatio = "9:16", model = "recraft-v4-1" } = body;

  // For MVP: return the prompt info so the frontend can display it
  // Actual generation happens via MCP in Claude Code session
  // When we add Higgsfield API key, this route will call their API directly

  return NextResponse.json({
    status: "pending",
    prompt,
    aspectRatio,
    model,
    message:
      "이미지 생성은 현재 Claude Code MCP를 통해 실행됩니다. 앱 내 자동 생성은 Higgsfield API 키 연동 후 활성화됩니다.",
  });
}
