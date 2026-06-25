import type { Scene, Atmosphere, ArtStyle } from "@/types";

export interface ScenarioTemplate {
  id: string;
  name: string;
  atmosphere: Atmosphere;
  artStyle: ArtStyle;
  targetDuration: number;
  scenes: Scene[];
  createdAt: string;
}

const STORAGE_KEY = "ezshorts_templates";

export function getTemplates(): ScenarioTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTemplate(template: ScenarioTemplate): void {
  const templates = getTemplates();
  templates.unshift(template);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

export function deleteTemplate(id: string): void {
  const templates = getTemplates().filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}
