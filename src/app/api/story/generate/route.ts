import { NextRequest, NextResponse } from "next/server";

interface GenerateStoryRequest {
  prompt: string;
}

export async function POST(request: NextRequest) {
  const body: GenerateStoryRequest = await request.json();
  const { prompt } = body;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system:
          "너는 한국의 인기 유튜브 쇼츠 채널 썰 작가야. 실제 있을법한 현실적이고 몰입감 있는 썰을 반말 구어체로 써. 대화는 큰따옴표로 감싸. 제목이나 설명 없이 썰 본문만 출력해. 줄바꿈으로 문장을 구분해. 자연스러운 한국어로 작성해.",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Anthropic API error:", errText);
      return NextResponse.json(
        { error: "AI API 오류. 다시 시도해주세요." },
        { status: 500 }
      );
    }

    const data = await res.json();
    const story = data.content?.[0]?.text?.trim();

    if (story) {
      return NextResponse.json({ story });
    }

    return NextResponse.json(
      { error: "썰 생성 실패" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Story generation error:", error);
    return NextResponse.json(
      { error: "썰 생성 실패. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
