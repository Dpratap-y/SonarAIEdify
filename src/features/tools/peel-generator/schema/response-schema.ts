import { z } from 'zod'

// Create a helper schema for handling both string and array feedback formats
const feedbackItemSchema = z.union([
  z.string(),
  z.array(z.string()).transform((arr) => arr.join('\n\n')),
])

// Schema for the PEEL content (point, evidence, explanation, link)
const peelContentSchema = z.object({
  point: z.string(),
  evidence: z.string(),
  explanation: z.string(),
  link: z.string(),
  feedback: z.object({
    strengths: feedbackItemSchema,
    improvements: feedbackItemSchema,
  }),
})

// Schema for metadata
const metadataSchema = z.object({
  subject: z.string().optional(),
  complexity: z.string().optional(),
  timestamp: z.string(),
})

// Main response schema
export const peelGeneratorResponseSchema = z.object({
  content: peelContentSchema,
  metadata: metadataSchema,
})

// Export the types
export type PEELGeneratorResponse = z.infer<typeof peelGeneratorResponseSchema>
