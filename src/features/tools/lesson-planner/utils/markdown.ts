// Types for markdown customization
export interface MarkdownOptions {
  showTimestamps?: boolean
  showMaterials?: boolean
  showDifferentiation?: boolean
  showSuccessIndicators?: boolean
  showCrossCurricular?: boolean
  showReflection?: boolean
  showAssessment?: boolean
  customStyles?: {
    learningObjective?: string
    activity?: string
    materials?: string
    differentiation?: string
    note?: string
  }
}

// Default options
const defaultOptions: MarkdownOptions = {
  showTimestamps: true,
  showMaterials: true,
  showDifferentiation: true,
  showSuccessIndicators: true,
  showCrossCurricular: true,
  showReflection: true,
  showAssessment: true,
  customStyles: {
    learningObjective: 'learning-objective',
    activity: 'activity',
    materials: 'materials',
    differentiation: 'differentiation',
    note: 'note',
  },
}

// Helper functions
export function formatHeading(text: string, level: number): string {
  return `${'#'.repeat(level)} ${text}`
}

export function formatList(items: string[]): string {
  return items.map((item) => `- ${item}`).join('\n')
}

export function formatNumberedList(items: string[]): string {
  return items.map((item, index) => `${index + 1}. ${item}`).join('\n')
}

export function formatTable(headers: string[], rows: string[][]): string {
  const headerRow = `| ${headers.join(' | ')} |`
  const separator = `| ${headers.map(() => '---').join(' | ')} |`
  const dataRows = rows.map((row) => `| ${row.join(' | ')} |`).join('\n')
  return `${headerRow}\n${separator}\n${dataRows}`
}

// Main formatting functions
export function formatLearningObjective(
  content: string,
  options: MarkdownOptions = defaultOptions
): string {
  const className =
    options.customStyles?.learningObjective || defaultOptions.customStyles?.learningObjective
  return `<div class="${className}">${content}</div>`
}

export function formatActivity(content: string, options: MarkdownOptions = defaultOptions): string {
  const className = options.customStyles?.activity || defaultOptions.customStyles?.activity
  return `<div class="${className}">${content}</div>`
}

export function formatMaterials(
  materials: string[],
  options: MarkdownOptions = defaultOptions
): string {
  if (!options.showMaterials) return ''
  const className = options.customStyles?.materials || defaultOptions.customStyles?.materials
  const materialsList = materials.map((m) => `- ${m}`).join('\n')
  return `<div class="${className}">\n${materialsList}\n</div>`
}

export function formatDifferentiation(
  content: string,
  options: MarkdownOptions = defaultOptions
): string {
  if (!options.showDifferentiation) return ''
  const className =
    options.customStyles?.differentiation || defaultOptions.customStyles?.differentiation
  return `<div class="${className}">${content}</div>`
}

export function formatNote(content: string, options: MarkdownOptions = defaultOptions): string {
  const className = options.customStyles?.note || defaultOptions.customStyles?.note
  return `<div class="${className}">${content}</div>`
}

export function formatLessonSection(title: string, content: string): string {
  return `${formatHeading(title, 2)}\n\n${content}`
}

export function formatCrossCurricularLinks(
  links: Array<{ subject: string; description: string }>,
  options: MarkdownOptions = defaultOptions
): string {
  if (!options.showCrossCurricular) return ''
  const linksList = links.map((link) => `- **${link.subject}**: ${link.description}`).join('\n')
  return `${formatHeading('Cross-Curricular Links', 3)}\n\n${linksList}`
}

export function formatLessonPlanOverview(
  {
    title,
    subject,
    yearGroup,
    duration,
    objectives,
  }: {
    title: string
    subject: string
    yearGroup: string
    duration: number
    objectives: string[]
  },
  options: MarkdownOptions = defaultOptions
): string {
  const objectivesList = objectives.map((obj) => `- ${obj}`).join('\n')
  const durationText = options.showTimestamps ? `**Duration:** ${duration} minutes` : ''

  return `# ${title}

${formatHeading('Lesson Overview', 2)}

**Subject:** ${subject}  
**Year Group:** ${yearGroup}  
${durationText}

${formatHeading('Learning Objectives', 2)}

${objectivesList}
`
}

export function formatAssessmentQuestions(
  questions: Record<string, string[]>,
  options: MarkdownOptions = defaultOptions
): string {
  if (!options.showAssessment) return ''

  const sections = Object.entries(questions)
    .map(([level, questions]) => {
      const questionsList = questions.map((q) => `- ${q}`).join('\n')
      return `${formatHeading(capitalizeFirstLetter(level), 3)}\n\n${questionsList}`
    })
    .join('\n\n')

  return `${formatHeading('Assessment Questions', 2)}\n\n${sections}`
}

// Helper function
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
