import { fixPromptWithFallback } from '../../../lib/fixPrompt.ts';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'Prompt text is required.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const improvedPrompt = await fixPromptWithFallback(prompt);

    return new Response(
      JSON.stringify({
        success: true,
        improvedPrompt,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to rewrite prompt. Please try again.';
    return new Response(
      JSON.stringify({ success: false, error: message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
