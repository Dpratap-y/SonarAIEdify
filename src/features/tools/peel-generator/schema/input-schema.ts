import { z } from 'zod'

export const peelGeneratorInputSchema = z.object({
  topic: z.string().min(5, 'Topic is required'),
  subject: z.string().optional(),
  complexity: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  tone: z.string().optional(),
  audience: z.string().optional(),
  wordCountRange: z
    .object({
      min: z.number().min(100),
      max: z.number().max(1000),
    })
    .optional(),
})

export type PEELGeneratorInput = z.infer<typeof peelGeneratorInputSchema>
