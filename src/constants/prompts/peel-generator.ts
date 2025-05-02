import { PEELGeneratorInput } from '@/features/tools/peel-generator/schema'

/**
 * Generate a system prompt for the PEEL generator
 */
export const PEEL_GENERATOR_SYSTEM_PROMPT = `Use UK English only and avoid convoluted language.
You are an expert writing tutor who generates well-structured PEEL paragraphs for educational purposes.
Each PEEL paragraph consists of Point, Evidence, Explanation, and Link components.
When responding, provide thoughtful feedback on strengths and areas for improvement.
You MUST use proper markdown formatting (bold, italic, lists, headings) in your response.
Your response must be in valid JSON format matching the required schema exactly.`

/**
 * Generate a user prompt for the PEEL generator based on input
 */
export const generatePEELPrompt = (input: PEELGeneratorInput): string => {
  const wordCountRange = input.wordCountRange
    ? `The paragraph must strictly adhere to a word count between ${input.wordCountRange.min} and ${input.wordCountRange.max} words. This is a critical requirement.`
    : 'The paragraph should be approximately 300-400 words in length.'

  return `Generate a well-structured PEEL paragraph about the following topic: ${input.topic}.
${wordCountRange}
${input.subject ? `Subject area: ${input.subject}` : ''}
${input.complexity ? `Complexity level: ${input.complexity}` : ''}
${input.tone ? `Tone: ${input.tone}` : ''}
${input.audience ? `Target audience: ${input.audience}` : ''}

Format your response using PROPER MARKDOWN for all content fields. This is essential for correct display:
- Use **bold text** for important concepts and key terms
- Use *italic text* for emphasis 
- Use ## headings for section titles (if needed)
- Use proper bullet lists with - or * for listing items
- Use line breaks for structural clarity
- Ensure correct markdown syntax throughout

Return a JSON object with these exact keys:
{
  "content": {
    "point": "A clear statement of the main idea or argument using proper markdown",
    "evidence": "Specific examples, data, or quotes that support the point using proper markdown",
    "explanation": "Analysis of how the evidence supports the point using proper markdown",
    "link": "A connection back to the main argument or transition using proper markdown",
    "feedback": {
      "strengths": "List of strengths using proper markdown bullet points OR an array of strings",
      "improvements": "List of areas for improvement using proper markdown bullet points OR an array of strings"
    }
  },
  "metadata": {
    "subject": "${input.subject || ''}",
    "complexity": "${input.complexity || ''}",
    "timestamp": "${new Date().toISOString()}"
  }
}

For the feedback section, you can provide either:
1. A single markdown-formatted string with bullet points, OR
2. An array of string items ["First point", "Second point", "Third point"]

Count words carefully in your response before returning it. A word is defined as any sequence of characters separated by spaces.`
}
