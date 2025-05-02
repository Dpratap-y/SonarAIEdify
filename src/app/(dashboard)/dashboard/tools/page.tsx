import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { tools } from '@/lib/tools-data'
import IconComponent from '@/components/IconComponent'

export default function ToolsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Tools</h1>
        <p className="text-muted-foreground">
          Explore our collection of AI-powered educational tools
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {tools.map((tool) => (
          <Link key={tool.slug} href={`/dashboard/tools/${tool.slug}`}>
            <Card className="hover:border-primary/50 h-full cursor-pointer transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{tool.name}</CardTitle>
                <div className="bg-primary/10 rounded-full p-2">
                  <IconComponent name={tool.icon} className="text-primary h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-sm">
                  {tool.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
