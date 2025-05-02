import { messageSchema, Message, openAIResponseSchema, OpenAIResponse } from '@/schema/openai'

/**
 * Validates a message according to the OpenAI message schema
 */
export function validateMessage(message: unknown): boolean {
  try {
    messageSchema.parse(message) as Message
    return true
  } catch (error) {
    console.error('Invalid message format:', error)
    return false
  }
}

/**
 * Validates a response according to the OpenAI response schema
 */
export function validateOpenAIResponse(response: unknown): boolean {
  try {
    openAIResponseSchema.parse(response) as OpenAIResponse
    return true
  } catch (error) {
    console.error('Invalid OpenAI response format:', error)
    return false
  }
}

/**
 * Utility function to extract content from a validated OpenAI response
 */
export function extractContentFromResponse(response: unknown): string | null {
  try {
    const validatedResponse = openAIResponseSchema.parse(response) as OpenAIResponse
    return validatedResponse.choices[0]?.message?.content || null
  } catch (error) {
    console.error('Failed to extract content from response:', error)
    return null
  }
}
