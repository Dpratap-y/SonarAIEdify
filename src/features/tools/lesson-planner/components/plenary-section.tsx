import React from 'react'
import { Clock } from 'lucide-react'
import { ContentList, SectionTitle } from './section-components'
import { cleanContent, extractSection } from '../utils/content-extraction'

interface PlenarySectionProps {
  content: string
}

/**
 * Component for rendering the plenary section in lesson planner
 */
const PlenarySection: React.FC<PlenarySectionProps> = ({ content }) => {
  const plenarySection = extractSection(content, 'Plenary', 'Success Indicators')
  const successSection = extractSection(content, 'Success Indicators', null)

  // Extract duration from heading
  const durationMatch =
    plenarySection.match(/Plenary \((\d+) minutes\)/) ||
    plenarySection.match(/plenary \((\d+) minutes\)/)
  const duration = durationMatch ? durationMatch[1] : null

  // Extract instructions
  const instructionsMatch =
    plenarySection.match(/Instructions:([\s\S]*?)$/) ||
    plenarySection.match(/instructions:([\s\S]*?)$/)
  const instructions = instructionsMatch ? cleanContent(instructionsMatch[1]) : []

  // Extract description with better content cleaning
  const descriptionText = plenarySection
    .replace(/Plenary \(\d+ minutes\)|plenary \(\d+ minutes\)/g, '')
    .replace(/Instructions:[\s\S]*?$/g, '')
    .replace(/instructions:[\s\S]*?$/g, '')
    .trim()

  const description = cleanContent(descriptionText)

  // Clean success indicators content
  const successItems = successSection ? cleanContent(successSection) : []

  return (
    <div>
      {duration && (
        <div className="mb-3 flex items-center">
          <Clock className="text-primary mr-2 h-4 w-4" />
          <span className="text-sm font-medium text-gray-600">{duration} minutes</span>
        </div>
      )}

      {description.length > 0 && (
        <div className="prose-sm mb-4">
          <ContentList items={description} />
        </div>
      )}

      {instructions.length > 0 && (
        <div className="mb-4">
          <SectionTitle>Instructions</SectionTitle>
          <ContentList items={instructions} />
        </div>
      )}

      {successItems.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <SectionTitle>Success Indicators</SectionTitle>
          <ContentList items={successItems} />
        </div>
      )}
    </div>
  )
}

export default PlenarySection
