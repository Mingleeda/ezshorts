"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { StoriesWizard } from "@/components/stories/stories-wizard";

function NewProjectContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") ?? "stories";

  switch (type) {
    case "stories":
      return <StoriesWizard />;
    case "series":
      return (
        <ComingSoon
          title="시리즈 쇼츠"
          description="캐릭터 프로필 기반 연속 에피소드 생성 (P1)"
        />
      );
    case "ads":
      return (
        <ComingSoon
          title="제품 광고"
          description="유튜브 구간 추출 + 제품 링크 (P1)"
        />
      );
    case "education":
      return (
        <ComingSoon
          title="유아 학습"
          description="교육 콘텐츠 + 안전성 검증 (P2)"
        />
      );
    default:
      return <StoriesWizard />;
  }
}

function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      <div className="mt-8 rounded-lg border border-dashed p-12 text-muted-foreground">
        곧 출시됩니다
      </div>
    </div>
  );
}

export default function NewProjectPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      }
    >
      <NewProjectContent />
    </Suspense>
  );
}
