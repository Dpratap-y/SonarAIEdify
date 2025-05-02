import React, { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface BackToInputProps extends Omit<ComponentProps<typeof Button>, 'children'> {
  disabled?: boolean
  showIcon?: boolean
  text?: string
}

export function BackToInput({
  onClick,
  disabled = false,
  variant = 'outline',
  className = '',
  showIcon = true,
  text = 'Back to Input',
  ...props
}: BackToInputProps) {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={`gap-1 ${className}`}
      {...props}
    >
      {showIcon && <ArrowLeft className="h-4 w-4" />}
      {text}
    </Button>
  )
}
