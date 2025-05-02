/**
 * Utility functions for extracting and processing content from lesson plan markdown
 */

/**
 * Helper function to escape special characters in string for use in RegExp
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Extracts a section from markdown content between two headings
 */
export function extractSection(
  content: string,
  sectionStart: string,
  sectionEnd: string | null
): string {
  const escapedSectionStart = escapeRegExp(sectionStart)

  // Create patterns that match both cases
  const headingPattern = `## ${escapedSectionStart}|### ${escapedSectionStart}|#### ${escapedSectionStart}`
  const startRegex = new RegExp(headingPattern)

  const startMatch = content.match(startRegex)
  if (!startMatch) {
    // Try with uppercase first letter as fallback
    const capitalizedStart = sectionStart.charAt(0).toUpperCase() + sectionStart.slice(1)
    const escapedCapitalizedStart = escapeRegExp(capitalizedStart)
    const capitalizedPattern = `## ${escapedCapitalizedStart}|### ${escapedCapitalizedStart}|#### ${escapedCapitalizedStart}`
    const capitalizedRegex = new RegExp(capitalizedPattern)

    const capitalizedMatch = content.match(capitalizedRegex)
    if (!capitalizedMatch) return ''

    const startIndex = capitalizedMatch.index
    if (startIndex === undefined) return ''

    let endIndex = content.length
    if (sectionEnd) {
      // Try with the original case first
      const escapedSectionEnd = escapeRegExp(sectionEnd)
      const endPattern = `## ${escapedSectionEnd}|### ${escapedSectionEnd}|#### ${escapedSectionEnd}`
      const endRegex = new RegExp(endPattern)

      const endMatch = content.match(endRegex)
      if (endMatch && endMatch.index !== undefined) {
        endIndex = endMatch.index
      } else {
        // Try with uppercase first letter
        const capitalizedEnd = sectionEnd.charAt(0).toUpperCase() + sectionEnd.slice(1)
        const escapedCapitalizedEnd = escapeRegExp(capitalizedEnd)
        const capitalizedEndPattern = `## ${escapedCapitalizedEnd}|### ${escapedCapitalizedEnd}|#### ${escapedCapitalizedEnd}`
        const capitalizedEndRegex = new RegExp(capitalizedEndPattern)

        const capitalizedEndMatch = content.match(capitalizedEndRegex)
        if (capitalizedEndMatch && capitalizedEndMatch.index !== undefined) {
          endIndex = capitalizedEndMatch.index
        }
      }
    }

    return content.substring(startIndex, endIndex).trim()
  }

  const startIndex = startMatch.index
  if (startIndex === undefined) return ''

  let endIndex = content.length
  if (sectionEnd) {
    const escapedSectionEnd = escapeRegExp(sectionEnd)
    const endPattern = `## ${escapedSectionEnd}|### ${escapedSectionEnd}|#### ${escapedSectionEnd}`
    const endRegex = new RegExp(endPattern)

    const endMatch = content.match(endRegex)
    if (endMatch && endMatch.index !== undefined) {
      endIndex = endMatch.index
    }
  }

  return content.substring(startIndex, endIndex).trim()
}

/**
 * Extracts a value from markdown content using a key pattern
 */
export function extractValue(content: string, key: string): string {
  const regex = new RegExp(`\\*\\*${key}\\*\\*\\s+(.+)`, 'i')
  const match = content.match(regex)
  return match ? match[1].trim() : ''
}

/**
 * Cleans markdown content and splits into list items
 */
export function cleanContent(content: string): string[] {
  if (!content) return []

  // Remove headings
  let cleaned = content.replace(/^(#+\s*.*?\s*\n|\*\*.*?\*\*\s*\n)/gm, '')
  // Remove HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, '')
  // Split by newlines and filter empty lines
  return cleaned
    .split('\n')
    .map((line) => {
      // Trim whitespace
      let trimmed = line.trim()
      // Skip empty lines and header markers
      if (!trimmed || trimmed.match(/^#+$|^#{3,}$/)) {
        return ''
      }

      // Remove bullet points and dashes at the beginning of lines
      trimmed = trimmed.replace(/^[-•*]\s+/, '')

      // Remove markdown asterisks
      trimmed = trimmed.replace(/\*{1,}/g, '')

      // Clean numbered list items (e.g., "1. ", "2. ")
      trimmed = trimmed.replace(/^\d+\.\s+/, '')

      return trimmed
    })
    .filter((line) => line.length > 0)
}

/**
 * Processes cross-curricular links from markdown content
 */
export function processCrossCurricular(
  content: string
): { subject: string; description: string }[] {
  if (!content) return []

  // Clean the content first
  const cleanedContent = content.replace(/^(#+\s*)?Cross-Curricular Links\s*\n/i, '')
  const lines = cleanedContent
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line)

  const subjects: { subject: string; description: string }[] = []
  let currentSubject = ''
  let currentDescription = ''

  lines.forEach((line) => {
    // Remove hash symbols, asterisks, and dashes at the beginning
    line = line
      .replace(/^#+$|^#{3,}$/g, '') // Remove hash symbols
      .replace(/\*{1,}/g, '') // Remove all asterisks
      .replace(/^[-*•]\s+/, '') // Remove bullet points
      .trim()

    if (!line) return

    // Special case for lines with subject identifiers
    // E.g., "- **English**:" or "English:" or "**English**:" or just "English"
    const subjectMatch = line.match(/^(?:-\s*)?(?:\*\*)?([A-Za-z]+)(?:\*\*)?:?\s*(.*)/)

    if (subjectMatch) {
      const subject = subjectMatch[1].trim()
      const description = subjectMatch[2] ? subjectMatch[2].trim() : ''

      // If we have a subject/description in progress, save it
      if (currentSubject && (currentDescription || description)) {
        subjects.push({
          subject: currentSubject,
          description: currentDescription,
        })
      }

      currentSubject = subject
      currentDescription = description
    } else {
      // This is a continuation of the description
      if (currentSubject) {
        currentDescription += ' ' + line
      }
    }
  })

  // Add the last subject if there is one
  if (currentSubject && currentDescription) {
    subjects.push({
      subject: currentSubject,
      description: currentDescription,
    })
  }

  return subjects
}

/**
 * Processes differentiation sections that cleans the text properly
 */
export function processDifferentiationContent(
  items: string[]
): { type: string; content: string[] }[] {
  const result: { type: string; content: string[] }[] = []
  let currentType = 'default'
  let currentContent: string[] = []

  items.forEach((item) => {
    let cleanedItem = item.replace(/^[-•*]\s+/, '') // Remove bullet points

    // Handle "Support" keyword with or without asterisks
    if (
      cleanedItem.includes('Support:') ||
      cleanedItem.toLowerCase().includes('support') ||
      cleanedItem.match(/^support$/i)
    ) {
      if (currentContent.length > 0) {
        result.push({ type: currentType, content: currentContent })
        currentContent = []
      }
      currentType = 'support'
      cleanedItem = cleanedItem.replace(/Support:|\*+\s*-?\s*Support:?|\*+/g, '').trim()
      if (cleanedItem) {
        currentContent.push(cleanedItem)
      }
    }
    // Handle "Core" keyword with or without asterisks
    else if (
      cleanedItem.includes('Core:') ||
      cleanedItem.toLowerCase().includes('core') ||
      cleanedItem.match(/^core$/i)
    ) {
      if (currentContent.length > 0) {
        result.push({ type: currentType, content: currentContent })
        currentContent = []
      }
      currentType = 'core'
      cleanedItem = cleanedItem.replace(/Core:|\*+\s*-?\s*Core:?|\*+/g, '').trim()
      if (cleanedItem) {
        currentContent.push(cleanedItem)
      }
    }
    // Handle "Extension" keyword with or without asterisks
    else if (
      cleanedItem.includes('Extension:') ||
      cleanedItem.toLowerCase().includes('extension') ||
      cleanedItem.match(/^extension$/i)
    ) {
      if (currentContent.length > 0) {
        result.push({ type: currentType, content: currentContent })
        currentContent = []
      }
      currentType = 'extension'
      cleanedItem = cleanedItem.replace(/Extension:|\*+\s*-?\s*Extension:?|\*+/g, '').trim()
      if (cleanedItem) {
        currentContent.push(cleanedItem)
      }
    } else {
      // For content items, don't remove any leading dash
      currentContent.push(cleanedItem.trim())
    }
  })

  if (currentContent.length > 0) {
    result.push({ type: currentType, content: currentContent })
  }

  return result
}
