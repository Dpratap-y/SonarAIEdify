'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useToolContext } from '@/contexts/tool-context'
import { tools } from '@/lib/tools-data'

interface ToolPageHeaderProps {
  tool: (typeof tools)[number]
}

export function ToolPageHeader({ tool }: ToolPageHeaderProps) {
  const { isToolLoading } = useToolContext()

  if (isToolLoading) {
    return null
  }

  return (
    <div>
      <div className="mb-4">
        <Link href="/dashboard/tools">
          <Button variant="ghost" size="sm" className="gap-1 px-0 hover:bg-transparent">
            <ChevronLeft className="h-4 w-4" />
            Back to AI Tools
          </Button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold tracking-tight">{tool.name}</h1>
      <p className="text-muted-foreground">{tool.description}</p>
    </div>
  )
}
