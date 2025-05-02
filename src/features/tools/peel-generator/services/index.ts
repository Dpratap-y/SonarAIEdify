import { callToolApi } from '@/services/tools/api-service'
import { FormValues } from '../schema/form-schema'
import { PEELGeneratorResponse } from '../schema'

/**
 * Transform the form data into the API input format
 */
function mapFormDataToApiInput(data: FormValues) {
  return {
    topic: data.topic,
    subject: data.subjectArea,
    complexity: data.complexityLevel,
    tone: data.tone,
    audience: data.targetAudience,
    wordCountRange: {
      min: data.minWordCount,
      max: data.maxWordCount,
    },
  }
}

/**
 * Call the API to generate PEEL paragraph
 */
export async function generatePEELParagraph(data: FormValues): Promise<{
  data?: PEELGeneratorResponse
  error?: string
}> {
  try {
    const apiInput = mapFormDataToApiInput(data)
    const result = await callToolApi<PEELGeneratorResponse>('peel-generator', apiInput)

    return result
  } catch (error) {
    console.error('Error generating PEEL paragraph:', error)
    return {
      error:
        error instanceof Error
          ? error.message
          : 'An error occurred while generating the PEEL paragraph.',
    }
  }
}
