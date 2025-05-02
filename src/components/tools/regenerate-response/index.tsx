import React, { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

interface RegenerateResponseProps extends Omit<ComponentProps<typeof Button>, 'children'> {
  disabled?: boolean
  showIcon?: boolean
  text?: string
}

export function RegenerateResponse({
  onClick,
  disabled = false,
  variant = 'outline',
  className = '',
  showIcon = true,
  text = 'Regenerate',
  ...props
}: RegenerateResponseProps) {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={`gap-1 ${className}`}
      {...props}
    >
      {showIcon && <RefreshCw className="h-4 w-4" />}
      {text}
    </Button>
  )
}
