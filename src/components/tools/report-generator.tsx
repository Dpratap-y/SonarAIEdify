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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RequiredLabel } from './required-label'

// Define the form schema
const formSchema = z.object({
  studentId: z.string().min(1, {
    message: 'Student ID is required',
  }),
  strengths: z.string().min(10, {
    message: 'Student strengths must be at least 10 characters',
  }),
  areasForDevelopment: z.string().min(10, {
    message: 'Areas for development must be at least 10 characters',
  }),
  overallProgress: z.string().min(10, {
    message: 'Overall progress must be at least 10 characters',
  }),
  wordCount: z.coerce
    .number()
    .min(50, { message: 'Word count must be at least 50' })
    .max(500, { message: 'Word count must be at most 500' }),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the consent statement',
  }),
})

type FormValues = z.infer<typeof formSchema>

export function ReportGenerator() {
  const [response, setResponse] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: '',
      strengths: '',
      areasForDevelopment: '',
      overallProgress: '',
      wordCount: 250,
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
      const responseText = `# Student Progress Report

**Student ID:** ${data.studentId}
**Report Date:** ${new Date().toLocaleDateString()}
**Word Count:** ${data.wordCount}

## Academic Strengths

${data.strengths}

The student has demonstrated exceptional abilities in critical thinking and problem-solving. Their work consistently shows attention to detail and a thorough understanding of core concepts. They actively participate in class discussions and contribute valuable insights.

## Areas for Development

${data.areasForDevelopment}

While the student shows strong conceptual understanding, there are opportunities for growth in applying these concepts to new contexts. Developing more structured study habits and improving time management would help maximize their potential.

## Overall Progress

${data.overallProgress}

The student has made significant progress this term, showing improvement in both academic performance and engagement. Their dedication to learning is evident in the quality of their work and their willingness to seek help when needed.

## Recommendations

1. Continue to build on existing strengths by taking on more challenging tasks
2. Develop a structured study plan to address areas for improvement
3. Participate in additional extracurricular activities related to areas of interest
4. Schedule regular check-ins to monitor progress and adjust strategies as needed

This report has been generated based on ongoing assessment and observation. It is intended to provide constructive feedback to support the student's continued growth and development.`

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
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <RequiredLabel>Student ID</RequiredLabel>
              <FormControl>
                <Input placeholder="Enter student ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="strengths"
          render={({ field }) => (
            <FormItem>
              <RequiredLabel>Student Strengths</RequiredLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the student's strengths"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="areasForDevelopment"
          render={({ field }) => (
            <FormItem>
              <RequiredLabel>Areas for Development</RequiredLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe areas where the student can improve"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="overallProgress"
          render={({ field }) => (
            <FormItem>
              <RequiredLabel>Overall Progress</RequiredLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the student's overall progress"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="wordCount"
          render={({ field }) => (
            <FormItem>
              <RequiredLabel>Report Word Count (50-500)</RequiredLabel>
              <FormControl>
                <Input type="number" min={50} max={500} {...field} />
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
      toolName="Report Generator"
      description="Generate detailed student progress reports"
      inputForm={inputForm}
      onGenerate={form.handleSubmit(onSubmit)}
      isGenerating={isGenerating}
      response={response}
      disableGenerate={!form.formState.isValid}
    />
  )
}
