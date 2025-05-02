'use client'

import React from 'react'
import * as LucideIcons from 'lucide-react'
import { LucideProps } from 'lucide-react'

interface IconComponentProps {
  name: string
  className?: string
}

export default function IconComponent({ name, className }: IconComponentProps) {
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<LucideProps>>
  const IconComponent = icons[name]

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`)
    return null
  }

  return <IconComponent className={className} />
}
