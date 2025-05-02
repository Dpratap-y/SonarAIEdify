'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { Menu } from 'lucide-react'

export function MobileNav() {
  const [open, setOpen] = useState(false)
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-bold">
            <span className="text-primary">AI</span>
            <span>Edify</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'hover:text-primary rounded-md px-2 py-1 text-sm font-medium transition-colors',
                pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href))
                  ? 'bg-muted text-primary'
                  : 'text-muted-foreground'
              )}
              onClick={() => setOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
