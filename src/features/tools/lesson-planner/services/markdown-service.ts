import { type LessonPlanResponse } from '../schema'
import { type FormValues } from '../schema/form-schema'
import {
  formatLearningObjective,
  formatActivity,
  formatMaterials,
  formatDifferentiation,
  formatNote,
  formatLessonSection,
  formatCrossCurricularLinks,
  formatLessonPlanOverview,
  formatAssessmentQuestions,
  formatHeading,
  formatList,
  formatNumberedList,
  formatTable,
} from '../utils/markdown'
import type { MarkdownOptions } from '../utils/markdown'

export function generateMarkdown(
  lessonPlan: LessonPlanResponse,
  formData: FormValues,
  options?: MarkdownOptions
): string {
  let markdown = formatLessonPlanOverview(
    {
      title: lessonPlan.overview.topic,
      subject: lessonPlan.overview.subject,
      yearGroup: lessonPlan.overview.yearGroup,
      duration: lessonPlan.overview.duration,
      objectives: lessonPlan.overview.learningObjectives,
    },
    options
  )

  markdown += '\n\n'
  markdown += formatLessonSection(
    'Initial Discussion Prompts',
    lessonPlan.overview.initialPrompts
      .map((prompt) => formatLearningObjective(prompt, options))
      .join('\n\n')
  )

  markdown += '\n\n'
  markdown += formatHeading('Lesson Options', 2) + '\n\n'

  lessonPlan.lessonOptions.forEach((option) => {
    markdown += formatHeading(`Option ${option.optionNumber}`, 3) + '\n\n'

    const activities = [
      { name: 'Starter Activity', duration: option.starterActivity.duration },
      ...option.mainActivities.map((act) => ({
        name: act.description,
        duration: act.duration,
      })),
      { name: 'Plenary', duration: option.plenary.duration },
    ]

    const tableHeaders = ['Activity', 'Duration (minutes)']
    const tableRows = activities.map((activity) => [activity.name, activity.duration.toString()])
    markdown += formatTable(tableHeaders, tableRows) + '\n\n'

    markdown +=
      formatHeading(`Starter Activity (${option.starterActivity.duration} minutes)`, 4) + '\n'
    markdown += formatActivity(option.starterActivity.description, options) + '\n\n'
    markdown += formatMaterials(option.starterActivity.materials, options) + '\n\n'
    markdown += formatHeading('Instructions:', 5) + '\n'
    markdown += formatNumberedList(option.starterActivity.instructions) + '\n\n'

    markdown += formatHeading('Main Activities', 4) + '\n'
    option.mainActivities.forEach((activity, actIndex) => {
      markdown += formatHeading(`${activity.description} (${activity.duration} minutes)`, 5) + '\n'
      markdown += formatActivity(`Activity ${actIndex + 1}`, options) + '\n\n'
      markdown += formatMaterials(activity.materials, options) + '\n\n'
      markdown += formatHeading('Instructions:', 6) + '\n'
      markdown += formatNumberedList(activity.instructions) + '\n\n'

      if (activity.differentiation && options?.showDifferentiation) {
        markdown += formatHeading('Differentiation:', 6) + '\n'
        let diffContent = ''

        if (activity.differentiation.support) {
          diffContent += `**Support:** ${formatList(activity.differentiation.support)}\n`
        }
        if (activity.differentiation.core) {
          diffContent += `**Core:** ${formatList(activity.differentiation.core)}\n`
        }
        if (activity.differentiation.extension) {
          diffContent += `**Extension:** ${formatList(activity.differentiation.extension)}\n`
        }

        markdown += formatDifferentiation(diffContent, options) + '\n\n'
      }
    })

    markdown += formatHeading(`Plenary (${option.plenary.duration} minutes)`, 4) + '\n'
    markdown += formatActivity(option.plenary.description, options) + '\n\n'
    markdown += formatHeading('Instructions:', 5) + '\n'
    markdown += formatNumberedList(option.plenary.instructions) + '\n\n'
    if (options?.showSuccessIndicators) {
      markdown += formatHeading('Success Indicators:', 5) + '\n'
      markdown += formatList(option.plenary.successIndicators) + '\n\n'
    }
  })

  markdown += formatAssessmentQuestions(lessonPlan.assessmentQuestions, options)

  if ((formData.enableDifferentiation || formData.enableSEN) && options?.showDifferentiation) {
    markdown += formatHeading('Differentiation & SEN Support', 2) + '\n'

    if (lessonPlan.differentiationAndSEN.differentiation) {
      markdown += formatHeading('Differentiation Strategies', 3) + '\n'
      let diffContent = ''

      if (lessonPlan.differentiationAndSEN.differentiation.support) {
        diffContent += `### Support\n${formatList(lessonPlan.differentiationAndSEN.differentiation.support)}\n\n`
      }
      if (lessonPlan.differentiationAndSEN.differentiation.core) {
        diffContent += `### Core\n${formatList(lessonPlan.differentiationAndSEN.differentiation.core)}\n\n`
      }
      if (lessonPlan.differentiationAndSEN.differentiation.extension) {
        diffContent += `### Extension\n${formatList(lessonPlan.differentiationAndSEN.differentiation.extension)}\n\n`
      }

      markdown += formatDifferentiation(diffContent, options) + '\n\n'
    }

    if (lessonPlan.differentiationAndSEN.senSupport) {
      markdown += formatHeading('SEN Support', 3) + '\n'
      let senContent = ''

      if (lessonPlan.differentiationAndSEN.senSupport.visual) {
        senContent += `### Visual Impairment\n${formatList(lessonPlan.differentiationAndSEN.senSupport.visual)}\n\n`
      }
      if (lessonPlan.differentiationAndSEN.senSupport.auditory) {
        senContent += `### Hearing Impairment\n${formatList(lessonPlan.differentiationAndSEN.senSupport.auditory)}\n\n`
      }
      if (lessonPlan.differentiationAndSEN.senSupport.cognitive) {
        senContent += `### Cognitive Support\n${formatList(lessonPlan.differentiationAndSEN.senSupport.cognitive)}\n\n`
      }

      markdown += formatDifferentiation(senContent, options) + '\n\n'
    }
  }

  if (lessonPlan.crossCurricularLinks.length > 0 && options?.showCrossCurricular) {
    const links = lessonPlan.crossCurricularLinks.map((link) => {
      const parts = link.split(':')
      return {
        subject: parts[0]?.trim() || 'Subject',
        description: parts[1]?.trim() || link,
      }
    })
    markdown += formatCrossCurricularLinks(links, options) + '\n\n'
  }

  if (options?.showReflection) {
    markdown += formatLessonSection(
      'Reflection Suggestions',
      lessonPlan.reflectionSuggestions
        .map((suggestion) => formatNote(suggestion, options))
        .join('\n')
    )
  }

  // Add Additional Notes section
  if (lessonPlan.additionalNotes && lessonPlan.additionalNotes.length > 0) {
    markdown += formatHeading('Additional Notes', 2) + '\n\n'
    markdown += formatList(lessonPlan.additionalNotes) + '\n\n'
  }

  return markdown
}
