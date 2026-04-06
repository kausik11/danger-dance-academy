"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type UploadBoxProps = {
  file: File | null;
  onFileChange: (file: File | null) => void;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function UploadBox({ file, onFileChange }: UploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  function updatePreview(nextUrl: string | null) {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    previewUrlRef.current = nextUrl;
    setPreviewUrl(nextUrl);
  }

  function validateAndSave(nextFile: File | null) {
    if (!nextFile) {
      updatePreview(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      onFileChange(null);
      setError(null);
      return;
    }

    const isSupportedType =
      nextFile.type.startsWith("image/") || nextFile.type.startsWith("video/");

    if (!isSupportedType) {
      setError("Only image and video files are supported.");
      return;
    }

    if (nextFile.size > MAX_FILE_SIZE) {
      setError("Please upload a file smaller than 10MB.");
      return;
    }

    setError(null);
    updatePreview(URL.createObjectURL(nextFile));
    onFileChange(nextFile);
  }

  const isImage = Boolean(file?.type.startsWith("image/"));
  const isVideo = Boolean(file?.type.startsWith("video/"));

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl text-white">Upload Source</h2>
          <p className="text-sm text-slate-400">
            Drag in an image or video up to 10MB.
          </p>
        </div>
        {file ? (
          <button
            type="button"
            onClick={() => validateAndSave(null)}
            className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200 hover:border-rose-300/30 hover:bg-rose-300/10 hover:text-white"
          >
            Remove
          </button>
        ) : null}
      </div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          validateAndSave(event.dataTransfer.files[0] ?? null);
        }}
        className={`relative cursor-pointer overflow-hidden rounded-[28px] border-2 border-dashed p-5 ${
          isDragging
            ? "glass-card border-cyan-300/60 bg-cyan-300/10"
            : "glass-card border-white/12 hover:border-cyan-300/35 hover:bg-white/[0.06]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(event) => validateAndSave(event.target.files?.[0] ?? null)}
        />

        <div className="flex min-h-[17rem] flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.08] text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.16)]">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 16V5M12 5L8 9M12 5L16 9M5 16.5V17.5C5 18.6046 5.89543 19.5 7 19.5H17C18.1046 19.5 19 18.6046 19 17.5V16.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>
            <p className="font-display text-2xl text-white">
              Drop media here or click to browse
            </p>
            <p className="mt-2 text-sm text-slate-400">
              PNG, JPG, MP4, and MOV all work for the shell demo.
            </p>
          </div>

          <AnimatePresence initial={false}>
            {file && previewUrl ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="glass-card w-full max-w-md overflow-hidden rounded-[24px]"
              >
                {isImage ? (
                  <Image
                    src={previewUrl}
                    alt={file.name}
                    width={1280}
                    height={720}
                    unoptimized
                    className="aspect-video w-full object-cover"
                  />
                ) : null}
                {isVideo ? (
                  <video
                    src={previewUrl}
                    className="aspect-video w-full object-cover"
                    controls
                  />
                ) : null}
                <div className="flex items-center justify-between gap-3 px-4 py-3 text-left">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {file.name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      {(file.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                  <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-50">
                    Ready
                  </span>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>

      {error ? <p className="mt-3 text-sm text-rose-200">{error}</p> : null}
    </div>
  );
}
