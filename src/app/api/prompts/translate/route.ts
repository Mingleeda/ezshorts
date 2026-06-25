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

function extractDialogues(text: string): { cleaned: string; dialogues: { placeholder: string; original: string }[] } {
  const dialogues: { placeholder: string; original: string }[] = [];
  let index = 0;

  const patterns = [
    /“([^”]*)”/g,
    /„([^”]*)”/g,
    /‘([^’]*)’/g,
    /"([^"]*)"/g,
    /'([^']*)'/g,
  ];

  let result = text;
  for (const pattern of patterns) {
    result = result.replace(pattern, (match) => {
      const placeholder = `DLGKEEP${index}DLGKEEP`;
      dialogues.push({ placeholder, original: match });
      index++;
      return placeholder;
    });
  }

  return { cleaned: result, dialogues };
}

function restoreDialogues(text: string, dialogues: { placeholder: string; original: string }[]): string {
  let result = text;
  for (const { placeholder, original } of dialogues) {
    result = result.replace(placeholder, original);
    const upperPlaceholder = placeholder.toUpperCase();
    result = result.replace(upperPlaceholder, original);
    const spacedPlaceholder = placeholder.split("").join(" ");
    result = result.replace(spacedPlaceholder, original);
  }
  return result;
}

async function translatePreservingDialogue(text: string): Promise<string> {
  const { cleaned, dialogues } = extractDialogues(text);

  if (dialogues.length === 0) {
    return translateChunk(text);
  }

  const translated = await translateChunk(cleaned);
  return restoreDialogues(translated, dialogues);
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
