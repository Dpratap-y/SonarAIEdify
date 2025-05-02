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
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RequiredLabel } from '@/components/tools/required-label'
import { focusAreas } from './constants'
import { formSchema, FormValues } from './schema'
import { generatePromptSuggestions } from './services'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RefinedPrompt, PromptGeneratorResponse } from './schema/response-schema'
import { Badge } from '@/components/ui/badge'

export function PromptGenerator() {
  const [response, setResponse] = useState<PromptGeneratorResponse | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originalPrompt: '',
      focusAreas: [],
      consent: false,
    },
  })

  async function onSubmit(data: FormValues) {
    setIsGenerating(true)
    setResponse(null)
    setError(null)

    try {
      // Use our service to generate the response
      const result = await generatePromptSuggestions(data)

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

  // Renderer for the prompt suggestions output
  const renderPromptOutput = (responseData: PromptGeneratorResponse) => {
    // Extract prompts and original prompt depending on response structure
    let prompts: RefinedPrompt[]
    let originalPrompt: string

    if ('data' in responseData) {
      // Option 1: Standard response with data object
      prompts = responseData.data.refinedPrompts
      originalPrompt = responseData.data.originalPrompt
    } else {
      // Option 2: Direct refinedPrompts object
      prompts = responseData.refinedPrompts
      originalPrompt = form.getValues().originalPrompt // Fallback to form value
    }

    return (
      <div className="space-y-6">
        {/* Original Prompt Card */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/50 border-b p-4">
            <CardTitle className="text-muted-foreground text-lg font-medium">
              Original Prompt
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <p className="text-base">{originalPrompt}</p>
          </CardContent>
        </Card>

        {/* Title Card */}
        <Card className="overflow-hidden rounded-xl shadow-sm">
          <CardHeader className="bg-primary/10 border-b p-4">
            <CardTitle className="text-primary flex items-center text-xl font-semibold tracking-tight">
              Refined Prompts
            </CardTitle>
          </CardHeader>
        </Card>

        {prompts.map((prompt, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="bg-secondary/10 border-b p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-secondary text-lg font-medium">
                  Refined Version {index + 1}
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                    Refined Level: {prompt.explanation.complexityLevel.refinedLevel}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 hover:bg-green-100"
                  >
                    Bloom&apos;s: {prompt.explanation.complexityLevel.bloomsLevel}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="space-y-4">
                <div>
                  <h3 className="text-primary mb-2 font-semibold">Prompt Text</h3>
                  <p className="text-muted-foreground text-base">{prompt.promptText}</p>
                </div>

                <div>
                  <h3 className="text-primary mb-2 font-semibold">Explanation</h3>
                  <p className="text-muted-foreground text-sm">{prompt.explanation.explanation}</p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-primary mb-2 font-semibold">Focus Areas</h3>
                    <ul className="list-inside list-disc text-sm">
                      {prompt.explanation.focusAreas.map((area, i) => (
                        <li key={i} className="text-muted-foreground">
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Render the appropriate response
  const renderResponse = () => {
    if (error) {
      return <div className="text-red-500">{error}</div>
    }

    if (!response) {
      return null
    }

    return renderPromptOutput(response)
  }

  const inputForm = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="originalPrompt"
          render={({ field }) => (
            <FormItem>
              <RequiredLabel>Original Prompt</RequiredLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your original prompt here"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Focus Areas (Optional)</FormLabel>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {focusAreas.map((area) => (
              <FormField
                key={area.id}
                control={form.control}
                name="focusAreas"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(area.id)}
                        onCheckedChange={(checked) => {
                          const currentValues = field.value || []
                          return checked
                            ? field.onChange([...currentValues, area.id])
                            : field.onChange(currentValues.filter((value) => value !== area.id))
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{area.label}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
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
      toolName="Prompt Generator"
      description="Generate engaging educational prompts for discussions"
      inputForm={inputForm}
      onGenerate={form.handleSubmit(onSubmit)}
      isGenerating={isGenerating}
      response={renderResponse()}
      disableGenerate={!form.formState.isValid}
    />
  )
}
