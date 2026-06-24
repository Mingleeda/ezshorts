import { NextRequest, NextResponse } from "next/server";

interface GenerateImageRequest {
  prompt: string;
  aspectRatio?: string;
}

export async function POST(request: NextRequest) {
  const body: GenerateImageRequest = await request.json();
  const { prompt } = body;

  const width = 768;
  const height = 1344;
  const seed = Math.floor(Math.random() * 999999);
  const encodedPrompt = encodeURIComponent(
    `${prompt}, vertical portrait orientation, high quality`
  );

  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;

  try {
    const res = await fetch(imageUrl, { method: "HEAD" });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Image generation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ imageUrl, status: "completed" });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Image generation failed" },
      { status: 500 }
    );
  }
}
