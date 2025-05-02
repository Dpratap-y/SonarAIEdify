'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ToolLayout } from '@/components/tools/tool-interface'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RequiredLabel } from '@/components/tools/required-label'
import { Input } from '@/components/ui/input'
import { FormValues, formSchema } from './schema'
import { generatePEELParagraph } from './services'
import { PEELGeneratorResponse } from './schema/response-schema'
import { PeelResponse } from './components'

export function PeelGenerator() {
  const [response, setResponse] = useState<PEELGeneratorResponse | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      subjectArea: '',
      complexityLevel: undefined,
      tone: undefined,
      targetAudience: undefined,
      minWordCount: 150,
      maxWordCount: 300,
      consent: false,
    },
  })

  async function onSubmit(data: FormValues) {
    setIsGenerating(true)
    setResponse(null)
    setError(null)

    try {
      // Use our service to generate the response
      const result = await generatePEELParagraph(data)

      if (result.error) {
        setError(result.error)
      } else if (result.data) {
        // Log the full response data for debugging
        console.log('Full API response data:', JSON.stringify(result.data, null, 2))
        setResponse(result.data)
      }
    } catch (error) {
      console.error('Error generating response:', error)
      setError('An error occurred while generating the response. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Render the appropriate response
  const renderResponse = () => {
    if (error) {
      return <div className="text-red-500">{error}</div>
    }

    if (!response) {
      return null
    }

    return <PeelResponse data={response} />
  }

  const inputForm = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <RequiredLabel>Topic</RequiredLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the topic for your PEEL paragraph"
                  className="min-h-[80px]"
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
            name="subjectArea"
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Subject Area</RequiredLabel>
                <FormControl>
                  <Input placeholder="e.g. History, Biology, Literature" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="complexityLevel"
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Complexity Level</RequiredLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="tone"
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Tone</RequiredLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="explanatory">Explanatory</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetAudience"
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Target Audience</RequiredLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select target audience" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="key-stage-3">Key Stage 3</SelectItem>
                    <SelectItem value="gcse">GCSE</SelectItem>
                    <SelectItem value="a-level">A-Level</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="minWordCount"
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Minimum Word Count</RequiredLabel>
                <FormControl>
                  <Input type="number" min={50} max={500} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxWordCount"
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Maximum Word Count</RequiredLabel>
                <FormControl>
                  <Input type="number" min={100} max={1000} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
      toolName="PEEL Paragraph Generator"
      description="Generate structured PEEL (Point, Evidence, Explanation, Link) paragraphs for educational writing"
      inputForm={inputForm}
      onGenerate={form.handleSubmit(onSubmit)}
      isGenerating={isGenerating}
      response={renderResponse()}
      disableGenerate={!form.formState.isValid}
    />
  )
}
