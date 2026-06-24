"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  BookOpen,
  Users,
  ShoppingBag,
  GraduationCap,
  Trash2,
  Clock,
} from "lucide-react";
import { getProjects, deleteProject, type SavedProject } from "@/lib/storage";
import type { ContentType } from "@/types";

const typeConfig: Record<
  ContentType,
  { label: string; icon: typeof BookOpen; color: string }
> = {
  stories: { label: "썰 쇼츠", icon: BookOpen, color: "text-orange-500" },
  series: { label: "시리즈", icon: Users, color: "text-blue-500" },
  ads: { label: "제품 광고", icon: ShoppingBag, color: "text-green-500" },
  education: { label: "유아 학습", icon: GraduationCap, color: "text-purple-500" },
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<SavedProject[]>([]);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const handleDelete = (id: string) => {
    deleteProject(id);
    setProjects(getProjects());
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">내 프로젝트</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {projects.length}개 프로젝트
          </p>
        </div>
        <Link href="/new">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            새 프로젝트
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-lg border border-dashed p-16 text-center">
          <p className="text-muted-foreground mb-4">
            아직 프로젝트가 없습니다
          </p>
          <Link href="/new">
            <Button variant="outline" className="gap-1.5">
              <Plus className="h-4 w-4" />
              첫 프로젝트 만들기
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const config = typeConfig[project.type];
            const Icon = config.icon;
            return (
              <Card key={project.id} className="group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${config.color}`} />
                      <Badge variant="secondary" className="text-xs">
                        {config.label}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <CardTitle className="text-base mt-1">
                    {project.name || "제목 없음"}
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-2">
                    {project.storyText?.slice(0, 80) ?? ""}...
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {project.targetDuration ?? 0}초
                    </div>
                    <span>
                      씬 {project.scenes?.length ?? 0}개
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
