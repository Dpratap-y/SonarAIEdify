import { LessonPlan } from '@/features/tools/lesson-planner/schema/input-schema'
import {
  LessonPlanResponse,
  lessonPlanResponseSchema,
} from '@/features/tools/lesson-planner/schema/response-schema'
import { generateAiResponse, AiServiceOptions, AiResponse } from '../../../../utils/ai-service'
import { SYSTEM_PROMPTS } from '@/constants/system-prompt'
import { SCHEMA_DESCRIPTIONS } from '@/constants/schema-descriptions'
import { generateLessonPlanPrompt } from '@/constants/prompts/lesson-planner'

/**
 * Validates if the total duration of the lesson plan matches the requested duration.
 */
function validateLessonPlanDuration(
  lessonPlan: LessonPlanResponse,
  requestedDuration: number
): boolean {
  // Check each lesson option individually
  for (let i = 0; i < lessonPlan.lessonOptions.length; i++) {
    const option = lessonPlan.lessonOptions[i]
    let optionTotalDuration = 0
    const durations: Array<{ activity: string; duration: number }> = []

    // Add starter duration
    optionTotalDuration += option.starterActivity?.duration ?? 0
    durations.push({
      activity: 'Starter',
      duration: option.starterActivity?.duration ?? 0,
    })

    // Add main activities durations
    option.mainActivities.forEach((activity, index) => {
      optionTotalDuration += activity.duration ?? 0
      durations.push({
        activity: `Main Activity ${index + 1}`,
        duration: activity.duration ?? 0,
      })
    })

    // Add plenary duration
    optionTotalDuration += option.plenary?.duration ?? 0
    durations.push({
      activity: 'Plenary',
      duration: option.plenary?.duration ?? 0,
    })

    // Validate each option matches expected duration
    if (optionTotalDuration !== requestedDuration) {
      console.error(`Duration mismatch in option ${option.optionNumber}:`, {
        expected: requestedDuration,
        actual: optionTotalDuration,
        breakdown: durations,
      })
      return false
    }
  }

  return true
}

/**
 * Creates a lesson plan using the prompt and AI service.
 */
export async function createLessonPlan(
  input: LessonPlan,
  options?: AiServiceOptions
): Promise<{
  response: LessonPlanResponse
  usage: {
    inputTokens: number
    outputTokens: number
    totalTokens: number
  }
  isValidDuration: boolean
  error?: {
    error: string
    code?: string
    status: number
  }
}> {
  console.log('Creating lesson plan...')
  try {
    // Generate the prompt from the input data
    const userPrompt = generateLessonPlanPrompt(input)
    console.log('Generated prompt:', userPrompt)

    // Call the AI service with the prompt and schema
    const systemPrompt = SYSTEM_PROMPTS.LESSON_PLAN
    const schemaDescription = SCHEMA_DESCRIPTIONS.LESSON_PLAN

    const aiResponse: AiResponse<LessonPlanResponse> = await generateAiResponse<LessonPlanResponse>(
      {
        systemPrompt,
        schemaDescription,
        userPrompt,
        schema: lessonPlanResponseSchema,
        options,
      }
    )

    console.log('Generated lesson plan:', aiResponse.response)

    // Validate the duration of the lesson plan
    const isValidDuration = validateLessonPlanDuration(aiResponse.response, input.duration)

    return {
      response: aiResponse.response,
      usage: aiResponse.usage,
      isValidDuration,
      error: aiResponse.error,
    }
  } catch (error) {
    console.error('Error creating lesson plan:', error)
    throw error
  }
}
