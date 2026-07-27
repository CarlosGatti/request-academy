"use client";

import { useRef, useState } from "react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Button } from "@/components/ui/button";
import { validateAvatarFile } from "@/lib/media/prepare-avatar-file";
import { resolveMediaUrl } from "@/lib/media/resolve-media-url";
import { uploadUserAvatar } from "@/lib/media/upload-user-avatar";
import { cn } from "@/lib/utils/cn";

type Props = {
  token: string;
  profilePicture?: string | null;
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  onUpdated: (profilePicture: string | null) => void;
  onSave: (profilePicture: string | null) => Promise<void>;
  size?: number;
  className?: string;
};

export function ProfileAvatarUpload({
  token,
  profilePicture,
  displayName,
  firstName,
  lastName,
  email,
  onUpdated,
  onSave,
  size = 96,
  className,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [cacheKey, setCacheKey] = useState<number | null>(null);

  const resolved = resolveMediaUrl(profilePicture);
  const showSrc = preview ?? resolved;

  async function handleFile(file: File) {
    setError(null);
    const validationError = validateAvatarFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setBusy(true);

    try {
      const { absoluteUrl } = await uploadUserAvatar(file, token);
      await onSave(absoluteUrl);
      setCacheKey(Date.now());
      onUpdated(absoluteUrl);
      setPreview(null);
    } catch (e) {
      setPreview(null);
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      URL.revokeObjectURL(objectUrl);
    }
  }

  async function handleRemove() {
    if (!confirm("Remove profile photo?")) return;
    setBusy(true);
    setError(null);
    try {
      await onSave(null);
      setPreview(null);
      setCacheKey(null);
      onUpdated(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not remove photo");
    } finally {
      setBusy(false);
    }
  }

  function onDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragOver(false);
    if (busy) return;
    const file = event.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  }

  return (
    <div className={cn("flex flex-col items-start gap-4", className)}>
      <div
        className={cn(
          "flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-surface p-6 transition-colors sm:flex-row sm:items-center sm:gap-6",
          dragOver && "border-accent bg-secondary/40",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="relative rounded-full ring-2 ring-border ring-offset-2 ring-offset-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
          style={{ width: size, height: size }}
          aria-label="Change profile photo"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt=""
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <UserAvatar
              profilePicture={profilePicture}
              displayName={displayName}
              firstName={firstName}
              lastName={lastName}
              email={email}
              size={size}
              cacheKey={cacheKey}
              className="bg-secondary"
            />
          )}
          {busy ? (
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-primary/50 text-xs font-medium text-sea-foam">
              …
            </span>
          ) : null}
        </button>

        <div className="space-y-3 text-center sm:text-left">
          <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              Change photo
            </Button>
            {showSrc ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={busy}
                onClick={() => void handleRemove()}
              >
                Remove
              </Button>
            ) : null}
          </div>
          <p className="max-w-xs text-xs text-muted">
            JPEG, PNG, WebP or GIF. Max 10 MB. Square crop applied automatically.
            Drop an image here to upload.
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />

      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
