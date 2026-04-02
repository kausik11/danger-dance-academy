"use client";

import { startTransition, useEffect, useState } from "react";
import { GenerateButton } from "@/components/GenerateButton";
import { Navbar } from "@/components/Navbar";
import { PromptInput } from "@/components/PromptInput";
import { ResultPreview } from "@/components/ResultPreview";
import { UploadBox } from "@/components/UploadBox";
import { generateVideo, type GenerateVideoResponse } from "@/lib/api";

const promptSuggestions = [
  "Turn the portrait into a floating, cinematic camera move with soft wind motion.",
  "Make the dancer snap into a high-energy, beat-synced routine with a neon club vibe.",
  "Animate the character with a slow walk cycle and subtle hoodie fabric movement.",
];

const statusCards = [
  { label: "Mode", value: "Mock API" },
  { label: "Style", value: "Viggle Shell" },
  { label: "Output", value: "Preview MP4" },
];

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateVideoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 92) {
          return current;
        }

        if (current < 40) {
          return Math.min(92, current + 9);
        }

        if (current < 72) {
          return Math.min(92, current + 5);
        }

        return Math.min(92, current + 2);
      });
    }, 260);

    return () => window.clearInterval(intervalId);
  }, [loading]);

  async function handleGenerate() {
    if (!file || !prompt.trim()) {
      return;
    }

    setError(null);
    setResult(null);
    setProgress(12);
    setLoading(true);

    try {
      const response = await generateVideo(file, prompt.trim());

      setProgress(100);
      startTransition(() => {
        setResult(response);
      });

      window.setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 320);
    } catch (generationError) {
      setLoading(false);
      setProgress(0);
      setError(
        generationError instanceof Error
          ? generationError.message
          : "Something went wrong while creating the preview.",
      );
    }
  }

  const canGenerate = Boolean(file && prompt.trim()) && !loading;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="mesh-overlay absolute inset-0 opacity-20" />
      <div className="absolute left-[-8rem] top-24 h-80 w-80 rounded-full bg-cyan-400/12 blur-3xl" />
      <div className="absolute right-[-12rem] top-56 h-96 w-96 rounded-full bg-blue-400/12 blur-3xl" />

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-16 pt-6 sm:px-8 lg:px-10">
        <Navbar ctaHref="/" ctaLabel="Back Home" />

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="glass-panel rounded-[32px] p-6 sm:p-8">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-100/70">
                  Motion Studio
                </p>
                <h1 className="mt-3 font-display text-3xl text-white sm:text-4xl">
                  Direct the motion, then preview the result.
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300/80">
                  This shell stores the uploaded asset and prompt in local state, simulates a three-second generation run, and then displays a downloadable mock video.
                </p>
              </div>
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.08] px-4 py-3 text-sm text-cyan-50">
                Frontend-only for now
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {promptSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setPrompt(suggestion)}
                  className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-left text-xs leading-5 text-slate-200 hover:border-cyan-300/40 hover:bg-cyan-300/10"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <div className="mt-8 space-y-6">
              <UploadBox file={file} onFileChange={setFile} />
              <PromptInput value={prompt} onChange={setPrompt} />
              <GenerateButton
                disabled={!canGenerate}
                loading={loading}
                progress={progress}
                onClick={handleGenerate}
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              {statusCards.map((card) => (
                <div
                  key={card.label}
                  className="min-w-[9rem] rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    {card.label}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            {error ? (
              <p className="mt-4 rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </p>
            ) : null}
          </div>

          <div className="space-y-6">
            <ResultPreview
              isLoading={loading}
              videoUrl={result?.videoUrl ?? null}
              prompt={result?.prompt ?? prompt}
              sourceLabel={result?.sourceFileName ?? file?.name ?? "No file selected yet"}
            />

            <div className="glass-panel rounded-[28px] p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-100/70">
                Pipeline
              </p>
              <div className="mt-5 space-y-4">
                {[
                  "1. Upload an image or video source",
                  "2. Write the motion prompt",
                  "3. Trigger generation and inspect the preview",
                ].map((step) => (
                  <div
                    key={step}
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-200"
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
