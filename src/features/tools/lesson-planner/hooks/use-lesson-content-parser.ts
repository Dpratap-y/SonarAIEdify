import { useMemo } from 'react'
import {
  extractSection,
  extractValue,
  cleanContent,
  processCrossCurricular,
} from '../utils/content-extraction'

interface Option {
  number: number
  content: string
}

interface LessonSections {
  overview: string
  objectives: string[]
  discussionPrompts: string[]
  lessonOptions: string
  assessment: string
  differentiation: string
  crossCurricular: string
  reflection: string
  additionalNotes: string
}

interface Metadata {
  title: string
  subject: string
  yearGroup: string
  duration: string
}

interface CrossCurricularItem {
  subject: string
  description: string
}

interface AdditionalContent {
  differentiationItems: string[]
  crossCurricularItems: CrossCurricularItem[]
  reflectionItems: string[]
  additionalNotesItems: string[]
}

interface ParsedLessonContent {
  metadata: Metadata
  sections: LessonSections
  options: Option[]
  additionalContent: AdditionalContent
}

/**
 * Custom hook that parses lesson plan markdown content into structured data
 * @param content The markdown content to parse
 * @returns A structured representation of the lesson plan content
 */
export function useLessonContentParser(content: string): ParsedLessonContent {
  return useMemo(() => {
    // Create default empty state
    const defaultResult: ParsedLessonContent = {
      metadata: {
        title: 'Lesson Plan',
        subject: '',
        yearGroup: '',
        duration: '',
      },
      sections: {
        overview: '',
        objectives: [],
        discussionPrompts: [],
        lessonOptions: '',
        assessment: '',
        differentiation: '',
        crossCurricular: '',
        reflection: '',
        additionalNotes: '',
      },
      options: [],
      additionalContent: {
        differentiationItems: [],
        crossCurricularItems: [],
        reflectionItems: [],
        additionalNotesItems: [],
      },
    }

    // Early return if no content provided
    if (!content || typeof content !== 'string') {
      return defaultResult
    }

    // Memoize regex operations for title and options
    const titleMatch = content.match(/^# (.+)$/m)
    const title = titleMatch?.[1] ?? 'Lesson Plan'

    // Find option sections with a single regex operation
    const optionMatches = content.match(/## Option \d+/g) || []
    const optionNumbers = optionMatches.map((match) => {
      const num = match.replace('## Option ', '')
      return parseInt(num, 10)
    })

    // Check section presence for conditionals
    const hasAssessmentQuestions = content.includes('Assessment Questions')
    const hasDifferentiation = content.includes('Differentiation & SEN Support')
    const hasCrossCurricular = content.includes('Cross-Curricular Links')
    const hasReflection = content.includes('Reflection Suggestions')
    const hasAdditionalNotes = content.includes('Additional Notes')

    // Extract sections from the markdown content with optimized logic
    const sections: LessonSections = {
      overview: extractSection(content, 'Lesson Overview', 'Learning Objectives'),
      objectives: cleanContent(
        extractSection(content, 'Learning Objectives', 'Initial Discussion Prompts')
      ),
      discussionPrompts: cleanContent(
        extractSection(content, 'Initial Discussion Prompts', 'Lesson Options')
      ),
      lessonOptions: extractSection(content, 'Lesson Options', 'Assessment Questions'),
      assessment: hasAssessmentQuestions
        ? extractSection(
            content,
            'Assessment Questions',
            hasDifferentiation
              ? 'Differentiation & SEN Support'
              : hasCrossCurricular
                ? 'Cross-Curricular Links'
                : hasAdditionalNotes
                  ? 'Additional Notes'
                  : hasReflection
                    ? 'Reflection Suggestions'
                    : null
          )
        : '',
      differentiation: hasDifferentiation
        ? extractSection(
            content,
            'Differentiation & SEN Support',
            hasCrossCurricular
              ? 'Cross-Curricular Links'
              : hasAdditionalNotes
                ? 'Additional Notes'
                : hasReflection
                  ? 'Reflection Suggestions'
                  : null
          )
        : '',
      crossCurricular: hasCrossCurricular
        ? extractSection(
            content,
            'Cross-Curricular Links',
            hasAdditionalNotes
              ? 'Additional Notes'
              : hasReflection
                ? 'Reflection Suggestions'
                : null
          )
        : '',
      additionalNotes: hasAdditionalNotes
        ? extractSection(
            content,
            'Additional Notes',
            hasReflection ? 'Reflection Suggestions' : null
          )
        : '',
      reflection: hasReflection ? extractSection(content, 'Reflection Suggestions', null) : '',
    }

    // Extract lesson options with optimized approach
    const options: Option[] = optionNumbers.map((num) => {
      const startSection = `Option ${num}`
      const nextNum = optionNumbers.find((n) => n > num)
      const endSection = nextNum ? `Option ${nextNum}` : 'Assessment Questions'

      return {
        number: num,
        content: extractSection(content, startSection, endSection),
      }
    })

    // Create a default option if none found
    if (options.length === 0 && sections.lessonOptions) {
      options.push({
        number: 1,
        content: sections.lessonOptions,
      })
    }

    // Extract metadata with nullish coalescing for safety
    const subject = extractValue(sections.overview, 'Subject:') || ''
    const yearGroup = extractValue(sections.overview, 'Year Group:') || ''
    const duration = extractValue(sections.overview, 'Duration:') || ''

    // Process additional content with proper type safety
    const additionalContent: AdditionalContent = {
      differentiationItems: processAdditionalContent(sections.differentiation),
      crossCurricularItems: processCrossCurricular(sections.crossCurricular),
      reflectionItems: processAdditionalContent(sections.reflection),
      additionalNotesItems: processAdditionalContent(sections.additionalNotes),
    }

    return {
      metadata: {
        title,
        subject,
        yearGroup,
        duration,
      },
      sections,
      options,
      additionalContent,
    }
  }, [content]) // Only recompute when content changes
}

/**
 * Helper function to process additional content with type safety
 * @param content The content to process
 * @returns An array of cleaned content items
 */
function processAdditionalContent(content: string): string[] {
  if (!content) return []
  return cleanContent(content)
}
