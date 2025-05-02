import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Clock, Brain } from 'lucide-react'
import { cn } from '@/lib/utils'

// Import our components
import {
  SectionCard,
  ContentList,
  InfoCard,
  OverviewTab,
  StarterActivity,
  MainActivities,
  PlenarySection,
  AssessmentTab,
} from '.'

// Import hooks
import { useLessonContentParser } from '../hooks'

interface LessonPlanMarkdownProps {
  content: string
  className?: string
}

const LessonPlanMarkdown: React.FC<LessonPlanMarkdownProps> = ({ content, className }) => {
  // Use the hook to parse the content
  const parsedContent = useLessonContentParser(content)

  if (!content) return null

  return (
    <div className={cn('space-y-4 rounded-lg bg-white p-5 shadow', className)}>
      {/* Title Card */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="bg-primary/5 rounded-t-xl border-b p-3">
          <CardTitle className="text-primary text-xl leading-none font-semibold tracking-tight">
            {parsedContent.metadata.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-4">
          <div className="grid grid-cols-3 gap-3">
            <InfoCard
              title="Subject"
              value={parsedContent.metadata.subject}
              icon={<BookOpen className="text-primary h-4 w-4" />}
            />
            <InfoCard
              title="Year Group"
              value={parsedContent.metadata.yearGroup}
              icon={<Brain className="text-primary h-4 w-4" />}
            />
            <InfoCard
              title="Duration"
              value={parsedContent.metadata.duration}
              icon={<Clock className="text-primary h-4 w-4" />}
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs Navigation */}
      <Tabs defaultValue="overview" className="mt-4 w-full">
        <div className="flex justify-center">
          <TabsList className="h-auto flex-wrap justify-center py-1">
            <TabsTrigger value="overview" className="px-2 py-1 text-xs">
              Overview
            </TabsTrigger>
            {parsedContent.options.slice(0, 3).map((opt) => (
              <TabsTrigger
                key={`option-${opt.number}`}
                value={`option-${opt.number}`}
                className="px-2 py-1 text-xs"
              >
                Option {opt.number}
              </TabsTrigger>
            ))}
            <TabsTrigger value="assessment" className="px-2 py-1 text-xs">
              Assessment
            </TabsTrigger>
            <TabsTrigger value="additional" className="px-2 py-1 text-xs">
              Additional
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="mt-4 space-y-6">
          <OverviewTab
            objectives={parsedContent.sections.objectives}
            prompts={parsedContent.sections.discussionPrompts}
          />
        </TabsContent>

        {/* Option Tabs Content */}
        {parsedContent.options.map((opt) => (
          <TabsContent
            key={`option-content-${opt.number}`}
            value={`option-${opt.number}`}
            className="mt-4 space-y-6"
          >
            {/* Starter Activity */}
            <SectionCard title="Starter Activity">
              <StarterActivity content={opt.content} />
            </SectionCard>

            {/* Main Activities */}
            <SectionCard title="Main Activities">
              <MainActivities content={opt.content} />
            </SectionCard>

            {/* Plenary */}
            <SectionCard title="Plenary">
              <PlenarySection content={opt.content} />
            </SectionCard>
          </TabsContent>
        ))}

        {/* Assessment Tab Content */}
        <TabsContent value="assessment" className="mt-4 space-y-6">
          <AssessmentTab content={parsedContent.sections.assessment} />
        </TabsContent>

        {/* Additional Tab Content */}
        <TabsContent value="additional" className="mt-4 space-y-6">
          {/* Differentiation & SEN Support */}
          {parsedContent.additionalContent.differentiationItems.length > 0 && (
            <SectionCard
              title="Differentiation & SEN Support"
              className="border-primary/30 border-2"
              headerClassName="bg-primary/5"
            >
              <ContentList items={parsedContent.additionalContent.differentiationItems} />
            </SectionCard>
          )}

          {/* Additional Notes */}
          {parsedContent.additionalContent.additionalNotesItems.length > 0 && (
            <SectionCard title="Additional Notes">
              <ContentList items={parsedContent.additionalContent.additionalNotesItems} />
            </SectionCard>
          )}

          {/* Cross-Curricular Links */}
          {parsedContent.additionalContent.crossCurricularItems.length > 0 && (
            <SectionCard title="Cross-Curricular Links">
              <div className="space-y-3">
                {parsedContent.additionalContent.crossCurricularItems.map((item, index) => (
                  <div key={index} className="border-b pb-2 last:border-0 last:pb-0">
                    <h5 className="text-secondary text-sm font-medium">{item.subject}</h5>
                    <p className="text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Reflection Suggestions */}
          {parsedContent.additionalContent.reflectionItems.length > 0 && (
            <SectionCard title="Reflection Suggestions">
              <ContentList items={parsedContent.additionalContent.reflectionItems} />
            </SectionCard>
          )}

          {/* Show a message if no additional content is available */}
          {!parsedContent.additionalContent.differentiationItems.length &&
            !parsedContent.additionalContent.crossCurricularItems.length &&
            !parsedContent.additionalContent.reflectionItems.length &&
            !parsedContent.additionalContent.additionalNotesItems.length && (
              <Card>
                <CardContent className="p-4">
                  <p className="text-center text-sm text-gray-500">
                    No additional information available for this lesson plan.
                  </p>
                </CardContent>
              </Card>
            )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default LessonPlanMarkdown
