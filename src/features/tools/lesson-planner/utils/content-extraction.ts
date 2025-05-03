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
 * Creates a regex pattern for heading match with multiple heading levels
 */
function createHeadingPattern(text: string): string {
  const escaped = escapeRegExp(text)
  return `## ${escaped}|### ${escaped}|#### ${escaped}`
}

/**
 * Finds the index of a section heading in content
 */
function findHeadingIndex(content: string, heading: string, tryCapitalized = true): number | null {
  // Try with original case
  const pattern = createHeadingPattern(heading)
  const regex = new RegExp(pattern)
  const match = regex.exec(content)

  if (match?.index !== undefined) {
    return match.index
  }

  // Try with capitalized first letter if requested
  if (tryCapitalized) {
    const capitalized = heading.charAt(0).toUpperCase() + heading.slice(1)
    const capitalizedPattern = createHeadingPattern(capitalized)
    const capitalizedRegex = new RegExp(capitalizedPattern)
    const capitalizedMatch = capitalizedRegex.exec(content)

    if (capitalizedMatch?.index !== undefined) {
      return capitalizedMatch.index
    }
  }

  return null
}

/**
 * Extracts a section from markdown content between two headings
 */
export function extractSection(
  content: string,
  sectionStart: string,
  sectionEnd: string | null
): string {
  // Find start index
  const startIndex = findHeadingIndex(content, sectionStart)
  if (startIndex === null) {
    return ''
  }

  // Default end index is end of content
  let endIndex = content.length

  // Find end index if sectionEnd is provided
  if (sectionEnd) {
    const endHeadingIndex = findHeadingIndex(content, sectionEnd)
    if (endHeadingIndex !== null) {
      endIndex = endHeadingIndex
    }
  }

  return content.substring(startIndex, endIndex).trim()
}

/**
 * Extracts a value from markdown content using a key pattern
 */
export function extractValue(content: string, key: string): string {
  const regex = new RegExp(`\\*\\*${key}\\*\\*\\s+([^\\n]+)`, 'i')
  const match = regex.exec(content)
  return match?.[1]?.trim() ?? ''
}

/**
 * Cleans markdown content and splits into list items
 */
export function cleanContent(content: string): string[] {
  if (!content) return []

  // Remove headings - Fixed ReDoS vulnerability by using a more specific pattern
  // Avoid using nested quantifiers with optional character classes
  let cleaned = content.replace(/^(#{1,6}\s+[^\n]{0,500}\n|\*\*[^\n]{0,500}\*\*\s*\n)/gm, '')

  // Remove HTML tags - Fixed ReDoS vulnerability by using a more conservative approach
  // Avoid using greedy .* pattern within brackets
  cleaned = cleaned.replace(/<[^>]{0,1000}>/g, '')

  // Split by newlines and filter empty lines
  return cleaned
    .split('\n')
    .map((line) => {
      // Trim whitespace
      let trimmed = line.trim()
      // Skip empty lines and header markers
      if (!trimmed || new RegExp('^#{1,6}$').test(trimmed)) {
        return ''
      }

      // Remove bullet points and dashes at the beginning of lines
      trimmed = trimmed.replace(/^[-•*]\s+/, '')

      // Remove markdown asterisks - Avoid unbounded repetition
      trimmed = trimmed.replace(/\*{1,2}/g, '')

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
  const cleanedContent = content.replace(/^(#{1,6}\s*)?Cross-Curricular Links\s*\n/i, '')
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
      .replace(/^#{1,6}$/g, '') // Remove hash symbols - Bound the repetition
      .replace(/\*{1,2}/g, '') // Remove asterisks - Bound the repetition
      .replace(/^[-*•]\s+/, '') // Remove bullet points
      .trim()

    if (!line) return

    // Special case for lines with subject identifiers
    // E.g., "- **English**:" or "English:" or "**English**:" or just "English"
    const regex = new RegExp(/^(?:-\s*)?(?:\*\*)?([A-Za-z]{1,30})(?:\*\*)?:?\s*(.*)/)
    const subjectMatch = regex.exec(line)

    if (subjectMatch) {
      const subject = subjectMatch[1]?.trim() ?? ''
      const description = subjectMatch[2]?.trim() ?? ''

      // If we have a subject/description in progress, save it
      if (currentSubject && (currentDescription || description)) {
        subjects.push({
          subject: currentSubject,
          description: currentDescription,
        })
      }

      currentSubject = subject
      currentDescription = description
    } else if (currentSubject) {
      // This is a continuation of the description
      currentDescription += ' ' + line
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
 * Processes differentiation categories from a content item
 */
function processDifferentiationCategory(
  item: string,
  categoryName: string
): { isCategory: boolean; cleanedItem: string } {
  const lowerCategoryName = categoryName.toLowerCase()
  const lowerItem = item.toLowerCase()

  const isCategory =
    item.includes(`${categoryName}:`) ||
    lowerItem.includes(lowerCategoryName) ||
    new RegExp(`^${lowerCategoryName}$`, 'i').test(lowerItem)

  if (!isCategory) {
    return { isCategory: false, cleanedItem: item }
  }

  // Clean the item text of category markers
  const cleanedItem = item
    .replace(new RegExp(`${categoryName}:`, 'g'), '')
    .replace(/\*+/g, '')
    .replace(new RegExp(`-\\s*${categoryName}`, 'g'), '')
    .replace(new RegExp(categoryName, 'g'), '')
    .trim()

  return { isCategory: true, cleanedItem }
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
    // Remove bullet points
    let cleanedItem = item.replace(/^[-•*]\s+/, '')

    // Process each category
    const categories = [
      { name: 'Support', type: 'support' },
      { name: 'Core', type: 'core' },
      { name: 'Extension', type: 'extension' },
    ]

    let categoryDetected = false

    for (const category of categories) {
      const { isCategory, cleanedItem: newItem } = processDifferentiationCategory(
        cleanedItem,
        category.name
      )

      if (isCategory) {
        // Add current content to results before changing type
        if (currentContent.length > 0) {
          result.push({ type: currentType, content: currentContent })
          currentContent = []
        }

        currentType = category.type
        cleanedItem = newItem
        categoryDetected = true

        // Only add non-empty items
        if (cleanedItem) {
          currentContent.push(cleanedItem)
        }

        break
      }
    }

    // For non-category items, just add to current content
    if (!categoryDetected) {
      currentContent.push(cleanedItem.trim())
    }
  })

  // Add the last batch of content
  if (currentContent.length > 0) {
    result.push({ type: currentType, content: currentContent })
  }

  return result
}
