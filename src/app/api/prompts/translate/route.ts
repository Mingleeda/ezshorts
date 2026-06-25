import { NextRequest, NextResponse } from "next/server";

interface TranslateRequest {
  texts: string[];
}

async function translateToEnglish(text: string): Promise<string> {
  const encoded = encodeURIComponent(text);
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ko&tl=en&dt=t&q=${encoded}`;

  const res = await fetch(url);
  if (!res.ok) return text;

  const data = await res.json();
  const translated = data[0]
    ?.map((segment: [string]) => segment[0])
    .join("");

  return translated || text;
}

export async function POST(request: NextRequest) {
  const body: TranslateRequest = await request.json();
  const { texts } = body;

  try {
    const translated = await Promise.all(
      texts.map((t) => translateToEnglish(t))
    );
    return NextResponse.json({ translated });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json({ translated: texts });
  }
}
