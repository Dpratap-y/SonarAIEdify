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

interface SectionAvailability {
  hasAssessmentQuestions: boolean
  hasDifferentiation: boolean
  hasCrossCurricular: boolean
  hasReflection: boolean
  hasAdditionalNotes: boolean
}

/**
 * Extracts the title from the markdown content
 */
function extractTitle(content: string): string {
  const titleMatch = content.match(/^# (.+)$/m)
  return titleMatch?.[1] ?? 'Lesson Plan'
}

/**
 * Extracts option numbers from the markdown content
 */
function extractOptionNumbers(content: string): number[] {
  const optionMatches = content.match(/## Option \d+/g) || []
  return optionMatches.map((match) => {
    const num = match.replace('## Option ', '')
    return parseInt(num, 10)
  })
}

/**
 * Determines which sections are available in the content
 */
function determineSectionAvailability(content: string): SectionAvailability {
  return {
    hasAssessmentQuestions: content.includes('Assessment Questions'),
    hasDifferentiation: content.includes('Differentiation & SEN Support'),
    hasCrossCurricular: content.includes('Cross-Curricular Links'),
    hasReflection: content.includes('Reflection Suggestions'),
    hasAdditionalNotes: content.includes('Additional Notes'),
  }
}

/**
 * Resolves end headers for different sections based on available sections
 */
function resolveEndHeaders(availability: SectionAvailability): {
  assessmentEndHeader: string | null
  differentiationEndHeader: string | null
  crossCurricularEndHeader: string | null
  additionalNotesEndHeader: string | null
} {
  // For assessment section
  let assessmentEndHeader = null
  if (availability.hasDifferentiation) {
    assessmentEndHeader = 'Differentiation & SEN Support'
  } else if (availability.hasCrossCurricular) {
    assessmentEndHeader = 'Cross-Curricular Links'
  } else if (availability.hasAdditionalNotes) {
    assessmentEndHeader = 'Additional Notes'
  } else if (availability.hasReflection) {
    assessmentEndHeader = 'Reflection Suggestions'
  }

  // For differentiation section
  let differentiationEndHeader = null
  if (availability.hasCrossCurricular) {
    differentiationEndHeader = 'Cross-Curricular Links'
  } else if (availability.hasAdditionalNotes) {
    differentiationEndHeader = 'Additional Notes'
  } else if (availability.hasReflection) {
    differentiationEndHeader = 'Reflection Suggestions'
  }

  // For cross-curricular section
  let crossCurricularEndHeader = null
  if (availability.hasAdditionalNotes) {
    crossCurricularEndHeader = 'Additional Notes'
  } else if (availability.hasReflection) {
    crossCurricularEndHeader = 'Reflection Suggestions'
  }

  // For additional notes section
  let additionalNotesEndHeader = null
  if (availability.hasReflection) {
    additionalNotesEndHeader = 'Reflection Suggestions'
  }

  return {
    assessmentEndHeader,
    differentiationEndHeader,
    crossCurricularEndHeader,
    additionalNotesEndHeader,
  }
}

/**
 * Extracts all lesson sections from the content
 */
function extractLessonSections(
  content: string,
  availability: SectionAvailability,
  endHeaders: {
    assessmentEndHeader: string | null
    differentiationEndHeader: string | null
    crossCurricularEndHeader: string | null
    additionalNotesEndHeader: string | null
  }
): LessonSections {
  return {
    overview: extractSection(content, 'Lesson Overview', 'Learning Objectives'),
    objectives: cleanContent(
      extractSection(content, 'Learning Objectives', 'Initial Discussion Prompts')
    ),
    discussionPrompts: cleanContent(
      extractSection(content, 'Initial Discussion Prompts', 'Lesson Options')
    ),
    lessonOptions: extractSection(content, 'Lesson Options', 'Assessment Questions'),
    assessment: availability.hasAssessmentQuestions
      ? extractSection(content, 'Assessment Questions', endHeaders.assessmentEndHeader)
      : '',
    differentiation: availability.hasDifferentiation
      ? extractSection(
          content,
          'Differentiation & SEN Support',
          endHeaders.differentiationEndHeader
        )
      : '',
    crossCurricular: availability.hasCrossCurricular
      ? extractSection(content, 'Cross-Curricular Links', endHeaders.crossCurricularEndHeader)
      : '',
    additionalNotes: availability.hasAdditionalNotes
      ? extractSection(content, 'Additional Notes', endHeaders.additionalNotesEndHeader)
      : '',
    reflection: availability.hasReflection
      ? extractSection(content, 'Reflection Suggestions', null)
      : '',
  }
}

/**
 * Extracts lesson options
 */
function extractLessonOptions(
  content: string,
  optionNumbers: number[],
  lessonOptions: string
): Option[] {
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
  if (options.length === 0 && lessonOptions) {
    options.push({
      number: 1,
      content: lessonOptions,
    })
  }

  return options
}

/**
 * Extracts metadata from lesson overview
 */
function extractMetadata(overview: string, title: string): Metadata {
  return {
    title,
    subject: extractValue(overview, 'Subject:') || '',
    yearGroup: extractValue(overview, 'Year Group:') || '',
    duration: extractValue(overview, 'Duration:') || '',
  }
}

/**
 * Processes additional content sections
 */
function processAdditionalSections(sections: LessonSections): AdditionalContent {
  return {
    differentiationItems: processAdditionalContent(sections.differentiation),
    crossCurricularItems: processCrossCurricular(sections.crossCurricular),
    reflectionItems: processAdditionalContent(sections.reflection),
    additionalNotesItems: processAdditionalContent(sections.additionalNotes),
  }
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

    // Extract title and option numbers
    const title = extractTitle(content)
    const optionNumbers = extractOptionNumbers(content)

    // Determine which sections are available
    const sectionAvailability = determineSectionAvailability(content)

    // Resolve end headers based on section availability
    const endHeaders = resolveEndHeaders(sectionAvailability)

    // Extract all lesson sections
    const sections = extractLessonSections(content, sectionAvailability, endHeaders)

    // Extract lesson options
    const options = extractLessonOptions(content, optionNumbers, sections.lessonOptions)

    // Extract metadata
    const metadata = extractMetadata(sections.overview, title)

    // Process additional content sections
    const additionalContent = processAdditionalSections(sections)

    return {
      metadata,
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
