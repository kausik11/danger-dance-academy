"use client";

import { useEffect, useRef } from "react";

const MAX_PUPIL_OFFSET = 15;
const MOTION_EASE = 0.16;

type EyeFollowWordProps = {
  className?: string;
  ariaLabel?: string;
};

export function EyeFollowWord({
  className = "",
  ariaLabel = "Monitoring",
}: EyeFollowWordProps) {
  const pupilRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const targetPositionsRef = useRef([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);
  const currentPositionsRef = useRef([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    let cleanup = () => {};

    void import("jquery").then(({ default: $ }) => {
      if (!isMounted) {
        return;
      }

      const $window = $(window);

      const animatePupils = () => {
        let needsNextFrame = false;

        pupilRefs.current.forEach((pupil, index) => {
          const eye = pupil?.parentElement;
          if (!pupil || !eye) {
            return;
          }

          const current = currentPositionsRef.current[index];
          const target = targetPositionsRef.current[index];
          current.x += (target.x - current.x) * MOTION_EASE;
          current.y += (target.y - current.y) * MOTION_EASE;

          if (
            Math.abs(target.x - current.x) > 0.05 ||
            Math.abs(target.y - current.y) > 0.05
          ) {
            needsNextFrame = true;
          }

          $(pupil).css("transform", `translate(${current.x}px, ${current.y}px)`);
        });

        if (needsNextFrame) {
          rafRef.current = window.requestAnimationFrame(animatePupils);
        } else {
          rafRef.current = null;
        }
      };

      const startAnimation = () => {
        if (rafRef.current !== null) {
          return;
        }

        rafRef.current = window.requestAnimationFrame(animatePupils);
      };

      const updateTargets = (pointerX: number, pointerY: number) => {
        pupilRefs.current.forEach((pupil, index) => {
          const eye = pupil?.parentElement;
          if (!pupil || !eye) {
            return;
          }

          const rect = eye.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const deltaX = pointerX - centerX;
          const deltaY = pointerY - centerY;
          const distance = Math.hypot(deltaX, deltaY) || 1;
          const travel = Math.min(MAX_PUPIL_OFFSET, distance * 0.18);

          targetPositionsRef.current[index] = {
            x: (deltaX / distance) * travel,
            y: (deltaY / distance) * travel,
          };
        });
      };

      const resetTargets = () => {
        targetPositionsRef.current = [
          { x: 0, y: 0 },
          { x: 0, y: 0 },
        ];
        startAnimation();
      };

      const onMouseMove = (event: JQuery.MouseMoveEvent) => {
        updateTargets(event.clientX, event.clientY);
        startAnimation();
      };

      const onTouchMove = (event: JQuery.TouchMoveEvent) => {
        const touch = event.originalEvent.touches?.[0];
        if (!touch) {
          return;
        }

        updateTargets(touch.clientX, touch.clientY);
        startAnimation();
      };

      $window.on("mousemove.eyeFollowWord", onMouseMove);
      $window.on("touchmove.eyeFollowWord", onTouchMove);
      $window.on("mouseleave.eyeFollowWord", resetTargets);

      cleanup = () => {
        $window.off(".eyeFollowWord");
        if (rafRef.current !== null) {
          window.cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      };
    });

    return () => {
      isMounted = false;
      cleanup();
    };
  }, []);

  return (
    <span
      className={`inline-flex items-center gap-3 rounded-[26px] px-1 py-1 ${className}`.trim()}
      aria-label={ariaLabel}
    >
      {[0, 1].map((index) => (
        <span
          key={index}
          className="nit-eye relative h-[62px] w-[74px] overflow-hidden rounded-[32px] border border-white/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(224,242,254,0.92)_100%)] shadow-[0_10px_28px_rgba(15,23,42,0.22)] sm:h-[72px] sm:w-[84px] sm:rounded-[36px]"
        >
          <span className="absolute inset-0 flex items-end justify-center pb-[10px] sm:pb-[12px]">
            <span
              ref={(element) => {
                pupilRefs.current[index] = element;
              }}
              className="h-[38px] w-[38px] rounded-full border-[2px] border-cyan-200 bg-[radial-gradient(circle_at_35%_35%,#4b5563_0%,#1f2937_60%,#0f172a_100%)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:h-[46px] sm:w-[46px]"
            />
          </span>
          <span className="nit-eye-lid nit-eye-lid-top" />
          <span className="nit-eye-lid nit-eye-lid-bottom" />
          <span className="nit-eye-strip" />
          <span className="pointer-events-none absolute left-[58%] top-[35%] h-[6px] w-[6px] rounded-full bg-white/80 sm:h-[7px] sm:w-[7px]" />
        </span>
      ))}
      <span className="sr-only">{ariaLabel}</span>
    </span>
  );
}

export default EyeFollowWord;
