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
import { FormValues, formSchema, ClarifyOutput, ChallengeOutput } from './schema'
import { generateClarifyOrChallenge } from './services'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ClarifyOrChallenge() {
  const [response, setResponse] = useState<ClarifyOutput | ChallengeOutput | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mode: undefined,
      level: undefined,
      topic: '',
      consent: false,
    },
  })

  async function onSubmit(data: FormValues) {
    setIsGenerating(true)
    setResponse(null)
    setError(null)

    try {
      // Use our service to generate the response
      const result = await generateClarifyOrChallenge(data)

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

  // Enhanced renderer for the clarify output format with improved styling
  const renderClarifyOutput = (data: ClarifyOutput) => {
    return (
      <div className="space-y-6">
        {/* Title Card */}
        <Card className="overflow-hidden rounded-xl shadow-sm">
          <CardHeader className="bg-primary/10 border-b p-4">
            <CardTitle className="text-primary flex items-center text-xl font-semibold tracking-tight">
              Clarify
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-primary mb-2 text-lg font-semibold">Main Argument</h3>
            <p>{data.main_argument}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-primary mb-4 text-lg font-semibold">Key Concepts</h3>
            <div className="space-y-4">
              {data.key_concepts.map((concept, index) => (
                <div key={index} className="border-b pb-3 last:border-0">
                  <h4 className="text-secondary font-medium">{concept.title}</h4>
                  <p className="text-muted-foreground">{concept.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-primary mb-2 text-lg font-semibold">Critical Details</h3>
            <ul className="marker:text-secondary list-disc space-y-1 pl-5">
              {data.critical_details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-primary mb-4 text-lg font-semibold">Applications in Practice</h3>
            <div className="space-y-4">
              {data.applications_in_practice.map((application, index) => (
                <div key={index} className="border-b pb-3 last:border-0">
                  <h4 className="text-secondary font-medium">{application.example}</h4>
                  <p className="text-muted-foreground">{application.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Enhanced renderer for the challenge output format with improved styling
  const renderChallengeOutput = (data: ChallengeOutput) => {
    return (
      <div className="space-y-6">
        {/* Title Card */}
        <Card className="overflow-hidden rounded-xl shadow-sm">
          <CardHeader className="bg-primary/10 border-b p-4">
            <CardTitle className="text-primary flex items-center text-xl font-semibold tracking-tight">
              Challenge
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-primary mb-2 text-lg font-semibold">
              Critical Reflection Questions
            </h3>
            <ul className="marker:text-secondary list-disc space-y-1 pl-5">
              {data.critical_reflection_questions.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-primary mb-4 text-lg font-semibold">Advanced Concepts</h3>
            <div className="space-y-4">
              {data.advanced_concepts.map((item, index) => (
                <div key={index} className="border-b pb-3 last:border-0">
                  <h4 className="text-secondary font-medium">{item.concept}</h4>
                  <p className="text-muted-foreground">{item.explanation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-primary mb-4 text-lg font-semibold">
              Interdisciplinary Connections
            </h3>
            <div className="space-y-4">
              {data.interdisciplinary_connections.map((item, index) => (
                <div key={index} className="border-b pb-3 last:border-0">
                  <h4 className="text-secondary font-medium">{item.field}</h4>
                  <p className="text-muted-foreground">{item.connection}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-primary mb-2 text-lg font-semibold">Counterarguments</h3>
            <ul className="marker:text-secondary list-disc space-y-1 pl-5">
              {data.counterarguments.map((argument, index) => (
                <li key={index}>{argument}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-primary mb-2 text-lg font-semibold">Future Challenges</h3>
            <ul className="marker:text-secondary list-disc space-y-1 pl-5">
              {data.future_challenges.map((challenge, index) => (
                <li key={index}>{challenge}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render the appropriate response based on the data structure
  const renderResponse = () => {
    if (error) {
      return <div className="text-red-500">{error}</div>
    }

    if (!response) {
      return null
    }

    // Log which response type is being rendered
    console.log(
      'Response type being rendered:',
      'main_argument' in response
        ? 'Clarify'
        : 'critical_reflection_questions' in response
          ? 'Challenge'
          : 'Unknown'
    )

    // Check if it's a clarify response
    if ('main_argument' in response) {
      return renderClarifyOutput(response as ClarifyOutput)
    }

    // Check if it's a challenge response
    if ('critical_reflection_questions' in response) {
      return renderChallengeOutput(response as ChallengeOutput)
    }

    // Fallback for unexpected format
    return <div>Invalid response format</div>
  }

  const inputForm = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="mode"
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Mode</RequiredLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="clarify">Clarify</SelectItem>
                    <SelectItem value="challenge">Challenge</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Difficulty Level</RequiredLabel>
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

        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <RequiredLabel>Topic</RequiredLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the topic you want to clarify or challenge"
                  className="min-h-[120px]"
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
      toolName="Clarify or Challenge"
      description="Engage in critical thinking exercises by clarifying concepts or challenging ideas"
      inputForm={inputForm}
      onGenerate={form.handleSubmit(onSubmit)}
      isGenerating={isGenerating}
      response={renderResponse()}
      disableGenerate={!form.formState.isValid}
    />
  )
}
