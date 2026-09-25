import { fixPromptWithFallback } from '../lib/fixPrompt';

// Vercel Serverless Function Handler (Node.js runtime on Vercel)
export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        // parsed already or unparsable
      }
    }

    const prompt = body?.prompt;
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
