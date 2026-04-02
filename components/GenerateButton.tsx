"use client";

import { motion } from "framer-motion";

type GenerateButtonProps = {
  disabled: boolean;
  loading: boolean;
  progress: number;
  onClick: () => void;
};

export function GenerateButton({
  disabled,
  loading,
  progress,
  onClick,
}: GenerateButtonProps) {
  return (
    <div>
      <motion.button
        type="button"
        onClick={onClick}
        disabled={disabled}
        whileHover={disabled ? undefined : { scale: 1.01 }}
        whileTap={disabled ? undefined : { scale: 0.99 }}
        className={`flex h-14 w-full items-center justify-center gap-3 rounded-full px-6 text-sm font-semibold ${
          disabled
            ? "cursor-not-allowed bg-white/[0.08] text-slate-500"
            : "bg-[linear-gradient(135deg,#d1fff6_0%,#81e6ff_42%,#ffffff_100%)] text-slate-950 shadow-[0_0_45px_rgba(103,232,249,0.26)]"
        }`}
      >
        {loading ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 0.8,
                ease: "linear",
              }}
              className="inline-flex h-4 w-4 rounded-full border-2 border-slate-900/30 border-t-slate-900"
            />
            Generating Preview...
          </>
        ) : (
          "Generate Video"
        )}
      </motion.button>

      {loading ? (
        <div className="mt-4 space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,#5eead4_0%,#7dd3fc_100%)]"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.25 }}
            />
          </div>
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-400">
            <span>Preparing motion pass</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
