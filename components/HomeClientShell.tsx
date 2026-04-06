"use client";

import { MotionConfig } from "framer-motion";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { ScrollProgress } from "@/components/ScrollProgress";
import ShaderBackground from "@/components/ui/shader-background";

type HomeClientShellProps = {
  children: React.ReactNode;
};

export function HomeClientShell({ children }: HomeClientShellProps) {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <div className="relative min-h-screen">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
          <ShaderBackground className="absolute inset-0 h-full w-full opacity-28" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(167,139,250,0.12),_transparent_26%),linear-gradient(180deg,rgba(3,16,31,0.18)_0%,rgba(3,16,31,0.68)_100%)]" />
        </div>

        <div className="content-scale relative z-10">{children}</div>
        <FloatingWhatsAppButton />
      </div>
    </MotionConfig>
  );
}
