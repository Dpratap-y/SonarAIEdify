import type React from 'react'
import { FormLabel } from '@/components/ui/form'

interface RequiredLabelProps {
  children: React.ReactNode
}

export function RequiredLabel({ children }: RequiredLabelProps) {
  return (
    <FormLabel>
      {children} <span className="text-destructive">*</span>
    </FormLabel>
  )
}
