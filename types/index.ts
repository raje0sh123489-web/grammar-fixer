export interface FixPromptRequest {
  prompt: string;
}

export interface FixPromptResponse {
  success: boolean;
  improvedPrompt?: string;
  error?: string;
}
