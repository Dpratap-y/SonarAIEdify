import { z } from 'zod'

// Schema for the PEEL content (point, evidence, explanation, link)
const peelContentSchema = z.object({
  point: z.string(),
  evidence: z.string(),
  explanation: z.string(),
  link: z.string(),
  feedback: z.object({
    // Allow both string and array formats for feedback
    strengths: z.union([z.string(), z.array(z.string()).transform((arr) => arr.join('\n\n'))]),
    improvements: z.union([z.string(), z.array(z.string()).transform((arr) => arr.join('\n\n'))]),
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
