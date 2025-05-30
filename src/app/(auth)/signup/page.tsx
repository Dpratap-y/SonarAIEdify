import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AuthForm } from '@/components/auth/auth-form'
import { Button } from '@/components/ui/button'

export default async function SignupPage() {
  const session = await getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute top-4 left-4 md:top-8 md:left-8">
        <Button variant="ghost">Home</Button>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-muted-foreground text-sm">
            Enter your information to create an account
          </p>
        </div>
        <div className="grid gap-6">
          <AuthForm type="signup" />
        </div>
        <p className="text-muted-foreground px-8 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="hover:text-primary underline underline-offset-4">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
