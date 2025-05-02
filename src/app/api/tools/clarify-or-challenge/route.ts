import { NextResponse } from 'next/server'
import { z } from 'zod'
import { formSchema } from '@/features/tools/clarify-or-challenge/schema'
import { generateAiResponse } from '@/utils/ai-service'
import { getClarifySystemPrompt, getChallengeSystemPrompt } from '@/constants/system-prompt'
import { SCHEMA_DESCRIPTIONS } from '@/constants/schema-descriptions'
import {
  clarifyOutputSchema,
  challengeOutputSchema,
  ClarifyOutput,
  ChallengeOutput,
} from '@/features/tools/clarify-or-challenge/schema/response-schema'

export const maxDuration = 300 // 5 minutes timeout

// Use only the fields we need from the form schema
const apiInputSchema = formSchema.pick({
  mode: true,
  level: true,
  topic: true,
})

export async function POST(req: Request) {
  try {
    // Get the request body
    const body = await req.json()
    console.log('Received request body:', body)

    try {
      // Validate input using the API schema instead of the full form schema
      const validatedInput = apiInputSchema.parse(body)
      console.log('Validated input:', validatedInput)

      // Determine if this is a clarify or challenge request
      const isChallenge = validatedInput.mode === 'challenge'

      // Set up the appropriate system prompt and schema
      const systemPrompt = isChallenge
        ? getChallengeSystemPrompt(validatedInput.level)
        : getClarifySystemPrompt(validatedInput.level)

      const schema = isChallenge ? challengeOutputSchema : clarifyOutputSchema
      const schemaDescription = isChallenge
        ? SCHEMA_DESCRIPTIONS.CHALLENGE
        : SCHEMA_DESCRIPTIONS.CLARIFY

      // Generate the prompt
      const userPrompt = validatedInput.topic

      // Call the AI service
      console.log('Calling AI service...')
      const result = await generateAiResponse<ClarifyOutput | ChallengeOutput>({
        systemPrompt,
        schemaDescription,
        userPrompt,
        schema,
        options: { temperature: 0.7 },
      })
      console.log('AI response generated:', typeof result.response)
      console.log('Full AI response:', JSON.stringify(result.response, null, 2))
      console.log('usage:', result.usage)

      // Check if there's an error from the AI service
      if (result.error) {
        return NextResponse.json(
          {
            error: result.error.error,
            code: result.error.code,
            details: 'AI service error',
          },
          { status: result.error.status || 500 }
        )
      }

      // Here you would save to database, but we're skipping that for now

      return NextResponse.json(
        {
          data: result.response,
          usage: result.usage,
        },
        {
          status: 200,
        }
      )
    } catch (validationError) {
      console.error('Validation error:', validationError)
      // Handle Zod validation errors specifically
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: 'Invalid input data',
            details: validationError.errors,
          },
          {
            status: 400,
          }
        )
      }
      throw validationError // Re-throw if it's not a validation error
    }
  } catch (error) {
    console.error('Error generating response:', error)

    // Create a meaningful error response
    let errorMessage = 'Failed to generate response'
    let errorDetails = null

    if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = error.stack
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
      },
      {
        status: 500,
      }
    )
  }
}
