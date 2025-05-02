import { OPENAI_MODELS, GEMINI_MODELS } from '@/constants/openai-models'
import { openAIConfigSchema, OpenAIConfig } from '@/schema/openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

if (!process.env.GOOGLE_GEMINI_API_KEY) {
  throw new Error('Missing GOOGLE_GEMINI_API_KEY environment variable')
}

const configData = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: OPENAI_MODELS.GPT_4O, // or your preferred model
  },
  gemini: {
    apiKey: process.env.GOOGLE_GEMINI_API_KEY,
    model: GEMINI_MODELS.GEMINI_PRO, // or your preferred model
  },
}

// Validate configuration with schema
export const config: OpenAIConfig = openAIConfigSchema.parse(configData)
