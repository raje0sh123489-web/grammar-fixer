import { useState, useEffect } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ResultBox from './components/ResultBox';
import { History, Trash2, ArrowUpRight } from 'lucide-react';

interface HistoryItem {
  id: string;
  original: string;
  improved: string;
  timestamp: number;
}

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('promptfixer_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  const saveToHistory = (original: string, improved: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      original,
      improved,
      timestamp: Date.now(),
    };
    const updated = [newItem, ...history.filter(h => h.original !== original)].slice(0, 10);
    setHistory(updated);
    try {
      localStorage.setItem('promptfixer_history', JSON.stringify(updated));
    } catch {
      // Ignore localStorage write errors
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('promptfixer_history');
    } catch {
      // Ignore
    }
  };

  const handleFix = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setOriginalPrompt(trimmed);

    try {
      const response = await fetch('/api/fix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: trimmed }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to rewrite prompt. Please try again.');
      }

      setResult(data.improvedPrompt);
      saveToHistory(trimmed, data.improvedPrompt);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Unable to connect to the server. Please check your internet connection.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
    setError(null);
    setOriginalPrompt('');
  };

  const handleRetry = () => {
    if (originalPrompt) {
      setInput(originalPrompt);
      handleFix();
    } else if (input.trim()) {
      handleFix();
    }
  };

  const handleUseAsInput = (text: string) => {
    setInput(text);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background subtle radial gradient */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.12),rgba(255,255,255,0))]" />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12 relative z-10 flex flex-col justify-between">
        <div className="space-y-8">
          {/* Header */}
          <Header />

          {/* Form Area */}
          <div className="space-y-6">
            <PromptInput
              input={input}
              setInput={setInput}
              onFix={handleFix}
              onClear={handleClear}
              isLoading={isLoading}
            />

            <ResultBox
              result={result}
              originalPrompt={originalPrompt}
              isLoading={isLoading}
              error={error}
              onRetry={handleRetry}
              onUseAsInput={handleUseAsInput}
            />
          </div>

          {/* History Accordion if available */}
          {history.length > 0 && (
            <div className="pt-4 border-t border-slate-900">
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => setShowHistory(!showHistory)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Recent Fixes ({history.length})</span>
                </button>

                {showHistory && (
                  <button
                    type="button"
                    onClick={clearHistory}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear history</span>
                  </button>
                )}
              </div>

              {showHistory && (
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all text-xs space-y-1.5 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-slate-400 font-mono line-clamp-1">
                          {item.original}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setInput(item.original);
                            setResult(item.improved);
                            setOriginalPrompt(item.original);
                          }}
                          className="text-indigo-400 hover:text-indigo-300 shrink-0 inline-flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <span>Load</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-slate-200 font-medium line-clamp-2">
                        {item.improved}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-900 text-center text-xs text-slate-500 space-y-1">
          <p>
            PromptFixer • Built with Next.js, Gemini API & Groq Fallback
          </p>
          <p className="text-[11px] text-slate-600">
            Auto-cascades transparently across high-speed models to keep uptime 100%.
          </p>
        </footer>
      </main>
    </div>
  );
}
