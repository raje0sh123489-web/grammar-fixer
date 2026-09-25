import React, { useRef, useEffect } from 'react';
import { ArrowRight, RotateCcw, Sparkles, Loader2, CornerDownLeft } from 'lucide-react';

interface PromptInputProps {
  input: string;
  setInput: (value: string) => void;
  onFix: () => void;
  onClear: () => void;
  isLoading: boolean;
}

const SAMPLE_PROMPTS = [
  {
    label: 'Bro & Groq (Casual Tech)',
    text: 'bro with gemini we can use groq because it has higher limit for free usage so implement it and push the code to github',
  },
  {
    label: 'Bug Report in Slack',
    text: 'hey team auth token expired again in prod and customer getting logout randomly please check refresh logic asap',
  },
  {
    label: 'Feature Request',
    text: 'can we make a button in settings where user click and it downloads all their data in zip file with json format',
  },
];

export default function PromptInput({
  input,
  setInput,
  onFix,
  onClear,
  isLoading,
}: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle Ctrl+Enter or Cmd+Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onFix();
      }
    }
  };

  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const charCount = input.length;

  return (
    <div className="space-y-3">
      {/* Label and Quick actions */}
      <div className="flex items-center justify-between">
        <label
          htmlFor="raw-input"
          className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5"
        >
          <span>Messy Prompt / Raw Thoughts</span>
        </label>

        {input && (
          <button
            type="button"
            onClick={onClear}
            disabled={isLoading}
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Main Textarea Container */}
      <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-200">
        <textarea
          id="raw-input"
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste your messy thoughts, broken sentences, or raw prompts here..."
          rows={6}
          disabled={isLoading}
          className="w-full bg-transparent px-4 py-3.5 text-sm sm:text-base text-slate-100 placeholder-slate-500 resize-y min-h-[140px] max-h-[380px] focus:outline-none leading-relaxed"
        />

        {/* Bottom bar inside textarea */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-800/70 bg-slate-950/40 rounded-b-2xl">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </span>
            <span>•</span>
            <span>{charCount} chars</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-500">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px] border border-slate-700">
                ⌘ / Ctrl
              </kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px] border border-slate-700">
                Enter
              </kbd>
            </span>

            <button
              type="button"
              onClick={onFix}
              disabled={!input.trim() || isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Fixing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Fix Prompt</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Try Starters */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs text-slate-400 font-medium">Try example:</span>
        {SAMPLE_PROMPTS.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setInput(sample.text)}
            disabled={isLoading}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-300 hover:border-slate-700 transition-colors disabled:opacity-50 cursor-pointer text-left"
          >
            {sample.label}
          </button>
        ))}
      </div>
    </div>
  );
}
