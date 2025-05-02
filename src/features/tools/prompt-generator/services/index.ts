import { callToolApi } from '@/services/tools/api-service'
import { FormValues } from '../schema/form-schema'
import { PromptGeneratorResponse } from '../schema'

/**
 * Transform the form data into the API input format
 */
function mapFormDataToApiInput(data: FormValues) {
  return {
    originalPrompt: data.originalPrompt,
    focusAreas: data.focusAreas || [], // Provide empty array as default
  }
}

/**
 * Call the API to generate prompt suggestions
 */
export async function generatePromptSuggestions(data: FormValues): Promise<{
  data?: PromptGeneratorResponse
  error?: string
}> {
  try {
    const apiInput = mapFormDataToApiInput(data)
    const result = await callToolApi<PromptGeneratorResponse>('prompt-generator', apiInput)

    return result
  } catch (error) {
    console.error('Error generating prompt suggestions:', error)
    return {
      error:
        error instanceof Error
          ? error.message
          : 'An error occurred while generating the prompt suggestions.',
    }
  }
}
