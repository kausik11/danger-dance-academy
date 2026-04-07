"use client";

import { resolveVideoEmbed } from "@/lib/video-embed";

type VideoFrameProps = {
  src: string;
  title: string;
  className?: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  preload?: "none" | "metadata" | "auto";
};

export function VideoFrame({
  src,
  title,
  className,
  poster,
  autoPlay,
  muted,
  loop,
  controls = true,
  preload = "metadata",
}: VideoFrameProps) {
  const resolvedVideo = resolveVideoEmbed(src);

  if (!resolvedVideo.src) {
    return (
      <div
        className={className}
      />
    );
  }

  if (resolvedVideo.kind === "embed") {
    return (
      <iframe
        src={resolvedVideo.src}
        title={title}
        className={className}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }

  return (
    <video
      src={resolvedVideo.src}
      title={title}
      className={className}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      controls={controls}
      playsInline
      preload={preload}
      poster={poster}
    />
  );
}
