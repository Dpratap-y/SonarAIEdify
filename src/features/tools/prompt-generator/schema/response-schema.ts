import { z } from 'zod'

// Internal schemas only used to build the response schema
const complexityLevelSchema = z.object({
  refinedLevel: z.enum(['Foundational', 'Intermediate', 'Advanced', 'Expert', 'Master']),
  bloomsLevel: z.enum(['Remember', 'Understand', 'Apply', 'Analyse', 'Evaluate', 'Create']),
})

const promptExplanationSchema = z.object({
  explanation: z.string(),
  complexityLevel: complexityLevelSchema,
  focusAreas: z.array(z.string()),
})

const ratingsSchema = z.object({
  averageRating: z.number().optional(),
  totalRatings: z.number().optional(),
})

const refinedPromptSchema = z.object({
  promptText: z.string(),
  explanation: promptExplanationSchema,
  ratings: ratingsSchema.optional(),
})

const metadataSchema = z.object({
  processingTimeMs: z.number(),
  version: z.string(),
  model: z.string(),
})

export const promptGeneratorResponseSchema = z.union([
  z.object({
    data: z.object({
      originalPrompt: z.string(),
      refinedPrompts: z.array(refinedPromptSchema).min(3).max(5),
      metadata: metadataSchema,
    }),
  }),
  z.object({
    refinedPrompts: z.array(refinedPromptSchema).min(3).max(5),
  }),
])

export type RefinedPrompt = z.infer<typeof refinedPromptSchema>
export type PromptGeneratorResponse = z.infer<typeof promptGeneratorResponseSchema>
