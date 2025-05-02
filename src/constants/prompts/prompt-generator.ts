import { PromptGeneratorInput } from '@/features/tools/prompt-generator/schema'

/**
 * Generate a system prompt for the prompt generator
 */
export const PROMPT_GENERATOR_SYSTEM_PROMPT = `You are a critical thinking prompt generator for educators. 
Generate exactly 5 refined versions of the input prompt that encourage deeper thinking.
Consider the provided grade level, subject, and skill level in your response.
Your response must match this exact JSON structure:
{
  "refinedPrompts": [
    {
      "promptText": "The actual prompt text",
      "explanation": {
        "explanation": "Detailed explanation of the prompt's purpose",
        "complexityLevel": {
          "refinedLevel": "One of ['Foundational', 'Intermediate', 'Advanced', 'Expert', 'Master']",
          "bloomsLevel": "One of ['Remember', 'Understand', 'Apply', 'Analyse', 'Evaluate', 'Create']"
        },
        "focusAreas": ["Array", "of", "specific", "learning", "focus", "areas"]
      }
    }
  ]
}
Use UK english only and do not use convoluted language.`

/**
 * Generate a user prompt for the prompt generator
 */
export const generatePromptGeneratorPrompt = (input: PromptGeneratorInput): string => {
  return `Create 5 refined versions of this educational prompt that encourage deeper critical thinking.

Original Prompt: ${input.originalPrompt}

Focus Areas: ${input.focusAreas.join(', ')}

Requirements:
1. Each refined prompt should be clear, concise, and academically rigorous
2. Vary the complexity across different Bloom's taxonomy levels
3. Each prompt should include a detailed explanation of its purpose and intended learning outcomes
4. Ensure prompts encourage critical thinking appropriate for classroom discussion
5. Make sure each prompt focuses on the requested areas: ${input.focusAreas.join(', ')}

Please provide 5 distinct versions that vary in approach and complexity.`
}
