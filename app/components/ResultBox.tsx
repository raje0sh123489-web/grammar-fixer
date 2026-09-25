import { useState } from 'react';
import { Copy, Check, Sparkles, AlertCircle, RefreshCw, ArrowLeftRight } from 'lucide-react';

interface ResultBoxProps {
  result: string | null;
  originalPrompt: string;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onUseAsInput?: (text: string) => void;
}

export default function ResultBox({
  result,
  originalPrompt,
  isLoading,
  error,
  onRetry,
  onUseAsInput,
}: ResultBoxProps) {
  const [copied, setCopied] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = result;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const originalWords = originalPrompt.trim() ? originalPrompt.trim().split(/\s+/).length : 0;
  const resultWords = result?.trim() ? result.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-3">
      {/* Label and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Improved Version</span>
          </span>
          {result && !isLoading && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Ready
            </span>
          )}
        </div>

        {result && !isLoading && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowComparison(!showComparison)}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title="Toggle side-by-side comparison"
            >
              <ArrowLeftRight className="w-3 h-3" />
              <span>{showComparison ? 'Hide diff' : 'Compare'}</span>
            </button>

            {onUseAsInput && (
              <button
                type="button"
                onClick={() => onUseAsInput(result)}
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-300 transition-colors cursor-pointer"
                title="Send this result back to input for further refinement"
              >
                <span>Edit again</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Container */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden min-h-[170px] flex flex-col justify-between">
        {/* Error State */}
        {error && !isLoading && (
          <div className="p-6 flex flex-col items-center justify-center text-center space-y-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1 max-w-md">
              <h4 className="text-sm font-semibold text-slate-200">Could not improve prompt</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
            </div>
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors cursor-pointer mt-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* Loading Shimmer State */}
        {isLoading && (
          <div className="p-6 space-y-3.5 flex-1 animate-pulse">
            <div className="h-4 bg-slate-800 rounded-md w-3/4"></div>
            <div className="h-4 bg-slate-800 rounded-md w-full"></div>
            <div className="h-4 bg-slate-800 rounded-md w-5/6"></div>
            <div className="pt-4 flex items-center gap-2 text-xs text-indigo-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span>Refining grammar, flow, and tone...</span>
            </div>
          </div>
        )}

        {/* Empty / Idle State */}
        {!isLoading && !error && !result && (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-2 flex-1 text-slate-500">
            <Sparkles className="w-8 h-8 text-slate-700 stroke-[1.5]" />
            <p className="text-sm font-medium text-slate-400">Your improved prompt will appear here</p>
            <p className="text-xs text-slate-500 max-w-sm">
              Type or paste your messy thoughts above, then click <strong className="text-slate-400 font-semibold">Fix Prompt</strong>.
            </p>
          </div>
        )}

        {/* Success / Result Content */}
        {!isLoading && !error && result && (
          <div>
            {showComparison ? (
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800/80">
                <div className="p-4 bg-slate-950/30">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Original ({originalWords} words)
                  </div>
                  <p className="text-sm text-slate-400 font-mono whitespace-pre-wrap leading-relaxed">
                    {originalPrompt}
                  </p>
                </div>
                <div className="p-4 bg-indigo-950/10">
                  <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                    Improved ({resultWords} words)
                  </div>
                  <p className="text-sm sm:text-base text-slate-100 whitespace-pre-wrap font-medium leading-relaxed">
                    {result}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-5">
                <div className="text-sm sm:text-base text-slate-100 whitespace-pre-wrap font-medium leading-relaxed selection:bg-indigo-500/30">
                  {result}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Bar with Copy Button */}
        {result && !isLoading && !error && (
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-800/80 bg-slate-950/60 rounded-b-2xl">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>{resultWords} words</span>
              <span>•</span>
              <span>{result.length} characters</span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm ${
                copied
                  ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white border border-slate-700'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
