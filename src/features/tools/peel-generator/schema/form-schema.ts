import { z } from 'zod'

// Define the form schema
export const formSchema = z
  .object({
    topic: z.string().min(3, {
      message: 'Topic must be at least 3 characters',
    }),
    subjectArea: z.string().min(2, {
      message: 'Subject area must be at least 2 characters',
    }),
    complexityLevel: z.enum(['beginner', 'intermediate', 'advanced'], {
      required_error: 'Please select a complexity level',
    }),
    tone: z.enum(['formal', 'academic', 'explanatory'], {
      required_error: 'Please select a tone',
    }),
    targetAudience: z.enum(['key-stage-3', 'gcse', 'a-level'], {
      required_error: 'Please select a target audience',
    }),
    minWordCount: z.coerce
      .number()
      .min(50, { message: 'Minimum word count must be at least 50' })
      .max(500, { message: 'Minimum word count must be at most 500' }),
    maxWordCount: z.coerce
      .number()
      .min(100, { message: 'Maximum word count must be at least 100' })
      .max(1000, { message: 'Maximum word count must be at most 1000' }),
    consent: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the consent statement',
    }),
  })
  .refine((data) => data.maxWordCount > data.minWordCount, {
    message: 'Maximum word count must be greater than minimum word count',
    path: ['maxWordCount'],
  })

export type FormValues = z.infer<typeof formSchema>
