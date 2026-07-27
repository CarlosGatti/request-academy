"use client";

import { Upload } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Props = {
  accept: string;
  disabled?: boolean;
  label?: string;
  hint?: ReactNode;
  className?: string;
  fileName?: string | null;
  onFile: (file: File) => Promise<void> | void;
  onClear?: () => void;
};

/**
 * Drag-and-drop upload zone with keyboard-accessible file picker fallback.
 */
export function FileUpload({
  accept,
  disabled,
  label = "Upload a file",
  hint,
  className,
  fileName,
  onFile,
  onClear,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setLocalError(null);
    setBusy(true);
    try {
      await onFile(file);
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Unable to upload file.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled || busy}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          void handleFile(file);
        }}
      />
      <button
        type="button"
        disabled={disabled || busy}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void handleFile(event.dataTransfer.files?.[0]);
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          "disabled:cursor-not-allowed disabled:opacity-50",
          dragging
            ? "border-accent bg-accent/5 text-primary"
            : "border-border bg-sea-foam/40 text-muted hover:border-accent/50 hover:bg-sea-foam",
        )}
      >
        <Upload className="size-5 text-accent" aria-hidden />
        <span className="text-sm font-medium text-primary">
          {busy ? "Uploading…" : label}
        </span>
        {hint ? <span className="text-xs text-muted">{hint}</span> : null}
      </button>
      {fileName ? (
        <div className="flex items-center justify-between gap-2 rounded-md bg-secondary px-3 py-2 text-sm">
          <span className="truncate text-primary">{fileName}</span>
          {onClear ? (
            <button
              type="button"
              className="shrink-0 text-xs font-medium text-accent hover:underline"
              onClick={onClear}
            >
              Remove
            </button>
          ) : null}
        </div>
      ) : null}
      {localError ? (
        <p className="text-xs text-danger" role="alert">
          {localError}
        </p>
      ) : null}
    </div>
  );
}
