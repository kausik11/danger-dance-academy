"use client";

import { motion } from "framer-motion";
import { MOCK_VIDEO_URL } from "@/lib/api";

type ResultPreviewProps = {
  isLoading: boolean;
  videoUrl: string | null;
  prompt: string;
  sourceLabel: string;
};

export function ResultPreview({
  isLoading,
  videoUrl,
  prompt,
  sourceLabel,
}: ResultPreviewProps) {
  const activeVideo = videoUrl ?? MOCK_VIDEO_URL;
  const isFallback = !videoUrl;

  return (
    <div className="glass-panel overflow-hidden rounded-[32px] p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-100/70">
            Result Preview
          </p>
          <h2 className="mt-3 font-display text-3xl text-white">
            {isLoading ? "Rendering..." : "Playback Ready"}
          </h2>
        </div>
        <a
          href={activeVideo}
          download
          className="inline-flex h-11 items-center justify-center rounded-full border border-white/12 bg-white/5 px-5 text-sm font-semibold text-white hover:border-cyan-300/40 hover:bg-cyan-300/10"
        >
          Download
        </a>
      </div>

      <div className="glass-card mt-6 overflow-hidden rounded-[28px]">
        {isLoading ? (
          <div className="aspect-video w-full animate-pulse bg-[linear-gradient(120deg,rgba(15,23,42,1)_0%,rgba(30,41,59,0.85)_50%,rgba(15,23,42,1)_100%)]" />
        ) : (
          <motion.video
            key={activeVideo}
            initial={{ opacity: 0.6, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="aspect-video w-full object-cover"
            src={activeVideo}
            controls
            loop
            playsInline
          />
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="glass-card rounded-[24px] p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Source
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-200">{sourceLabel}</p>
        </div>
        <div className="glass-card rounded-[24px] p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Status
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-200">
            {isLoading
              ? "Compositing a mock result for the UI demo."
              : isFallback
                ? "No backend connected yet, showing the local placeholder reel."
                : "Mock render complete and ready for download."}
          </p>
        </div>
      </div>

      <div className="glass-card mt-4 rounded-[24px] p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
          Prompt Snapshot
        </p>
        <p className="mt-2 text-sm leading-7 text-slate-200">
          {prompt || "Your prompt will appear here once you start directing the motion."}
        </p>
      </div>
    </div>
  );
}
