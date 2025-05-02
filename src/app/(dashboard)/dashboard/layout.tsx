import type React from 'react'
import { redirect } from 'next/navigation'
import { getUserDetails, requireAuth } from '@/lib/auth'
import { MainNav } from '@/components/dashboard/main-nav'
import { MobileNav } from '@/components/dashboard/mobile-nav'
import { UserNav } from '@/components/dashboard/user-nav'
import { ModeToggle } from '@/components/mode-toggle'
import { ToolProvider } from '@/contexts/tool-context'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAuth()
  const user = await getUserDetails()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="container flex h-16 items-center">
          {/* Mobile Navigation */}
          <div className="flex items-center md:hidden">
            <MobileNav />
          </div>

          {/* Logo - centered on mobile, left on desktop */}
          <div className="flex w-full items-center justify-center gap-2 font-bold md:mx-0 md:mr-4 md:w-auto md:justify-start">
            <span className="text-primary">AI</span>
            <span>Edify</span>
          </div>

          {/* Desktop Navigation */}
          <MainNav className="mx-6 hidden md:flex" />

          {/* Right side controls */}
          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />
            <UserNav user={user} />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <ToolProvider>{children}</ToolProvider>
        </div>
      </main>
    </div>
  )
}
