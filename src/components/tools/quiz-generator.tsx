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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RequiredLabel } from './required-label'

// Define the Bloom's Taxonomy levels
const bloomsLevels = [
  { id: 'remember', label: 'Remember' },
  { id: 'understand', label: 'Understand' },
  { id: 'apply', label: 'Apply' },
  { id: 'analyse', label: 'Analyse' },
  { id: 'evaluate', label: 'Evaluate' },
  { id: 'create', label: 'Create' },
]

// Define the question types
const questionTypes = [
  { id: 'multiple-choice', label: 'Multiple Choice' },
  { id: 'true-false', label: 'True/False' },
  { id: 'short-answer', label: 'Short Answer' },
  { id: 'fill-in-the-blanks', label: 'Fill in the Blanks' },
]

// Define the form schema
const formSchema = z.object({
  topic: z.string().min(3, {
    message: 'Topic must be at least 3 characters',
  }),
  subject: z.string().min(3, {
    message: 'Subject must be at least 3 characters',
  }),
  yearGroup: z.coerce
    .number()
    .min(1, { message: 'Year group must be at least 1' })
    .max(13, { message: 'Year group must be at most 13' }),
  bloomsLevels: z.array(z.string()).min(1, {
    message: "Select at least one Bloom's Taxonomy level",
  }),
  questionTypes: z.array(z.string()).min(1, {
    message: 'Select at least one question type',
  }),
  numberOfQuestions: z.coerce
    .number()
    .min(1, { message: 'Number of questions must be at least 1' })
    .max(20, { message: 'Number of questions must be at most 20' }),
  difficultyLevel: z.enum(['easy', 'medium', 'hard'], {
    required_error: 'Please select a difficulty level',
  }),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the consent statement',
  }),
})

type FormValues = z.infer<typeof formSchema>

export function QuizGenerator() {
  const [response, setResponse] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      subject: '',
      yearGroup: 7,
      bloomsLevels: [],
      questionTypes: [],
      numberOfQuestions: 5,
      difficultyLevel: undefined,
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
      const selectedBlooms = data.bloomsLevels
        .map((id) => bloomsLevels.find((level) => level.id === id)?.label)
        .filter(Boolean)

      const selectedTypes = data.questionTypes
        .map((id) => questionTypes.find((type) => type.id === id)?.label)
        .filter(Boolean)

      // Generate mock questions based on the selected types
      const questions = []

      for (let i = 1; i <= data.numberOfQuestions; i++) {
        const questionType =
          data.questionTypes[Math.floor(Math.random() * data.questionTypes.length)]
        let question = ''

        switch (questionType) {
          case 'multiple-choice':
            question = `**Question ${i} (Multiple Choice):**
What is a key characteristic of ${data.topic} in the context of ${data.subject}?

A) First possible answer
B) Second possible answer
C) Third possible answer
D) Fourth possible answer

**Answer:** B`
            break
          case 'true-false':
            question = `**Question ${i} (True/False):**
${data.topic} is primarily associated with developments in the 20th century.

**Answer:** True`
            break
          case 'short-answer':
            question = `**Question ${i} (Short Answer):**
Explain how ${data.topic} relates to ${data.subject} in approximately 2-3 sentences.

**Sample Answer:** ${data.topic} is a fundamental concept in ${data.subject} because it explains how certain processes work. It was developed through extensive research and has applications in various contexts.`
            break
          case 'fill-in-the-blanks':
            question = `**Question ${i} (Fill in the Blanks):**
The process of ${data.topic} involves three main steps: ________, ________, and ________.

**Answers:** initialization, transformation, conclusion`
            break
          default:
            question = `**Question ${i}:**
Explain the significance of ${data.topic} in ${data.subject}.`
        }

        questions.push(question)
      }

      const responseText = `# Quiz on ${data.topic}

**Subject:** ${data.subject}
**Year Group:** ${data.yearGroup}
**Difficulty Level:** ${data.difficultyLevel}
**Bloom's Taxonomy Levels:** ${selectedBlooms.join(', ')}
**Question Types:** ${selectedTypes.join(', ')}

## Questions

${questions.join('\n\n')}

## Quiz Summary

This quiz contains ${data.numberOfQuestions} questions on ${data.topic} for Year ${data.yearGroup} students. The questions are designed at a ${data.difficultyLevel} difficulty level and cover the following Bloom's Taxonomy levels: ${selectedBlooms.join(', ')}.

## Instructions for Students

- Read each question carefully before answering
- For multiple-choice questions, select the best answer from the options provided
- For short-answer questions, provide concise and relevant responses
- For fill-in-the-blanks questions, complete each blank with the appropriate term
- For true/false questions, indicate whether the statement is true or false`

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
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Topic</RequiredLabel>
                <FormControl>
                  <Input placeholder="Enter the quiz topic" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Subject</RequiredLabel>
                <FormControl>
                  <Input placeholder="Enter the subject" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="yearGroup"
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Year Group</RequiredLabel>
                <FormControl>
                  <Input type="number" min={1} max={13} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
            name="difficultyLevel"
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Difficulty Level</RequiredLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select difficulty" />
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

        <div>
          <RequiredLabel>Question Types</RequiredLabel>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {questionTypes.map((type) => (
              <FormField
                key={type.id}
                control={form.control}
                name="questionTypes"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(type.id)}
                        onCheckedChange={(checked) => {
                          const currentValues = field.value || []
                          return checked
                            ? field.onChange([...currentValues, type.id])
                            : field.onChange(currentValues.filter((value) => value !== type.id))
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{type.label}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
          <FormMessage>{form.formState.errors.questionTypes?.message}</FormMessage>
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
      toolName="Quiz Generator"
      description="Create customised quizzes with various question types"
      inputForm={inputForm}
      onGenerate={form.handleSubmit(onSubmit)}
      isGenerating={isGenerating}
      response={response}
      disableGenerate={!form.formState.isValid}
    />
  )
}
