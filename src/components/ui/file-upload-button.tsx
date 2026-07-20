"use client";

import { Upload } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type Props = {
  accept: string;
  disabled?: boolean;
  label?: string;
  hint?: ReactNode;
  className?: string;
  onFile: (file: File) => Promise<void> | void;
};

export function FileUploadButton({
  accept,
  disabled,
  label = "Upload file",
  hint,
  className,
  onFile,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className={cn("space-y-1.5", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled || busy}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;
          setBusy(true);
          void Promise.resolve(onFile(file)).finally(() => setBusy(false));
        }}
      />
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={disabled || busy}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="size-3.5" aria-hidden />
        {busy ? "Uploading…" : label}
      </Button>
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
