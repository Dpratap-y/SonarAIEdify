import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import MarkdownRenderer from '@/components/markdown-renderer'
import { PEELGeneratorResponse } from '../schema/response-schema'
import {
  BookOpen,
  Lightbulb,
  MessageSquare,
  Palette,
  Users,
  Flag,
  FileText,
  ArrowRightCircle,
  Link as LinkIcon,
} from 'lucide-react'

interface PeelResponseProps {
  data: PEELGeneratorResponse
}

// Info Card component for metadata display
const InfoCard: React.FC<{
  title: string
  value: string
  icon: React.ReactNode
}> = ({ title, value, icon }) => {
  return (
    <div className="flex flex-col items-center rounded-lg border bg-white p-2 text-center">
      <div className="bg-primary/5 mb-1 flex h-10 w-10 items-center justify-center rounded-full p-2">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="font-medium">{value || 'N/A'}</p>
      </div>
    </div>
  )
}

const SectionCard: React.FC<{
  title: string
  content: string
  className?: string
  badgeText?: string
  icon?: React.ReactNode
}> = ({ title, content, className = '', badgeText, icon }) => {
  // Debug: Log the content being passed to MarkdownRenderer
  console.log(`${title} content:`, content)

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="bg-primary/10 border-b p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-primary flex items-center text-lg font-medium">
            {icon && <span className="mr-2">{icon}</span>}
            {title}
          </CardTitle>
          {badgeText && <div className="text-muted-foreground text-sm">{badgeText}</div>}
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {/* Ensure content is a string */}
        <MarkdownRenderer content={String(content)} variant="default" />
      </CardContent>
    </Card>
  )
}

const PeelResponse: React.FC<PeelResponseProps> = ({ data }) => {
  if (!data) return null

  // Debug: Log the entire data structure
  console.log('Complete PEEL response data:', data)

  const { content, metadata } = data

  // Extract tone and audience from additional data
  // Since these aren't in the schema, we'll infer them or use defaults
  const getToneDisplay = () => {
    // Look for tone indicators in the content
    const contentText = totalContent.toLowerCase()
    if (contentText.includes('formal tone') || contentText.includes('formal language'))
      return 'Formal'
    if (contentText.includes('academic tone') || contentText.includes('scholarly'))
      return 'Academic'
    if (contentText.includes('explanatory') || contentText.includes('explanation'))
      return 'Explanatory'

    return 'Standard'
  }

  const getAudienceDisplay = () => {
    // Simple direct mapping for audience based on common terms
    const contentText = totalContent.toLowerCase()

    if (contentText.includes('key stage 3') || contentText.includes('ks3')) return 'Key Stage 3'
    if (contentText.includes('gcse')) return 'GCSE'
    if (contentText.includes('a-level') || contentText.includes('a level')) return 'A-Level'

    // Use complexity as a fallback for audience level
    if (metadata.complexity) {
      const complexity = metadata.complexity.toLowerCase()
      if (complexity === 'beginner') return 'Key Stage 3'
      if (complexity === 'intermediate') return 'GCSE'
      if (complexity === 'advanced') return 'A-Level'
    }

    return 'General'
  }

  // Get the combined content for analysis
  const totalContent = content.point + content.evidence + content.explanation + content.link

  // Process the markdown for evidence specifically as it may have special formatting
  const processMarkdown = (text: string) => {
    // Check if the content appears to have been transformed from an array
    // The transformation adds \n\n between array items
    if (text.includes('\n\n') && !text.includes('**') && !text.includes('#')) {
      // Format it as a proper HTML list with styled bullets
      const items = text
        .split('\n\n')
        .filter((item) => item.trim().length > 0)
        .map((item) => `<li style="color: inherit; margin-bottom: 0.25rem;">${item.trim()}</li>`)
        .join('')

      return `<ul style="list-style-type: disc; padding-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 0.5rem;" class="list-items-primary">${items}</ul>`
    }

    // Handle bullet lists specifically for feedback
    if (text.includes('- ')) {
      // Replace standard markdown bullets with html bullets
      const lines = text.split('\n')
      const processedLines = lines.map((line) => {
        if (line.trim().startsWith('- ')) {
          const content = line.trim().substring(2)
          return `<li style="color: inherit; margin-bottom: 0.25rem;">${content}</li>`
        }
        return line
      })

      // Group consecutive list items into ul blocks
      let inList = false
      let result = ''

      for (let i = 0; i < processedLines.length; i++) {
        const line = processedLines[i]

        if (line.startsWith('<li')) {
          if (!inList) {
            result +=
              '<ul style="list-style-type: disc; padding-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 0.5rem;" class="list-items-primary">'
            inList = true
          }
          result += line
        } else {
          if (inList) {
            result += '</ul>'
            inList = false
          }
          result += line + '\n'
        }
      }

      if (inList) {
        result += '</ul>'
      }

      return result
    }

    // If the text appears to have markdown-like formatting but with ** that might be getting interpreted as literal
    if (text.includes('**') || text.includes('##')) {
      // Clean up and ensure proper markdown format
      return text
        .replace(/^\*\*([^*]{1,500})\*\*/gm, '**$1**')
        .replace(/^##\s+([^\n]{1,500})$/gm, '## $1')
    }

    return text
  }

  return (
    <div className="space-y-6">
      {/* Custom styles for primary-colored bullets */}
      <style jsx global>{`
        .list-items-primary li::marker {
          color: var(--primary);
        }
      `}</style>

      {/* Title Card */}
      <Card className="overflow-hidden rounded-xl shadow-sm">
        <CardHeader className="bg-primary/5 rounded-t-xl border-b p-3">
          <CardTitle className="text-primary text-xl leading-none font-semibold tracking-tight">
            PEEL Paragraph
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
            {metadata.subject && (
              <InfoCard
                title="Subject"
                value={metadata.subject}
                icon={<BookOpen className="text-primary h-4 w-4" />}
              />
            )}
            {metadata.complexity && (
              <InfoCard
                title="Complexity"
                value={metadata.complexity}
                icon={<Lightbulb className="text-primary h-4 w-4" />}
              />
            )}
            <InfoCard
              title="Tone"
              value={getToneDisplay()}
              icon={<Palette className="text-primary h-4 w-4" />}
            />
            <InfoCard
              title="Audience"
              value={getAudienceDisplay()}
              icon={<Users className="text-primary h-4 w-4" />}
            />
          </div>
        </CardContent>
      </Card>

      {/* PEEL Sections */}
      <SectionCard
        title="Point"
        content={processMarkdown(content.point)}
        icon={<Flag className="text-primary h-5 w-5" />}
      />
      <SectionCard
        title="Evidence"
        content={processMarkdown(content.evidence)}
        icon={<FileText className="text-primary h-5 w-5" />}
      />
      <SectionCard
        title="Explanation"
        content={processMarkdown(content.explanation)}
        icon={<ArrowRightCircle className="text-primary h-5 w-5" />}
      />
      <SectionCard
        title="Link"
        content={processMarkdown(content.link)}
        icon={<LinkIcon className="text-primary h-5 w-5" />}
      />

      {/* Feedback */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-green-50 p-4">
          <CardTitle className="flex items-center text-lg font-medium text-green-700">
            <MessageSquare className="mr-2 h-5 w-5" />
            Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="space-y-4">
            <div>
              <h3 className="text-primary mb-2 font-semibold">Strengths</h3>
              <div>
                <MarkdownRenderer
                  content={processMarkdown(content.feedback.strengths)}
                  variant="default"
                  allowHtml={true}
                />
              </div>
            </div>
            <div>
              <h3 className="text-primary mb-2 font-semibold">Areas for Improvement</h3>
              <div>
                <MarkdownRenderer
                  content={processMarkdown(content.feedback.improvements)}
                  variant="default"
                  allowHtml={true}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PeelResponse
