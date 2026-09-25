import { fixWithGemini } from './gemini';
import { fixWithGroq } from './groq';

/**
 * Executes prompt improvement with seamless automatic fallback:
 * 1. Attempts Google Gemini primary model
 * 2. If Gemini fails or errors, automatically cascades to Groq (Llama 3.3)
 * 3. Returns the improved text transparently without revealing provider details to the end-user
 */
export async function fixPromptWithFallback(rawPrompt: string): Promise<string> {
  const trimmed = rawPrompt.trim();
  if (!trimmed) {
    throw new Error('Please enter some text to fix.');
  }

  // 1. Try Gemini
  try {
    return await fixWithGemini(trimmed);
  } catch (geminiError: unknown) {
    // Log server-side warning only for developer telemetry
    console.warn(
      'Gemini processing unsuccessful, executing automated fallback to Groq.',
      geminiError instanceof Error ? geminiError.message : geminiError
    );

    // 2. Cascade to Groq fallback
    try {
      return await fixWithGroq(trimmed);
    } catch (groqError: unknown) {
      console.error(
        'All AI providers encountered an error:',
        groqError instanceof Error ? groqError.message : groqError
      );
      // Return a clean, user-friendly error without exposing keys or stack traces
      throw new Error(
        'Unable to process your request at this moment. Please check your network connection or try again in a few seconds.'
      );
    }
  }
}
