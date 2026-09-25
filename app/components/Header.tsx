import { Sparkles, Wand2, ShieldCheck, Zap } from 'lucide-react';

export default function Header() {
  return (
    <header className="text-center space-y-3">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium tracking-wide">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span>Personal AI Writing & Prompt Fixer</span>
      </div>

      <div className="flex items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <Wand2 className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          PromptFixer
        </h1>
      </div>

      <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
        Transform messy thoughts, typos, and broken prompts into natural, crystal-clear English while keeping your exact meaning and tone.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-1 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Ultra-low latency
        </span>
        <span className="text-slate-700">•</span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Tone & voice preserved
        </span>
        <span className="text-slate-700">•</span>
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Zero corporate fluff
        </span>
      </div>
    </header>
  );
}
