import { z } from 'zod'

// Define the form schema
export const formSchema = z.object({
  originalPrompt: z.string().min(5, {
    message: 'Original prompt must be at least 5 characters',
  }),
  focusAreas: z.array(z.string()).optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the consent statement',
  }),
})

export type FormValues = z.infer<typeof formSchema>
