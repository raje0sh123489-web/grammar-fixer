import Groq from 'groq-sdk';
import { PROMPT_FIXER_SYSTEM_PROMPT } from './prompts';

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

// Preferred Groq models in order of capability & availability
const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'openai/gpt-oss-120b',
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-20b',
  'llama-3.1-8b-instant',
];

/**
 * Rewrites and fixes the user's prompt using Groq.
 * Automatically tries available models on the account.
 * @param userInput The raw messy prompt or text
 * @returns The improved natural English text
 */
export async function fixWithGroq(userInput: string): Promise<string> {
  const groq = getGroqClient();

  let lastError: unknown = null;

  for (const model of GROQ_MODELS) {
    try {
      const chatCompletion = await groq.chat.completions.create({
        model,
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
      if (output) {
        return output;
      }
    } catch (err: unknown) {
      lastError = err;
      // If model not found or quota issue, cascade to next Groq model
      continue;
    }
  }

  throw lastError || new Error('Groq returned an empty response');
}
