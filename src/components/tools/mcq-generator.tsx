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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { RequiredLabel } from '@/components/tools/required-label'

// Define the Bloom's Taxonomy levels
const bloomsLevels = [
  { id: 'remembering', label: 'Remembering' },
  { id: 'understanding', label: 'Understanding' },
  { id: 'applying', label: 'Applying' },
  { id: 'analysing', label: 'Analysing' },
  { id: 'evaluating', label: 'Evaluating' },
  { id: 'creating', label: 'Creating' },
]

// Define the form schema
const formSchema = z
  .object({
    inputMethod: z.enum(['topic', 'document'], {
      required_error: 'Please select an input method',
    }),
    topic: z.string().min(5, 'Topic must be at least 5 characters').optional(),
    document: z.any().optional(),
    bloomsLevels: z.array(z.string()).min(1, {
      message: "Select at least one Bloom's Taxonomy level",
    }),
    numberOfQuestions: z.coerce
      .number()
      .min(1, { message: 'Number of questions must be at least 1' })
      .max(20, { message: 'Number of questions must be at most 20' }),
    answersPerQuestion: z.string({
      required_error: 'Please select the number of answers per question',
    }),
    difficultyLevel: z.enum(['easy', 'medium', 'hard'], {
      required_error: 'Please select a difficulty level',
    }),
    consent: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the consent statement',
    }),
  })
  .refine(
    (data) => {
      if (data.inputMethod === 'topic') {
        return !!data.topic
      }
      if (data.inputMethod === 'document') {
        return !!data.document
      }
      return true
    },
    {
      message: 'Please provide either a topic or upload a document',
      path: ['topic'],
    }
  )

type FormValues = z.infer<typeof formSchema>

export function MCQGenerator() {
  const [response, setResponse] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inputMethod: 'topic',
      topic: '',
      bloomsLevels: [],
      numberOfQuestions: 5,
      answersPerQuestion: '',
      difficultyLevel: undefined,
      consent: false,
    },
  })

  const watchInputMethod = form.watch('inputMethod')

  async function onSubmit(data: FormValues) {
    setIsGenerating(true)
    setResponse(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a mock response based on the form data
      const selectedBlooms = data.bloomsLevels
        .map((id) => bloomsLevels.find((level) => level.id === id)?.label)
        .filter(Boolean)

      // Generate mock questions based on the selected Bloom's levels and number of answers
      const questions: string[] = []
      const numAnswers = Number.parseInt(data.answersPerQuestion)

      for (let i = 1; i <= data.numberOfQuestions; i++) {
        // Randomly select a Bloom's level for this question
        const randomBloomLevel =
          data.bloomsLevels[Math.floor(Math.random() * data.bloomsLevels.length)]
        const bloomLabel = bloomsLevels.find((bl) => bl.id === randomBloomLevel)?.label

        // Generate options based on number of answers per question
        const options = []
        const correctOption = String.fromCharCode(65 + Math.floor(Math.random() * numAnswers))

        for (let j = 0; j < numAnswers; j++) {
          const optionLetter = String.fromCharCode(65 + j)
          options.push(
            `${optionLetter}) ${optionLetter === correctOption ? 'Correct answer option' : `Distractor option ${j + 1}`}`
          )
        }

        const question = `**Question ${i} (${bloomLabel}):**
What is a key aspect of ${data.topic || 'the topic'} that relates to ${randomBloomLevel === 'remembering' ? 'basic facts' : randomBloomLevel === 'understanding' ? 'comprehension' : randomBloomLevel === 'applying' ? 'application' : randomBloomLevel === 'analysing' ? 'analysis' : randomBloomLevel === 'evaluating' ? 'evaluation' : 'creation'}?

${options.join('\n')}

**Correct Answer:** ${correctOption}`

        questions.push(question)
      }

      const responseText = `# Multiple Choice Questions on ${data.topic || 'Uploaded Document'}

**Difficulty Level:** ${data.difficultyLevel}
**Bloom's Taxonomy Levels:** ${selectedBlooms.join(', ')}
**Number of Questions:** ${data.numberOfQuestions}
**Answers per Question:** ${data.answersPerQuestion}

## Questions

${questions.join('\n\n')}

## Answer Key

${Array.from({ length: data.numberOfQuestions }, (_, i) => {
  const questionNum = i + 1
  const answer = questions[i].split('**Correct Answer:**')[1].trim()
  return `${questionNum}. ${answer}`
}).join('\n')}

## Usage Guide

These multiple-choice questions are designed to assess understanding of ${data.topic || 'the uploaded document'} at various cognitive levels. The questions range from basic recall to higher-order thinking skills based on Bloom's Taxonomy.

### For Students:
- Attempt all questions without referring to notes first
- Review incorrect answers and identify knowledge gaps
- Use as a self-assessment tool before exams

### For Educators:
- Use as formative or summative assessment
- Modify questions to suit specific learning objectives
- Analyze student performance to identify areas needing additional instruction`

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
          name="inputMethod"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <RequiredLabel>Input Method</RequiredLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-y-0 space-x-3">
                    <FormControl>
                      <RadioGroupItem value="topic" />
                    </FormControl>
                    <FormLabel className="font-normal">Enter Topic</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-y-0 space-x-3">
                    <FormControl>
                      <RadioGroupItem value="document" />
                    </FormControl>
                    <FormLabel className="font-normal">Upload Document</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchInputMethod === 'topic' && (
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Topic or Concept</RequiredLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the topic or concept for question generation"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {watchInputMethod === 'document' && (
          <FormField
            control={form.control}
            name="document"
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Upload Document</RequiredLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      field.onChange(file)
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div>
          <RequiredLabel>Bloom&apos;s Taxonomy Levels</RequiredLabel>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {bloomsLevels.map((level) => (
              <FormField
                key={level.id}
                control={form.control}
                name="bloomsLevels"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(level.id)}
                        onCheckedChange={(checked) => {
                          const currentValues = field.value || []
                          return checked
                            ? field.onChange([...currentValues, level.id])
                            : field.onChange(currentValues.filter((value) => value !== level.id))
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{level.label}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
          <FormMessage>{form.formState.errors.bloomsLevels?.message}</FormMessage>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="numberOfQuestions"
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Number of Questions</RequiredLabel>
                <FormControl>
                  <Input type="number" min={1} max={20} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="answersPerQuestion"
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Answers per Question</RequiredLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select number" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="3">3 answers</SelectItem>
                    <SelectItem value="4">4 answers</SelectItem>
                    <SelectItem value="5">5 answers</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="difficultyLevel"
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
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
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
      toolName="MCQ Generator"
      description="Create multiple-choice questions with varying complexity levels"
      inputForm={inputForm}
      onGenerate={form.handleSubmit(onSubmit)}
      isGenerating={isGenerating}
      response={response}
      disableGenerate={!form.formState.isValid}
    />
  )
}
