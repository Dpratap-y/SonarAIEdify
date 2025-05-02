import React from 'react'
import { SectionCard, ContentList, SectionTitle } from './section-components'

interface OverviewTabProps {
  objectives: string[]
  prompts: string[]
}

/**
 * Component for rendering the overview tab content in lesson planner
 */
const OverviewTab: React.FC<OverviewTabProps> = ({ objectives, prompts }) => {
  return (
    <SectionCard title="Lesson Overview">
      <div className="space-y-6">
        <div className="bg-muted/30 rounded-lg p-4">
          <SectionTitle>Learning Objectives</SectionTitle>
          <div className="prose-sm">
            <ContentList items={objectives} />
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-4">
          <SectionTitle>Initial Discussion Prompts</SectionTitle>
          <div className="prose-sm">
            <ContentList items={prompts} />
          </div>
        </div>
      </div>
    </SectionCard>
  )
}

export default OverviewTab
