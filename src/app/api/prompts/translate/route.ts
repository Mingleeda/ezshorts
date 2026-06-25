import { NextRequest, NextResponse } from "next/server";

interface TranslateRequest {
  texts: string[];
}

async function translateChunk(text: string): Promise<string> {
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

async function translatePreservingDialogue(text: string): Promise<string> {
  const dialoguePattern = /([""''])(.*?)\1|(")(.*?)(")|(')(.*?)(')/g;

  const dialogues: { placeholder: string; original: string }[] = [];
  let index = 0;

  const withPlaceholders = text.replace(dialoguePattern, (match) => {
    const placeholder = `__DIALOGUE_${index}__`;
    dialogues.push({ placeholder, original: match });
    index++;
    return placeholder;
  });

  const translated = await translateChunk(withPlaceholders);

  let result = translated;
  for (const { placeholder, original } of dialogues) {
    result = result.replace(placeholder, original);
  }

  return result;
}

export async function POST(request: NextRequest) {
  const body: TranslateRequest = await request.json();
  const { texts } = body;

  try {
    const translated = await Promise.all(
      texts.map((t) => translatePreservingDialogue(t))
    );
    return NextResponse.json({ translated });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json({ translated: texts });
  }
}
