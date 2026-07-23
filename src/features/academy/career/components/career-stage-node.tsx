"use client";

import { Check } from "lucide-react";
import { careerStageIcon } from "@/features/academy/career/utils/career-icons";
import type { CareerStageState } from "@/features/academy/career/utils/career-stage-state";
import { cn } from "@/lib/utils/cn";

export type CareerStageNodeData = {
  id: number;
  title: string;
  summary?: string | null;
  iconKey?: string | null;
};

export function CareerStageNode({
  stage,
  state,
  index,
  interactive,
  selected,
  onSelect,
}: {
  stage: CareerStageNodeData;
  state: CareerStageState;
  index: number;
  interactive?: boolean;
  selected?: boolean;
  onSelect?: (stageId: number) => void;
}) {
  const Icon = careerStageIcon(stage.iconKey);
  const content = (
    <>
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center border",
          state === "completed" && "border-accent bg-accent text-white",
          state === "current" &&
            "border-highlight bg-highlight text-white ring-4 ring-highlight/25",
          state === "upcoming" && "border-border bg-surface text-muted",
        )}
      >
        {state === "completed" ? (
          <Check className="size-4" aria-hidden />
        ) : (
          <Icon className="size-4" aria-hidden />
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p
            className={cn(
              "font-display text-base font-medium",
              state === "upcoming" ? "text-muted" : "text-primary",
            )}
          >
            {stage.title}
          </p>
          {state === "current" ? (
            <span className="rounded-sm bg-highlight/15 px-2 py-0.5 text-[11px] font-medium tracking-wide text-highlight uppercase">
              You are here
            </span>
          ) : null}
        </div>
        {stage.summary ? (
          <p className="text-sm leading-relaxed text-muted line-clamp-2">
            {stage.summary}
          </p>
        ) : null}
        <p className="text-[11px] tracking-wide text-muted/80 uppercase">
          Stage {index + 1}
        </p>
      </div>
    </>
  );

  if (interactive && onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(stage.id)}
        className={cn(
          "flex w-full items-start gap-4 border px-4 py-4 text-left transition-colors",
          selected
            ? "border-accent bg-accent/10"
            : "border-border bg-surface hover:bg-sea-foam",
        )}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={cn(
        "flex items-start gap-4 border px-4 py-4",
        state === "current"
          ? "border-highlight/40 bg-highlight/5"
          : "border-border bg-surface",
      )}
    >
      {content}
    </div>
  );
}
