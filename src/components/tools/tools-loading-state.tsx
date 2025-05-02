'use client'

import React, { useEffect, useState } from 'react'
import { Progress } from '@/components/ui/progress'
import { LightbulbIcon } from 'lucide-react'
import { EDUCATIONAL_FACTS } from '@/constants/edu-facts'

interface ToolsLoadingStateProps {
  toolName: string
  onComplete?: () => void
}

export function ToolsLoadingState({ toolName, onComplete }: ToolsLoadingStateProps) {
  const [progress, setProgress] = useState(0)
  const [factIndex, setFactIndex] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress((oldProgress) => {
          const newProgress = Math.min(oldProgress + 1, 100)
          if (newProgress === 100 && onComplete) {
            setTimeout(onComplete, 500)
          }
          return newProgress
        })
      }
    }, 50) // Adjust timing to control how fast the progress bar fills

    return () => clearTimeout(timer)
  }, [progress, onComplete])

  // Rotate through facts every 4 seconds
  useEffect(() => {
    const factTimer = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % EDUCATIONAL_FACTS.length)
    }, 4000)

    return () => clearInterval(factTimer)
  }, [])

  return (
    <div className="flex h-[70vh] w-full flex-col items-center justify-center">
      <h1 className="text-primary mb-12 text-3xl font-bold tracking-tight">{toolName}</h1>

      <div className="mb-12 max-w-2xl text-center">
        <h2 className="text-primary mb-6 text-4xl font-light">
          We&apos;re just generating your results
        </h2>
      </div>

      <div className="mb-16 w-full max-w-2xl">
        <Progress value={progress} className="bg-muted h-3 rounded-full" />
      </div>

      <div className="flex max-w-2xl flex-col items-center text-center">
        <div className="mb-4">
          <LightbulbIcon className="text-primary h-8 w-8" />
        </div>
        <h3 className="text-primary mb-3 text-2xl font-medium">Did you know?</h3>
        <p className="text-muted-foreground">{EDUCATIONAL_FACTS[factIndex]}</p>
      </div>
    </div>
  )
}
