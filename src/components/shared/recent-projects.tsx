"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { getProjects, type SavedProject } from "@/lib/storage";

export function RecentProjects() {
  const [projects, setProjects] = useState<SavedProject[]>([]);

  useEffect(() => {
    setProjects(getProjects().slice(0, 6));
  }, []);

  if (projects.length === 0) {
    return (
      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-4">
          최근 프로젝트
        </h2>
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          <p>아직 프로젝트가 없습니다</p>
          <p className="text-sm mt-1">
            위에서 만들고 싶은 영상 타입을 선택해보세요
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-muted-foreground">
          최근 프로젝트
        </h2>
        <Link
          href="/projects"
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          전체 보기
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="cursor-pointer hover:shadow-sm transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-3.5 w-3.5 text-orange-500" />
                <Badge variant="secondary" className="text-[10px]">
                  썰 쇼츠
                </Badge>
              </div>
              <p className="text-sm font-medium line-clamp-1">
                {project.name || "제목 없음"}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {project.targetDuration ?? 0}초 · 씬{" "}
                {project.scenes?.length ?? 0}개
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
