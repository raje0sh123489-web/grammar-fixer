import { fixPromptWithFallback } from '../lib/fixPrompt.ts';

// Vercel Serverless Function Handler (Node.js runtime)
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    });
  }

  try {
    const prompt = req.body?.prompt;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Prompt text is required.',
      });
    }

    const improvedPrompt = await fixPromptWithFallback(prompt);

    return res.status(200).json({
      success: true,
      improvedPrompt,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : 'Failed to rewrite prompt. Please try again.';
    return res.status(500).json({
      success: false,
      error: message,
    });
  }
}
