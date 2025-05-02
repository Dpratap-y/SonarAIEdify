import { z } from 'zod'

export const openAIConfigSchema = z.object({
  openai: z.object({
    apiKey: z.string().min(1),
    model: z.string(),
  }),
  gemini: z.object({
    apiKey: z.string().min(1),
    model: z.string(),
  }),
})

export type OpenAIConfig = z.infer<typeof openAIConfigSchema>
