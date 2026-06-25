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
        system: `너는 한국의 인기 유튜브 쇼츠 채널 썰 작가야.

작성 규칙:
- 반말 구어체로 자연스럽게 써
- 대화는 큰따옴표로 감싸
- 제목이나 설명 없이 썰 본문만 출력
- 줄바꿈으로 문장을 구분

구조 규칙 (기승전결 필수):
- 기(도입): 상황과 인물 소개. 어디서 누가 뭘 하고 있었는지 자연스럽게
- 승(전개): 사건이 점점 진행되면서 긴장감이나 궁금증이 생기게
- 전(절정): 핵심 사건 발생. 가장 극적인 순간. 대화가 있으면 여기에 집중
- 결(결말): 반응이나 결과. 여운이 남거나 반전이 있으면 좋음

중요:
- 각 문장이 앞 문장과 인과관계로 자연스럽게 연결되어야 해
- 갑자기 새로운 인물이나 상황이 뜬금없이 등장하면 안 돼
- 하나의 일관된 이야기여야 해. 산만하게 여러 이야기를 섞지 마
- 실제로 있을법한 현실적인 상황으로 써`,
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
