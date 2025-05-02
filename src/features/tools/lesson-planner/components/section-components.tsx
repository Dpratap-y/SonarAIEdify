import React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * A set of reusable UI components for lesson plan sections
 */

// Section Card component
interface SectionCardProps {
  title: string
  children: React.ReactNode
  className?: string
  titleClassName?: string
  headerClassName?: string
  contentClassName?: string
  icon?: React.ReactNode
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  children,
  className,
  titleClassName,
  headerClassName,
  contentClassName,
  icon,
}) => {
  return (
    <Card className={cn('rounded-lg shadow-sm', className)}>
      <CardHeader className={cn('pb-2', headerClassName)}>
        <CardTitle
          className={cn('text-primary flex items-center text-lg font-semibold', titleClassName)}
        >
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={cn('p-4 pt-2', contentClassName)}>{children}</CardContent>
    </Card>
  )
}

// Content List component
interface ContentListProps {
  items: string[]
  className?: string
  itemClassName?: string
  markerClassName?: string
}

export const ContentList: React.FC<ContentListProps> = ({
  items,
  className,
  itemClassName,
  markerClassName,
}) => {
  if (!items || items.length === 0) return null

  return (
    <ul className={cn('marker:text-primary list-disc space-y-2 pl-5', markerClassName, className)}>
      {items.map((item, i) => (
        <li key={i} className={cn('text-sm', itemClassName)}>
          {item}
        </li>
      ))}
    </ul>
  )
}

// Section Title component
interface SectionTitleProps {
  children: React.ReactNode
  className?: string
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children, className }) => {
  return <h4 className={cn('text-secondary mb-2 text-sm font-medium', className)}>{children}</h4>
}

// Info Card component
interface InfoCardProps {
  title: string
  value: string
  icon: React.ReactNode
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, value, icon }) => {
  return (
    <div className="flex flex-col items-center rounded-lg border bg-white p-2 text-center">
      <div className="bg-primary/5 mb-1 flex h-10 w-10 items-center justify-center rounded-full p-2">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="font-bold">{value || 'N/A'}</p>
      </div>
    </div>
  )
}
