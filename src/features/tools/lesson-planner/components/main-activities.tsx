import React from 'react'
import { Clock } from 'lucide-react'
import { ContentList, SectionTitle } from './section-components'
import {
  cleanContent,
  extractSection,
  processDifferentiationContent,
} from '../utils/content-extraction'

interface MainActivitiesProps {
  content: string
}

/**
 * Component for rendering main activities section in lesson planner
 */
const MainActivities: React.FC<MainActivitiesProps> = ({ content }) => {
  const mainSection = extractSection(content, 'Main Activities', 'Plenary')

  // Try to split into individual activities if they exist
  // Split by the heading pattern manually instead
  const activities: string[] = []
  const lines = mainSection.split('\n')
  let currentActivity = ''
  let isInActivity = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.startsWith('#### ')) {
      // If we found a new activity and already had one in progress, push it
      if (isInActivity && currentActivity.trim()) {
        activities.push(currentActivity)
        currentActivity = ''
      }
      isInActivity = true
      currentActivity += line + '\n'
    } else if (isInActivity) {
      currentActivity += line + '\n'
    }
  }

  // Add the last activity if there was one
  if (isInActivity && currentActivity.trim()) {
    activities.push(currentActivity)
  }

  // We'll use our manually split activities instead of regex match with flags
  const activityMatches = activities

  if (activityMatches && activityMatches.length > 0) {
    return (
      <div className="space-y-6">
        {activityMatches.map((activity, index) => {
          // Extract activity title
          const titleRegex = /#### (.*?)(?=\n|$)/
          const titleMatch = titleRegex.exec(activity)
          const title = titleMatch ? titleMatch[1].trim() : `Activity ${index + 1}`

          // Extract duration if present in the title
          const durationRegex = /\((\d+) minutes\)/
          const durationRegexUpper = /\((\d+) MINUTES\)/
          const durationMatch = durationRegex.exec(title) || durationRegexUpper.exec(title)
          const duration = durationMatch ? durationMatch[1] : null

          // Extract materials - clean content
          const materialsRegex = /Materials:([\s\S]*?)(?=Instructions:|Differentiation:|$)/
          const materialsRegexLower = /materials:([\s\S]*?)(?=instructions:|differentiation:|$)/
          const materialsMatch = materialsRegex.exec(activity) || materialsRegexLower.exec(activity)
          const materials = materialsMatch ? cleanContent(materialsMatch[1]) : []

          // Extract instructions - clean content
          const instructionsRegex = /Instructions:([\s\S]*?)(?=Materials:|Differentiation:|$)/
          const instructionsRegexLower = /instructions:([\s\S]*?)(?=materials:|differentiation:|$)/
          const instructionsMatch =
            instructionsRegex.exec(activity) || instructionsRegexLower.exec(activity)
          const instructions = instructionsMatch ? cleanContent(instructionsMatch[1]) : []

          // Extract differentiation - clean content
          const differentiationRegex = /Differentiation:([\s\S]*?)(?=Materials:|Instructions:|$)/
          const differentiationRegexLower =
            /differentiation:([\s\S]*?)(?=materials:|instructions:|$)/
          const differentiationMatch =
            differentiationRegex.exec(activity) || differentiationRegexLower.exec(activity)
          const differentiation = differentiationMatch ? cleanContent(differentiationMatch[1]) : []

          // Clean title for display
          const cleanTitle = title
            .replace(/\(\d+ minutes\)/, '')
            .replace(/\(\d+ MINUTES\)/, '')
            .trim()

          // Extract description - clean content
          const descriptionText = activity
            .replace(/#### .*\n/, '')
            .replace(/Materials:[\s\S]*?(?=Instructions:|Differentiation:|$)/g, '')
            .replace(/Instructions:[\s\S]*?(?=Materials:|Differentiation:|$)/g, '')
            .replace(/Differentiation:[\s\S]*?(?=Materials:|Instructions:|$)/g, '')
            .replace(/materials:[\s\S]*?(?=instructions:|differentiation:|$)/g, '')
            .replace(/instructions:[\s\S]*?(?=materials:|differentiation:|$)/g, '')
            .replace(/differentiation:[\s\S]*?(?=materials:|instructions:|$)/g, '')
            .trim()

          const description = cleanContent(descriptionText)

          // Process differentiation content to handle the nested structure
          const differentiationSections = processDifferentiationContent(differentiation)

          return (
            <div key={index} className="rounded-md border p-3">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-primary font-medium">{cleanTitle}</h4>
                {duration && (
                  <div className="flex items-center">
                    <Clock className="text-primary mr-1 h-4 w-4" />
                    <span className="text-sm text-gray-600">{duration} minutes</span>
                  </div>
                )}
              </div>

              {description.length > 0 && (
                <div className="prose-sm mb-4">
                  <ContentList items={description} />
                </div>
              )}

              {materials.length > 0 && (
                <div className="bg-muted/20 mb-4 rounded-md p-3">
                  <SectionTitle>Materials</SectionTitle>
                  <ContentList items={materials} />
                </div>
              )}

              {instructions.length > 0 && (
                <div className="mb-3">
                  <SectionTitle>Instructions</SectionTitle>
                  <ContentList items={instructions} />
                </div>
              )}

              {differentiationSections.length > 0 && (
                <div className="mt-3 border-t pt-3">
                  <SectionTitle>Differentiation</SectionTitle>
                  <div className="space-y-2">
                    {differentiationSections.map((section, i) => (
                      <div key={i} className="mb-2">
                        {section.type !== 'default' && (
                          <h5
                            className={`text-xs font-medium ${
                              section.type === 'support'
                                ? 'text-blue-600'
                                : section.type === 'core'
                                  ? 'text-green-600'
                                  : 'text-orange-600'
                            }`}
                          >
                            {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                          </h5>
                        )}
                        <ContentList items={section.content} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // If no activities found, process the whole section for display
  // First, clean up repeated main activities heading
  const cleanedMainContent = mainSection.replace(/^(# |## |### )Main Activities\s*\n/gm, '')
  const mainItems = cleanContent(cleanedMainContent)

  return (
    <div className="prose-sm">
      <ContentList items={mainItems} />
    </div>
  )
}

export default MainActivities
