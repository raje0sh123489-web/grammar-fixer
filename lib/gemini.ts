import { GoogleGenAI } from '@google/genai';
import { PROMPT_FIXER_SYSTEM_PROMPT } from './prompts';

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  return geminiClient;
}

/**
 * Rewrites and fixes the user's prompt using Google Gemini.
 * @param userInput The raw messy prompt or text
 * @returns The improved natural English text
 */
export async function fixWithGemini(userInput: string): Promise<string> {
  const ai = getGeminiClient();

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: userInput,
    config: {
      systemInstruction: PROMPT_FIXER_SYSTEM_PROMPT,
      temperature: 0.3,
    },
  });

  const output = response.text?.trim();
  if (!output) {
    throw new Error('Gemini returned an empty response');
  }

  return output;
}
