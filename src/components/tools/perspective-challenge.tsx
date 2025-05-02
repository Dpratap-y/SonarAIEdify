'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ToolLayout } from '@/components/tools/tool-interface'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RequiredLabel } from './required-label'

// Define the form schema
const formSchema = z.object({
  perspective: z.string().min(10, {
    message: 'Your perspective must be at least 10 characters',
  }),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the consent statement',
  }),
})

type FormValues = z.infer<typeof formSchema>

export function PerspectiveChallenge() {
  const [response, setResponse] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      perspective: '',
      consent: false,
    },
  })

  async function onSubmit(data: FormValues) {
    setIsGenerating(true)
    setResponse(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a mock response based on the form data
      const responseText = `# Perspective Challenge

## Your Perspective
"${data.perspective}"

## Alternative Perspectives

### Perspective 1: Opposing View
Have you considered that the opposite might be true? From this perspective, one could argue that ${data.perspective.toLowerCase().includes('not') ? data.perspective.replace('not', '') : 'not ' + data.perspective}

This view is supported by the following considerations:
- Different cultural and historical contexts might lead to different interpretations
- The underlying assumptions in your perspective might be questioned
- There may be empirical evidence that contradicts some aspects of your view

### Perspective 2: Nuanced Middle Ground
Rather than viewing this as a binary issue, consider a more nuanced approach that acknowledges:
- Both your perspective and its opposite contain valid insights
- The context and specific circumstances greatly influence which view is more applicable
- A synthesis of multiple perspectives might provide a more comprehensive understanding

### Perspective 3: Completely Different Angle
What if we reframe the entire question? Instead of focusing on ${data.perspective.split(' ').slice(0, 3).join(' ')}..., we might consider:
- How this issue connects to broader systemic factors
- Whether the framing of the issue itself contains hidden assumptions
- If there are stakeholders or perspectives that are typically overlooked in this discussion

## Thought-Provoking Questions

1. What evidence would change your mind about your current perspective?
2. How might your personal experiences or background influence your view on this matter?
3. What are the strongest arguments against your perspective, and how would you respond to them?
4. How might your perspective evolve over time or in different contexts?

## Next Steps for Critical Thinking

- Research perspectives that differ from your own
- Engage in discussions with people who hold different views
- Look for empirical evidence both supporting and challenging your perspective
- Consider how different ethical frameworks might approach this issue`

      setResponse(responseText)
    } catch (error) {
      console.error('Error generating response:', error)
      setResponse('An error occurred while generating the response. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const inputForm = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="perspective"
          render={({ field }) => (
            <FormItem>
              <RequiredLabel>Enter Your Perspective</RequiredLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your perspective or viewpoint on a topic"
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-3">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I verify that I have not used any personal data such as student names or private
                  information. Instead of names, I have referred to them as student, pupil or
                  similar.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )

  return (
    <ToolLayout
      toolName="Perspective Challenge"
      description="Test and expand your viewpoints with thought-provoking questions"
      inputForm={inputForm}
      onGenerate={form.handleSubmit(onSubmit)}
      isGenerating={isGenerating}
      response={response}
      disableGenerate={!form.formState.isValid}
    />
  )
}
