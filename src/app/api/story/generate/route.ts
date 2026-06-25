import { NextRequest, NextResponse } from "next/server";

interface GenerateStoryRequest {
  prompt: string;
}

export async function POST(request: NextRequest) {
  const body: GenerateStoryRequest = await request.json();
  const { prompt } = body;

  try {
    const res = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai",
        messages: [
          {
            role: "system",
            content:
              "너는 한국의 인기 유튜브 쇼츠 채널 썰 작가야. 실제 있을법한 현실적이고 몰입감 있는 썰을 반말 구어체로 써. 대화는 큰따옴표로 감싸. 제목이나 설명 없이 썰 본문만 출력해. 줄바꿈으로 문장을 구분해.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    const story =
      data.choices?.[0]?.message?.content?.trim() ?? "";

    if (!story) {
      return NextResponse.json(
        { error: "썰 생성 실패" },
        { status: 500 }
      );
    }

    return NextResponse.json({ story });
  } catch (error) {
    console.error("Story generation error:", error);
    const msg = error instanceof Error ? error.message : "썰 생성 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
