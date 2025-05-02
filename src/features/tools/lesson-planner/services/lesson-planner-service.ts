import { type FormValues } from '../schema/form-schema'
import { type LessonPlanResponse } from '../schema'
import { callToolApi } from '@/services/tools/api-service'
import { generateMarkdown } from './markdown-service'
import type { MarkdownOptions } from '../utils/markdown'

function formatYearGroup(yearGroup: string): string {
  // If it's lowercase "year X", convert to "Year X"
  if (/^year\s+\d+$/i.test(yearGroup)) {
    return yearGroup.replace(/^year\s+(\d+)$/i, 'Year $1')
  }
  return yearGroup
}

function mapFormDataToLessonPlanInput(data: FormValues) {
  const yearGroup = formatYearGroup(data.yearGroup)

  return {
    topic: data.lessonTopic,
    yearGroup: yearGroup,
    duration: data.duration,
    objectives: data.learningObjectives
      .split(/[\n,]+/)
      .map((obj) => obj.trim())
      .filter((obj) => obj.length > 0),
    activities: [
      {
        type: 'discussion' as const,
        description: 'Main lesson activity',
        duration: Math.round(data.duration * 0.6),
        materials: ['Textbook', 'Worksheets', 'Digital resources'],
        differentiation: data.enableDifferentiation
          ? {
              dyslexia: data.senConsiderations?.includes('dyslexia') || false,
              adhd: data.senConsiderations?.includes('adhd') || false,
              asd: data.senConsiderations?.includes('autism') || false,
              visualImpairment: data.senConsiderations?.includes('visual') || false,
              hearingImpairment: data.senConsiderations?.includes('hearing') || false,
            }
          : undefined,
      },
    ],
    assessmentQuestions: [
      {
        level: 'knowledge' as const,
        question: 'What are the key concepts of this lesson?',
      },
    ],
    crossCurricularLinks: [
      {
        subject: 'Other' as const,
        description: 'Cross-curricular connections',
      },
    ],
  }
}

export async function generateLessonPlan(
  data: FormValues,
  markdownOptions?: MarkdownOptions
): Promise<{
  markdown: string
  error?: string
}> {
  try {
    const lessonPlanInput = mapFormDataToLessonPlanInput(data)
    const { data: lessonPlan, error } = await callToolApi<LessonPlanResponse>(
      'lesson-planner',
      lessonPlanInput
    )

    if (error || !lessonPlan) {
      return {
        markdown: '',
        error: error || 'Failed to generate lesson plan',
      }
    }

    const markdown = generateMarkdown(lessonPlan, data, markdownOptions)
    return { markdown }
  } catch (error) {
    console.error('Error generating lesson plan:', error)
    return {
      markdown: '',
      error:
        error instanceof Error
          ? error.message
          : 'An error occurred while generating the lesson plan.',
    }
  }
}
