import { z } from 'zod'

export const formSchema = z.object({
  lessonTopic: z.string().min(5, {
    message: 'Lesson topic must be at least 5 characters',
  }),
  subject: z.string().min(2, {
    message: 'Subject must be at least 2 characters',
  }),
  learningObjectives: z.string().min(5, {
    message: 'Learning objectives must be at least 5 characters',
  }),
  yearGroup: z.string({
    required_error: 'Please select a year group',
  }),
  duration: z.coerce
    .number()
    .min(5, { message: 'Duration must be at least 5 minutes' })
    .max(60, { message: 'Duration must be at most 60 minutes' }),
  enableDifferentiation: z.boolean().default(false),
  differentiation: z.array(z.string()).optional(),
  enableSEN: z.boolean().default(false),
  senConsiderations: z.array(z.string()).optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the consent statement',
  }),
})

export type FormValues = z.infer<typeof formSchema>
