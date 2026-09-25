import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PromptFixer - AI Writing & Prompt Improver',
  description: 'Rewrite messy thoughts, casual English, and broken prompts into natural, crystal-clear prose while preserving your tone.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
