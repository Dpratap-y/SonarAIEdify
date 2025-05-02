import { z } from 'zod'

// Clarify Output Schema as Zod schema
export const clarifyOutputSchema = z.object({
  main_argument: z.string(),
  key_concepts: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ),
  critical_details: z.array(z.string()),
  applications_in_practice: z.array(
    z.object({
      example: z.string(),
      description: z.string(),
    })
  ),
})

// Challenge Output Schema as Zod schema - updated to match the actual API response
export const challengeOutputSchema = z.object({
  critical_reflection_questions: z.array(z.string()),
  advanced_concepts: z.array(
    z.object({
      concept: z.string(),
      explanation: z.string(),
    })
  ),
  interdisciplinary_connections: z.array(
    z.object({
      field: z.string(),
      connection: z.string(),
    })
  ),
  counterarguments: z.array(z.string()),
  future_challenges: z.array(z.string()),
})

// Type definitions for TypeScript
export type ClarifyOutput = z.infer<typeof clarifyOutputSchema>
export type ChallengeOutput = z.infer<typeof challengeOutputSchema>
