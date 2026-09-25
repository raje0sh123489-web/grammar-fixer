import Groq from 'groq-sdk';
import { PROMPT_FIXER_SYSTEM_PROMPT } from './prompts.ts';

let groqClient: Groq | null = null;

function getGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  if (!groqClient) {
    groqClient = new Groq({ apiKey });
  }

  return groqClient;
}

/**
 * Rewrites and fixes the user's prompt using Groq (Llama 3.3).
 * Serves as the high-speed, high-rate-limit fallback provider.
 * @param userInput The raw messy prompt or text
 * @returns The improved natural English text
 */
export async function fixWithGroq(userInput: string): Promise<string> {
  const groq = getGroqClient();

  const chatCompletion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: PROMPT_FIXER_SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: userInput,
      },
    ],
    temperature: 0.3,
  });

  const output = chatCompletion.choices?.[0]?.message?.content?.trim();
  if (!output) {
    throw new Error('Groq returned an empty response');
  }

  return output;
}
