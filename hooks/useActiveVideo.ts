import { useCallback, useEffect, useRef } from "react";

export function useActiveVideo(activeId: string) {
  const videoMapRef = useRef(new Map<string, HTMLVideoElement>());

  const registerVideo = useCallback(
    (id: string) => (node: HTMLVideoElement | null) => {
      if (node) {
        videoMapRef.current.set(id, node);
        return;
      }

      videoMapRef.current.delete(id);
    },
    [],
  );

  useEffect(() => {
    videoMapRef.current.forEach((video, id) => {
      video.muted = true;
      video.playsInline = true;

      if (id === activeId) {
        const playAttempt = video.play();
        if (playAttempt && typeof playAttempt.catch === "function") {
          playAttempt.catch(() => {
            // Autoplay can still be blocked in some environments.
          });
        }
        return;
      }

      video.pause();
    });
  }, [activeId]);

  return { registerVideo };
}
