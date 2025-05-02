import { z } from 'zod'

// Response schema type definition (based on the schema description)
export const lessonPlanResponseSchema = z.object({
  overview: z.object({
    subject: z.string(),
    topic: z.string(),
    yearGroup: z.string(),
    duration: z.number().max(60),
    learningObjectives: z.array(z.string()).min(3).max(4),
    initialPrompts: z.array(z.string()).min(3).max(4),
  }),
  lessonOptions: z
    .array(
      z.object({
        optionNumber: z.number(),
        starterActivity: z.object({
          description: z.string(),
          duration: z.number(),
          materials: z.array(z.string()),
          instructions: z.array(z.string()),
        }),
        mainActivities: z.array(
          z.object({
            description: z.string(),
            duration: z.number(),
            materials: z.array(z.string()),
            instructions: z.array(z.string()),
            differentiation: z
              .object({
                support: z.array(z.string()).optional(),
                core: z.array(z.string()).optional(),
                extension: z.array(z.string()).optional(),
              })
              .optional(),
          })
        ),
        plenary: z.object({
          description: z.string(),
          duration: z.number(),
          instructions: z.array(z.string()),
          successIndicators: z.array(z.string()),
        }),
      })
    )
    .length(3),
  reflectionSuggestions: z.array(z.string()),
  differentiationAndSEN: z.object({
    differentiation: z
      .object({
        support: z.array(z.string()).optional(),
        core: z.array(z.string()).optional(),
        extension: z.array(z.string()).optional(),
      })
      .optional(),
    senSupport: z
      .object({
        visual: z.array(z.string()).optional(),
        auditory: z.array(z.string()).optional(),
        cognitive: z.array(z.string()).optional(),
      })
      .optional(),
  }),
  crossCurricularLinks: z.array(z.string()).min(3),
  assessmentQuestions: z.object({
    knowledge: z.array(z.string()),
    comprehension: z.array(z.string()),
    application: z.array(z.string()),
    analysis: z.array(z.string()),
    synthesis: z.array(z.string()),
    evaluation: z.array(z.string()),
  }),
  additionalNotes: z.array(z.string()),
})

export type LessonPlanResponse = z.infer<typeof lessonPlanResponseSchema>
