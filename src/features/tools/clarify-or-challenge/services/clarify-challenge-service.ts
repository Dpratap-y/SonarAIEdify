import { type FormValues } from '../schema/form-schema'
import { type ClarifyOutput, type ChallengeOutput } from '../schema'
import { callToolApi } from '@/services/tools/api-service'
import {
  getClarifySystemPrompt,
  getChallengeSystemPrompt,
  getAudiencePrompt,
} from '@/constants/system-prompt'

// Map form data to the API request format
function mapFormDataToApiInput(data: FormValues) {
  // Get the appropriate system prompt based on mode and level
  const systemPrompt =
    data.mode === 'clarify'
      ? getClarifySystemPrompt(data.level)
      : getChallengeSystemPrompt(data.level)

  // Include audience-specific guidance
  const audiencePrompt = getAudiencePrompt(data.level)

  return {
    mode: data.mode,
    level: data.level,
    topic: data.topic,
    systemPrompt, // Include the system prompt
    audiencePrompt, // Include the audience prompt
  }
}

// Main API call function
export async function generateClarifyOrChallenge(data: FormValues): Promise<{
  data?: ClarifyOutput | ChallengeOutput
  error?: string
  type?: string
}> {
  try {
    const apiInput = mapFormDataToApiInput(data)
    console.log('Sending API request with input:', apiInput)

    // Call the API endpoint - the endpoint should match what's defined in your API routes
    const { data: responseData, error } = await callToolApi<ClarifyOutput | ChallengeOutput>(
      'clarify-or-challenge',
      apiInput
    )

    if (error || !responseData) {
      console.error('API error:', error)
      return {
        error: error || 'Failed to generate response',
      }
    }

    console.log('API response received, type:', data.mode)
    console.log('Response has main_argument:', 'main_argument' in responseData)
    console.log(
      'Response has critical_reflection_questions:',
      'critical_reflection_questions' in responseData
    )

    return {
      data: responseData,
      type: data.mode,
    }
  } catch (error) {
    console.error('Error generating clarify or challenge response:', error)
    return {
      error:
        error instanceof Error ? error.message : 'An error occurred while generating the response.',
    }
  }
}
