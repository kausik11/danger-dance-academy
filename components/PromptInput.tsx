"use client";

type PromptInputProps = {
  value: string;
  onChange: (value: string) => void;
  limit?: number;
};

export function PromptInput({
  value,
  onChange,
  limit = 200,
}: PromptInputProps) {
  const remaining = limit - value.length;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl text-white">Prompt</h2>
          <p className="text-sm text-slate-400">
            Describe animation, motion energy, and camera intent.
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            remaining < 20
              ? "bg-amber-300/12 text-amber-100"
              : "bg-white/[0.06] text-slate-300"
          }`}
        >
          {value.length}/{limit}
        </span>
      </div>

      <label className="block">
        <span className="sr-only">Describe animation...</span>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value.slice(0, limit))}
          rows={5}
          placeholder="Describe animation..."
          className="min-h-[10rem] w-full rounded-[28px] border border-white/12 bg-black/20 px-5 py-4 text-base text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/[0.45] focus:bg-white/[0.06]"
        />
      </label>
    </div>
  );
}
