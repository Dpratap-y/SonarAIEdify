import { z } from 'zod'

// Define the form schema
export const formSchema = z.object({
  mode: z.enum(['clarify', 'challenge'], {
    required_error: 'Please select a mode',
  }),
  level: z.enum(['beginner', 'intermediate', 'advanced'], {
    required_error: 'Please select a difficulty level',
  }),
  topic: z.string().min(5, {
    message: 'Topic must be at least 5 characters',
  }),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the consent statement',
  }),
})

export type FormValues = z.infer<typeof formSchema>
