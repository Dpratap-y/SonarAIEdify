import { getUserDetails } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowUpRight, Brain, Layers, Users } from 'lucide-react'

export default async function DashboardPage() {
  const user = await getUserDetails()

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.full_name || 'User'}</h1>
        <p className="text-muted-foreground">Here&apos;s an overview of your AI tools and usage.</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Tools</CardTitle>
                <Brain className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-muted-foreground text-xs">+2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Requests</CardTitle>
                <Layers className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,324</div>
                <p className="text-muted-foreground text-xs">+10% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                <Users className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-muted-foreground text-xs">+1 new this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <ArrowUpRight className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-muted-foreground text-xs">+2 from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent interactions with AI tools.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="p-4">
                    <div className="text-muted-foreground text-sm">
                      No recent activity to display.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Popular Tools</CardTitle>
                <CardDescription>Your most frequently used AI tools.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-primary/10 mr-4 rounded-md p-2">
                      <Brain className="text-primary h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm leading-none font-medium">Text Generation</p>
                      <p className="text-muted-foreground text-sm">
                        Generate creative content with AI
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-primary/10 mr-4 rounded-md p-2">
                      <Layers className="text-primary h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm leading-none font-medium">Image Analysis</p>
                      <p className="text-muted-foreground text-sm">Extract insights from images</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Detailed usage analytics will appear here.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[300px] items-center justify-center rounded-md border">
                <p className="text-muted-foreground">Analytics dashboard coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>View and download reports of your AI usage.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[300px] items-center justify-center rounded-md border">
                <p className="text-muted-foreground">Reports feature coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
