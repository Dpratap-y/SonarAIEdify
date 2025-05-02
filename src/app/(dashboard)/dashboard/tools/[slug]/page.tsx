import { notFound } from 'next/navigation'
import { tools } from '@/lib/tools-data'
import { ClarifyOrChallenge } from '@/features/tools/clarify-or-challenge'
import { PromptGenerator } from '@/features/tools/prompt-generator'
import { PerspectiveChallenge } from '@/components/tools/perspective-challenge'
import { ReportGenerator } from '@/components/tools/report-generator'
import { PeelGenerator } from '@/features/tools/peel-generator'
import { QuizGenerator } from '@/components/tools/quiz-generator'
import { LessonPlanEvaluator } from '@/components/tools/lesson-plan-evaluator'
import { MCQGenerator } from '@/components/tools/mcq-generator'
import { LessonPlanner } from '@/features/tools/lesson-planner'
import { LongQAGenerator } from '@/components/tools/long-qa-generator'
import { ToolPageHeader } from '@/components/tools/tool-header'

type ToolPageProps = {
  params: Promise<{ slug: string }>
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params
  const tool = tools.find((t) => t.slug === slug)

  if (!tool) {
    notFound()
  }

  const renderTool = () => {
    switch (slug) {
      case 'clarify-challenge':
        return <ClarifyOrChallenge />
      case 'prompt-generator':
        return <PromptGenerator />
      case 'perspective-challenge':
        return <PerspectiveChallenge />
      case 'report-generator':
        return <ReportGenerator />
      case 'peel-generator':
        return <PeelGenerator />
      case 'quiz-generator':
        return <QuizGenerator />
      case 'lesson-plan-evaluator':
        return <LessonPlanEvaluator />
      case 'mcq-generator':
        return <MCQGenerator />
      case 'lesson-planner':
        return <LessonPlanner />
      case 'long-question-answer':
        return <LongQAGenerator />
      default:
        return (
          <div className="flex h-64 items-center justify-center rounded-lg border">
            <p className="text-muted-foreground">Tool interface coming soon</p>
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <ToolPageHeader tool={tool} />
      {renderTool()}
    </div>
  )
}
