'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
    },
    {
      name: 'AI Tools',
      href: '/dashboard/tools',
    },
    {
      name: 'Organization',
      href: '/dashboard/organization',
    },
  ]

  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'hover:text-primary text-sm font-medium transition-colors',
            pathname === item.href ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  )
}
