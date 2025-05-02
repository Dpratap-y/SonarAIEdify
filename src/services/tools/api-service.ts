interface ApiError {
  error?: string
  details?: unknown
  message?: string
}

export async function callToolApi<T>(
  toolPath: string,
  data: unknown
): Promise<{ data?: T; error?: string }> {
  try {
    const response = await fetch(`/api/tools/${toolPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const text = await response.text()
      let errorData: ApiError = {}
      try {
        if (text) errorData = JSON.parse(text)
      } catch {
        console.log('Error response is not valid JSON')
      }

      if (Object.keys(errorData).length === 0) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      if (errorData.details && Array.isArray(errorData.details)) {
        const errorMessages = errorData.details
          .map(
            (err: { path?: string[]; message?: string }) =>
              `${err.path?.join('.') || ''} - ${err.message || ''}`
          )
          .join('\n')
        throw new Error(`Validation errors:\n${errorMessages}`)
      }

      throw new Error(errorData.error || 'Failed to generate response')
    }

    const responseData = await response.json()
    if (!responseData.data) {
      throw new Error('Invalid response format from API')
    }

    return { data: responseData.data as T }
  } catch (error) {
    console.error('Error calling tool API:', error)
    return {
      error:
        error instanceof Error ? error.message : 'An error occurred while generating the response.',
    }
  }
}
