import { z } from 'zod'

// Input schema definition for the Prompt Generator API
export const promptGeneratorInputSchema = z.object({
  originalPrompt: z.string().max(500).min(1, 'Original prompt is required'),
  focusAreas: z.array(z.string()).min(1, 'At least one focus area is required'),
})

export type PromptGeneratorInput = z.infer<typeof promptGeneratorInputSchema>
