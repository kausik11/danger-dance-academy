"use client";

import { useEffect } from "react";
import { resolveVideoEmbed } from "@/lib/video-embed";

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: () => void;
      };
    };
  }
}

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
  const resolvedVideo = resolveVideoEmbed(src, { autoPlay });
  const isInstagramEmbed =
    resolvedVideo.kind === "embed" && resolvedVideo.provider === "instagram";

  useEffect(() => {
    if (!isInstagramEmbed) {
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://www.instagram.com/embed.js"]',
    ) as HTMLScriptElement | null;

    function processEmbeds() {
      window.instgrm?.Embeds?.process();
    }

    if (existingScript) {
      processEmbeds();
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.instagram.com/embed.js";
    script.onload = processEmbeds;
    document.body.appendChild(script);
  }, [isInstagramEmbed, src]);

  if (!resolvedVideo.src) {
    return (
      <div
        className={className}
      />
    );
  }

  if (resolvedVideo.kind === "embed") {
    if (isInstagramEmbed) {
      return (
        <div className={className}>
          <blockquote
            className="instagram-media !m-0 !min-w-0 !max-w-none"
            data-instgrm-permalink={src}
            data-instgrm-version="14"
            style={{
              background: "#FFFFFF",
              border: 0,
              borderRadius: "0",
              boxShadow: "none",
              margin: 0,
              maxWidth: "100%",
              minWidth: "100%",
              padding: 0,
              width: "100%",
            }}
          />
        </div>
      );
    }

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
