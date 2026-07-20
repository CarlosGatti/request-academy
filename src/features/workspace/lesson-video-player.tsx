"use client";

import { useMutation } from "@apollo/client/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { UpdateDefinedAcademyLessonProgressDocument } from "@/graphql/generated/graphql";
import { useDebouncedCallback } from "@/lib/hooks/use-debounced-callback";

const PROGRESS_INTERVAL_MS = 15_000;

type Props = {
  enrollmentId: number;
  lessonId: number;
  videoUrl: string;
  title: string;
  initialPositionSeconds?: number | null;
  onProgressSaved?: () => void;
};

function isEmbedUrl(url: string) {
  return (
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.includes("vimeo.com") ||
    url.includes("embed")
  );
}

export function LessonVideoPlayer({
  enrollmentId,
  lessonId,
  videoUrl,
  title,
  initialPositionSeconds,
  onProgressSaved,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [updateProgress] = useMutation(UpdateDefinedAcademyLessonProgressDocument);
  const lastSentRef = useRef(0);
  const resumedRef = useRef(false);

  const sendProgress = useCallback(
    async (currentTime: number, duration: number) => {
      const position = Math.floor(currentTime);
      if (position === lastSentRef.current) return;
      lastSentRef.current = position;

      const percentage =
        duration > 0 ? Math.min(99, Math.round((currentTime / duration) * 100)) : 0;

      try {
        await updateProgress({
          variables: {
            enrollmentId,
            lessonId,
            input: {
              lastPositionSeconds: position,
              progressPercentage: percentage,
            },
          },
        });
        onProgressSaved?.();
      } catch {
        // Non-blocking progress updates
      }
    },
    [enrollmentId, lessonId, onProgressSaved, updateProgress],
  );

  const debouncedSend = useDebouncedCallback(
    (currentTime: number, duration: number) => {
      void sendProgress(currentTime, duration);
    },
    2000,
  );

  useEffect(() => {
    if (isEmbedUrl(videoUrl)) return;

    const video = videoRef.current;
    const interval = setInterval(() => {
      const current = videoRef.current;
      if (!current || current.paused || current.ended) return;
      void sendProgress(current.currentTime, current.duration || 0);
    }, PROGRESS_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      if (video && !isEmbedUrl(videoUrl)) {
        void sendProgress(video.currentTime, video.duration || 0);
      }
    };
  }, [sendProgress, videoUrl]);

  if (isEmbedUrl(videoUrl)) {
    return (
      <div className="space-y-2">
        <div className="aspect-video overflow-hidden border border-border bg-primary/5">
          <iframe
            src={videoUrl}
            title={title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="text-xs text-muted">
          Embedded video progress is tracked when you mark the lesson complete.
        </p>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      controls
      className="w-full border border-border bg-black"
      src={videoUrl}
      onLoadedMetadata={(event) => {
        if (resumedRef.current) return;
        const resumeAt = initialPositionSeconds ?? 0;
        if (resumeAt > 0 && resumeAt < event.currentTarget.duration) {
          event.currentTarget.currentTime = resumeAt;
        }
        resumedRef.current = true;
      }}
      onTimeUpdate={(event) => {
        debouncedSend(event.currentTarget.currentTime, event.currentTarget.duration || 0);
      }}
      onPause={(event) => {
        void sendProgress(event.currentTarget.currentTime, event.currentTarget.duration || 0);
      }}
      onEnded={(event) => {
        void sendProgress(event.currentTarget.duration, event.currentTarget.duration);
      }}
    >
      <track kind="captions" />
    </video>
  );
}

export function ManualProgressControls({
  enrollmentId,
  lessonId,
}: {
  enrollmentId: number;
  lessonId: number;
}) {
  const [updateProgress, { loading }] = useMutation(
    UpdateDefinedAcademyLessonProgressDocument,
  );
  const [saved, setSaved] = useState(false);

  const markHalfway = async () => {
    setSaved(false);
    try {
      await updateProgress({
        variables: {
          enrollmentId,
          lessonId,
          input: { progressPercentage: 50 },
        },
      });
      setSaved(true);
    } catch {
      // ignore
    }
  };

  return (
    <button
      type="button"
      className="text-xs font-medium text-accent hover:underline disabled:opacity-50"
      disabled={loading}
      onClick={() => void markHalfway()}
    >
      {saved ? "Progress saved" : "Save progress checkpoint"}
    </button>
  );
}
