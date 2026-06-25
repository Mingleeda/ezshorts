"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";

interface EditableTagsProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
}

export function EditableTags({ tags, onChange, disabled }: EditableTagsProps) {
  const [inputValue, setInputValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInputValue("");
    }
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Escape") {
      setIsAdding(false);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.map((tag, index) => (
        <Badge
          key={`${tag}-${index}`}
          variant="secondary"
          className="text-[10px] font-normal gap-1 pr-1 group"
        >
          {tag}
          {!disabled && (
            <button
              onClick={() => removeTag(index)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          )}
        </Badge>
      ))}
      {!disabled && (
        isAdding ? (
          <Input
            autoFocus
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={addTag}
            placeholder="태그 입력"
            className="h-6 w-24 text-[10px] px-2"
          />
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-0.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="h-3 w-3" />
          </button>
        )
      )}
    </div>
  );
}
