import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <span className="text-primary">AI</span>
            <span>Edify</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign up</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="container space-y-6 py-24 md:py-32 lg:py-40">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Powerful AI Tools for <span className="text-primary">Everyone</span>
            </h1>
            <p className="text-muted-foreground max-w-[42rem] leading-normal sm:text-xl sm:leading-8">
              Unlock the power of artificial intelligence for your business and personal projects
              with our suite of AI tools.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard/tools">
                <Button size="lg" variant="outline">
                  Explore Tools
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="container py-12 md:py-16 lg:py-20">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {[
              {
                title: 'For Individuals',
                description:
                  'Access powerful AI tools to enhance your productivity and creativity.',
              },
              {
                title: 'For Teams',
                description: 'Collaborate with your team using shared AI tools and resources.',
              },
              {
                title: 'For Enterprises',
                description: "Custom AI solutions tailored to your organization's needs.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-card rounded-lg border p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} AIEdify. All rights reserved.
          </p>
          <div className="text-muted-foreground flex gap-4 text-sm">
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
