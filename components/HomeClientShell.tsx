"use client";

import { MotionConfig } from "framer-motion";
import { ScrollProgress } from "@/components/ScrollProgress";

type HomeClientShellProps = {
  children: React.ReactNode;
};

export function HomeClientShell({ children }: HomeClientShellProps) {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      {children}
    </MotionConfig>
  );
}
