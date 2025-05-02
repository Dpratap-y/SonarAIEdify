'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
})

const signupSchema = loginSchema.extend({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
})

type LoginFormValues = z.infer<typeof loginSchema>
type SignupFormValues = z.infer<typeof signupSchema>

interface AuthFormProps {
  type: 'login' | 'signup'
}

export function AuthForm({ type }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const isLogin = type === 'login'
  const schema = isLogin ? loginSchema : signupSchema

  const form = useForm<LoginFormValues | SignupFormValues>({
    resolver: zodResolver(schema),
    defaultValues: isLogin
      ? { email: '', password: '' }
      : { email: '', password: '', fullName: '' },
  })

  async function onSubmit(data: LoginFormValues | SignupFormValues) {
    setIsLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })

        if (error) throw error

        router.push('/dashboard')
        router.refresh()
      } else {
        const signupData = data as SignupFormValues

        const { error } = await supabase.auth.signUp({
          email: signupData.email,
          password: signupData.password,
          options: {
            data: {
              full_name: signupData.fullName,
            },
          },
        })

        if (error) throw error

        toast.success('Account created successfully', {
          description: 'Please check your email to verify your account.',
        })

        router.push('/login')
      }
    } catch (error) {
      console.error('Authentication error:', error)
      toast.error('Authentication failed', {
        description: error instanceof Error ? error.message : 'Something went wrong',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!isLogin && (
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isLogin ? 'Logging in...' : 'Signing up...'}
            </>
          ) : isLogin ? (
            'Log in'
          ) : (
            'Sign up'
          )}
        </Button>
      </form>
    </Form>
  )
}
