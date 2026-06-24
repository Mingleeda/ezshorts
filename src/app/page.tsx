import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BookOpen, Users, ShoppingBag, GraduationCap } from "lucide-react";

const usesCases = [
  {
    type: "stories",
    title: "썰 쇼츠",
    description: "재밌는 썰을 짧은 영상 시리즈로 변환",
    icon: BookOpen,
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    href: "/new?type=stories",
  },
  {
    type: "series",
    title: "시리즈 쇼츠",
    description: "동일 캐릭터로 연속 에피소드 생성",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    href: "/new?type=series",
  },
  {
    type: "ads",
    title: "제품 광고",
    description: "유튜브 구간 추출 + 판매 링크 첨부",
    icon: ShoppingBag,
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-950/30",
    href: "/new?type=ads",
  },
  {
    type: "education",
    title: "유아 학습",
    description: "아이들을 위한 교육 콘텐츠 쇼츠",
    icon: GraduationCap,
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-950/30",
    href: "/new?type=education",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          누구나 쉽게 만드는 쇼츠
        </h1>
        <p className="text-lg text-muted-foreground">
          한국어로 입력하면, AI가 고품질 영상을 만들어드려요
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium text-muted-foreground mb-4">
          무엇을 만들까요?
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {usesCases.map((uc) => (
            <Link key={uc.type} href={uc.href}>
              <Card className="group cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 h-full">
                <CardHeader className="items-center text-center gap-3 p-6">
                  <div
                    className={`rounded-xl p-3 ${uc.bg} transition-transform group-hover:scale-110`}
                  >
                    <uc.icon className={`h-7 w-7 ${uc.color}`} />
                  </div>
                  <CardTitle className="text-base">{uc.title}</CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    {uc.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-4">
          최근 프로젝트
        </h2>
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          <p>아직 프로젝트가 없습니다</p>
          <p className="text-sm mt-1">위에서 만들고 싶은 영상 타입을 선택해보세요</p>
        </div>
      </section>
    </div>
  );
}
