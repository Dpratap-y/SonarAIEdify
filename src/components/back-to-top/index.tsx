'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowUp } from 'lucide-react'

interface BackToTopProps {
  threshold?: number
  className?: string
}

export function BackToTop({ threshold = 300, className = '' }: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [threshold])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (!isVisible) {
    return null
  }

  return (
    <Button
      onClick={scrollToTop}
      className={`bg-primary text-primary-foreground fixed right-6 bottom-6 z-50 h-12 w-12 rounded-full p-0 shadow-md transition-all hover:shadow-lg ${className}`}
      size="icon"
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  )
}
