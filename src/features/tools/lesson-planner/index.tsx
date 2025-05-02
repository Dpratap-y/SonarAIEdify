'use client'

import React, { useState, ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { formSchema, type FormValues } from './schema/form-schema'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RequiredLabel } from '@/components/tools/required-label'
import { differentiationOptions, senConsiderations } from './constants'
import LessonPlanMarkdown from './components/lesson-planner-markdown'
import { generateLessonPlan } from './services/lesson-planner-service'
import { ToolLayout } from '@/components/tools/tool-interface'

export function LessonPlanner() {
  const [renderedResponse, setRenderedResponse] = useState<ReactNode | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lessonTopic: '',
      subject: '',
      learningObjectives: '',
      yearGroup: '',
      duration: 30,
      enableDifferentiation: false,
      differentiation: [],
      enableSEN: false,
      senConsiderations: [],
      consent: false,
    },
  })

  const watchEnableDifferentiation = form.watch('enableDifferentiation')
  const watchEnableSEN = form.watch('enableSEN')

  async function onSubmit(data: FormValues) {
    setIsGenerating(true)
    setRenderedResponse(null)
    setError(null)

    try {
      const { markdown, error } = await generateLessonPlan(data)

      if (error) {
        setError(error)
        setRenderedResponse(null)
        return
      }

      setRenderedResponse(<LessonPlanMarkdown content={markdown} />)
    } catch (error) {
      console.error('Error generating lesson plan:', error)
      setError(
        error instanceof Error
          ? error.message
          : 'An error occurred while generating the response. Please try again.'
      )
      setRenderedResponse(null)
    } finally {
      setIsGenerating(false)
    }
  }

  const inputForm = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="lessonTopic"
          render={({ field }) => (
            <FormItem>
              <RequiredLabel>Lesson Topic</RequiredLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the main topic of your lesson"
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <RequiredLabel>Subject</RequiredLabel>
              <FormControl>
                <Input placeholder="e.g. Mathematics, Science, English" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="learningObjectives"
          render={({ field }) => (
            <FormItem>
              <RequiredLabel>Learning Objectives</RequiredLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the learning objectives for this lesson"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="yearGroup"
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Year Group</RequiredLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select year group" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 13 }, (_, i) => i + 1).map((year) => (
                      <SelectItem key={year} value={`Year ${year}`}>
                        Year {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Duration (minutes)</RequiredLabel>
                <FormControl>
                  <Input type="number" min={5} max={60} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="enableDifferentiation"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Enable Differentiation Options</FormLabel>
              </div>
            </FormItem>
          )}
        />

        {watchEnableDifferentiation && (
          <div className="ml-6 space-y-4">
            <FormLabel>Differentiation</FormLabel>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {differentiationOptions.map((option) => (
                <FormField
                  key={option.id}
                  control={form.control}
                  name="differentiation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(option.id)}
                          onCheckedChange={(checked) => {
                            const currentValues = field.value || []
                            return checked
                              ? field.onChange([...currentValues, option.id])
                              : field.onChange(currentValues.filter((value) => value !== option.id))
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">{option.label}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="enableSEN"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Enable SEN Considerations</FormLabel>
              </div>
            </FormItem>
          )}
        />

        {watchEnableSEN && (
          <div className="ml-6 space-y-4">
            <FormLabel>SEN Considerations</FormLabel>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {senConsiderations.map((option) => (
                <FormField
                  key={option.id}
                  control={form.control}
                  name="senConsiderations"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(option.id)}
                          onCheckedChange={(checked) => {
                            const currentValues = field.value || []
                            return checked
                              ? field.onChange([...currentValues, option.id])
                              : field.onChange(currentValues.filter((value) => value !== option.id))
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">{option.label}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
        )}

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
      toolName="Lesson Planner"
      description="Create comprehensive lesson plans with learning objectives and activities"
      inputForm={inputForm}
      onGenerate={form.handleSubmit(onSubmit)}
      isGenerating={isGenerating}
      response={renderedResponse}
      disableGenerate={!form.formState.isValid}
      error={error}
    />
  )
}
