import { z } from 'zod'
import {
  openai,
  config,
  APIError,
  handleAPIError,
  validateMessage,
  validateOpenAIResponse,
  extractContentFromResponse,
} from '@/lib/openai'

/**
 * Options for the AI service
 */
export interface AiServiceOptions {
  model?: string
  temperature?: number
  responseFormat?: 'json_object' | 'text'
}

/**
 * Generic response from AI service
 */
export interface AiResponse<T> {
  response: T
  usage: {
    inputTokens: number
    outputTokens: number
    totalTokens: number
  }
  error?: {
    error: string
    code?: string
    status: number
  }
}

/**
 * Core function to generate AI responses with schema validation
 * This is the foundation for all AI interactions in the application
 */
export async function generateAiResponse<T>({
  systemPrompt,
  schemaDescription,
  userPrompt,
  schema,
  options = {},
}: {
  systemPrompt: string
  schemaDescription?: string
  userPrompt: string
  schema: z.ZodType<T>
  options?: AiServiceOptions
}): Promise<AiResponse<T>> {
  try {
    console.log('Generating AI response with options:', {
      model: options.model ?? config.openai.model,
      temperature: options.temperature ?? 0.7,
    })

    const fullSystemPrompt = schemaDescription
      ? `${systemPrompt}\n${schemaDescription}`
      : systemPrompt

    // Create message objects for validation
    const systemMessageForValidation = { role: 'system', content: fullSystemPrompt }
    const userMessageForValidation = { role: 'user', content: userPrompt }

    // Validate message format before sending
    if (
      !validateMessage(systemMessageForValidation) ||
      !validateMessage(userMessageForValidation)
    ) {
      throw new APIError('Invalid message format', 400, 'INVALID_MESSAGE')
    }

    console.log('Calling OpenAI API...')
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: fullSystemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      model: options.model ?? config.openai.model,
      response_format: { type: options.responseFormat ?? 'json_object' },
      temperature: options.temperature ?? 0.7,
    })
    console.log('OpenAI API call completed')

    // Validate the OpenAI response structure
    if (!validateOpenAIResponse(completion)) {
      throw new APIError('Invalid response received from OpenAI', 500, 'INVALID_RESPONSE')
    }

    // Extract content using the utility function
    const responseText = extractContentFromResponse(completion)

    if (!responseText) {
      throw new APIError('No response generated from AI', 500, 'EMPTY_RESPONSE')
    }

    console.log('Parsing and validating response...')

    try {
      // Parse the response text as JSON if it's json_object format
      let jsonResponse
      try {
        // Always attempt to parse as JSON first
        jsonResponse = JSON.parse(responseText)
      } catch (jsonError) {
        // If it can't be parsed as JSON, use the raw text for text format
        if (options.responseFormat === 'text') {
          jsonResponse = responseText
        } else {
          console.error('Failed to parse JSON response:', jsonError)
          console.log('Invalid JSON response:', responseText)
          throw new APIError('Invalid JSON response from AI', 400, 'INVALID_JSON')
        }
      }

      // Validate against schema
      const validatedResponse = schema.parse(jsonResponse)
      console.log('Response validation successful')

      return {
        response: validatedResponse,
        usage: {
          inputTokens: completion.usage?.prompt_tokens ?? 0,
          outputTokens: completion.usage?.completion_tokens ?? 0,
          totalTokens: completion.usage?.total_tokens ?? 0,
        },
      }
    } catch (parseError) {
      console.error('Error parsing response:', parseError)
      console.log('Response text that failed validation:', responseText)

      // Provide more detailed error information
      if (parseError instanceof z.ZodError) {
        throw new APIError(
          `Failed to parse AI response: ${parseError.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ')}`,
          400,
          'VALIDATION_ERROR'
        )
      }

      throw new APIError('Failed to parse AI response', 500, 'PARSE_ERROR')
    }
  } catch (error) {
    console.error('Error in generateAIResponse:', error)

    // Use handleAPIError to generate a consistent error response
    const errorDetails = handleAPIError(error)

    // Return partial response with error information
    return {
      response: {} as T, // Empty response
      usage: {
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
      },
      error: errorDetails,
    }
  }
}
