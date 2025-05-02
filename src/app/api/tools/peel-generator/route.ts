import { NextResponse } from 'next/server'
import { z } from 'zod'
import { peelGeneratorInputSchema } from '@/features/tools/peel-generator/schema'
import { generateAiResponse } from '@/utils/ai-service'
import { SYSTEM_PROMPTS } from '@/constants/system-prompt'
import { SCHEMA_DESCRIPTIONS } from '@/constants/schema-descriptions'
import {
  peelGeneratorResponseSchema,
  PEELGeneratorResponse,
} from '@/features/tools/peel-generator/schema'
import { generatePEELPrompt } from '@/constants/prompts/peel-generator'

export const maxDuration = 300 // 5 minutes timeout

export async function POST(req: Request) {
  try {
    // Get the request body
    const body = await req.json()
    console.log('Received request body:', body)

    try {
      // Validate input using the schema
      const validatedInput = peelGeneratorInputSchema.parse(body)
      console.log('Validated input:', validatedInput)

      // Generate the user prompt from the input data
      const userPrompt = generatePEELPrompt(validatedInput)
      console.log('Generated prompt:', userPrompt)

      // Get the system prompt and schema description
      const systemPrompt = SYSTEM_PROMPTS.PEEL_GENERATOR
      const schemaDescription = SCHEMA_DESCRIPTIONS.PEEL_GENERATOR

      // Call the AI service
      console.log('Calling AI service...')
      const result = await generateAiResponse<PEELGeneratorResponse>({
        systemPrompt,
        schemaDescription,
        userPrompt,
        schema: peelGeneratorResponseSchema,
        options: { temperature: 0.7 },
      })

      console.log('AI response generated:', typeof result.response)
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

      // Return the successful response
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
    console.error('Error generating PEEL paragraph:', error)

    // Create a meaningful error response
    let errorMessage = 'Failed to generate PEEL paragraph'
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
