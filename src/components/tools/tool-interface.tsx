'use client'

import { useState, ReactNode, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ToolsLoadingState } from '@/components/tools/tools-loading-state'
import { BackToInput } from '@/components/tools/back-to-input'
import { RegenerateResponse } from '@/components/tools/regenerate-response'
import { useToolContext } from '@/contexts/tool-context'
import { BackToTop } from '@/components/back-to-top'

interface ToolLayoutProps {
  toolName: string
  description?: string
  inputForm: ReactNode
  onGenerate: () => void
  isGenerating: boolean
  response: ReactNode | string | null
  disableGenerate?: boolean
  error?: string | null
}

type Step = 'input' | 'loading' | 'response'

export function ToolLayout({
  toolName,
  description,
  inputForm,
  onGenerate,
  isGenerating,
  response,
  disableGenerate = false,
  error = null,
}: ToolLayoutProps) {
  const [step, setStep] = useState<Step>('input')
  const { setToolLoading } = useToolContext()

  // Handle state changes
  useEffect(() => {
    if (isGenerating) {
      setStep('loading')
      setToolLoading(true)
    } else if (response && step === 'loading') {
      setStep('response')
      setToolLoading(false)
    }
  }, [isGenerating, response, step, setToolLoading])

  // Go back to the input form
  const handleBackToInput = () => {
    setStep('input')
    setToolLoading(false)
  }

  // Handle the generate button click
  const handleGenerate = () => {
    onGenerate()
  }

  // Navigation buttons that appear at the top
  const NavigationBar = () => {
    if (step === 'input' || step === 'loading') return null

    return (
      <div className="mb-6 flex items-center justify-between">
        <BackToInput onClick={handleBackToInput} disabled={isGenerating} />

        <RegenerateResponse onClick={handleGenerate} disabled={isGenerating || disableGenerate} />
      </div>
    )
  }

  // Input form view
  if (step === 'input') {
    return (
      <Card className="w-full">
        {error && (
          <div className="mb-0 rounded-t-md border border-red-200 bg-red-50 p-4 text-red-800">
            <h3 className="text-sm font-medium">Error</h3>
            <div className="mt-2 text-sm whitespace-pre-wrap">{error}</div>
          </div>
        )}
        <CardHeader>
          <CardTitle>{toolName}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{inputForm}</CardContent>
        <CardFooter>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || disableGenerate}
            className="ml-auto"
          >
            Generate
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Loading state view
  if (step === 'loading') {
    return <ToolsLoadingState toolName={toolName} />
  }

  // Response view
  return (
    <>
      <div className="w-full">
        <NavigationBar />

        <Card>
          <CardHeader>
            <CardTitle>{toolName} Results</CardTitle>
            <CardDescription>Generated content based on your inputs</CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
                <h3 className="text-sm font-medium">Error</h3>
                <div className="mt-2 text-sm whitespace-pre-wrap">{error}</div>
              </div>
            ) : typeof response === 'string' ? (
              <div className="bg-muted rounded-md p-4 whitespace-pre-wrap">{response}</div>
            ) : (
              <div className="bg-muted rounded-md p-4">{response}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <BackToTop threshold={200} />
    </>
  )
}
