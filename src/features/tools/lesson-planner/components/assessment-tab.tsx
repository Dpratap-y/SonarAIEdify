import React from 'react'
import { SectionCard, ContentList, SectionTitle } from './section-components'
import { cleanContent, extractSection, processCrossCurricular } from '../utils/content-extraction'

interface AssessmentTabProps {
  content: string
}

/**
 * Component for rendering assessment content in lesson planner
 */
const AssessmentTab: React.FC<AssessmentTabProps> = ({ content }) => {
  // Try to extract the different taxonomy levels
  const taxonomyLevels = [
    'Knowledge',
    'Comprehension',
    'Application',
    'Analysis',
    'Synthesis',
    'Evaluation',
  ]

  // Extract Cross-Curricular Links and Reflection Suggestions if present
  const crossCurricularSection = extractSection(
    content,
    'Cross-Curricular Links',
    'Reflection Suggestions'
  )
  const reflectionSection = extractSection(content, 'Reflection Suggestions', null)

  const extractTaxonomySection = (
    content: string,
    level: string,
    nextLevel: string | null
  ): string[] => {
    const sectionContent = extractSection(content, level, nextLevel)
    if (!sectionContent) return []

    // Remove the heading from the content (e.g., "Knowledge", "Comprehension", etc.)
    const cleanedContent = sectionContent.replace(new RegExp(`^(#+\\s*)?${level}\\s*\\n`, 'i'), '')
    return cleanContent(cleanedContent)
  }

  // Process each taxonomy level
  const taxonomySections = taxonomyLevels
    .map((level, index) => {
      const nextLevel =
        index < taxonomyLevels.length - 1 ? taxonomyLevels[index + 1] : 'Cross-Curricular Links'
      const sectionItems = extractTaxonomySection(content, level, nextLevel)
      return {
        level,
        items: sectionItems,
      }
    })
    .filter((section) => section.items.length > 0)

  // Process reflection suggestions
  const reflectionItems = reflectionSection
    ? cleanContent(reflectionSection.replace(/^(#+\s*)?Reflection Suggestions\s*\n/i, ''))
    : []

  // Get cross-curricular items
  const crossCurricularItems = processCrossCurricular(crossCurricularSection)

  return (
    <>
      <SectionCard title="Assessment Questions (Based on Bloom's Taxonomy)">
        <div className="space-y-4">
          {taxonomySections.length > 0 ? (
            taxonomySections.map(({ level, items }) => (
              <div key={level} className="mb-4">
                <SectionTitle>{level}</SectionTitle>
                <ContentList items={items} />
              </div>
            ))
          ) : (
            <div className="prose-sm">
              <p className="text-sm text-gray-600">No assessment questions available.</p>
            </div>
          )}
        </div>
      </SectionCard>

      {crossCurricularItems.length > 0 && (
        <SectionCard title="Cross-Curricular Links" className="mt-6">
          <div className="space-y-3">
            {crossCurricularItems.map(
              (item: { subject: string; description: string }, index: number) => (
                <div key={index} className="border-b pb-2 last:border-0 last:pb-0">
                  <h5 className="text-secondary text-sm font-medium">{item.subject}</h5>
                  <p className="text-sm">{item.description}</p>
                </div>
              )
            )}
          </div>
        </SectionCard>
      )}

      {reflectionItems.length > 0 && (
        <SectionCard title="Reflection Suggestions" className="mt-6">
          <ContentList items={reflectionItems} />
        </SectionCard>
      )}
    </>
  )
}

export default AssessmentTab
