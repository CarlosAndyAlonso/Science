import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface ContentGenerationRequest {
  platform: string;
  contentType: string;
  brief: string;
  images?: string[]; // base64 encoded images
  template?: string;
}

export interface GeneratedContent {
  title: string;
  content: string;
  hashtags: string[];
  metadata: {
    estimatedDuration?: string;
    wordCount: number;
    characterCount: number;
    tone: string;
    targetAudience: string;
  };
}