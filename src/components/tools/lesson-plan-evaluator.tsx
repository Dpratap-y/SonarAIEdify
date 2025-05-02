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
import { Checkbox } from '@/components/ui/checkbox'
import { RequiredLabel } from '@/components/tools/required-label'

// Define the form schema
const formSchema = z.object({
  lessonPlanName: z.string().min(3, {
    message: 'Lesson plan name must be at least 3 characters',
  }),
  file: z.any().refine((file) => file, {
    message: 'Please upload a file',
  }),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the consent statement',
  }),
})

type FormValues = z.infer<typeof formSchema>

export function LessonPlanEvaluator() {
  const [response, setResponse] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lessonPlanName: '',
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
      const responseText = `# Lesson Plan Evaluation: ${data.lessonPlanName}

## Overview
This evaluation provides a comprehensive analysis of the submitted lesson plan, highlighting strengths, areas for improvement, and specific recommendations to enhance its effectiveness.

## Strengths

1. **Clear Learning Objectives**
   - The learning objectives are specific, measurable, and aligned with curriculum standards
   - They appropriately challenge students at their developmental level
   - There is a clear progression from basic understanding to higher-order thinking

2. **Engaging Instructional Strategies**
   - The lesson incorporates a variety of teaching methods to address different learning styles
   - The activities promote active student participation and engagement
   - The plan includes effective use of questioning techniques to stimulate critical thinking

3. **Well-Structured Lesson Flow**
   - The lesson has a logical sequence with clear transitions between activities
   - Time allocations for each section are appropriate and realistic
   - The plan includes effective opening and closing activities

## Areas for Development

1. **Differentiation Opportunities**
   - The plan could better address the needs of diverse learners
   - Consider adding more tiered activities to accommodate different ability levels
   - Additional support strategies for struggling students would strengthen the plan

2. **Assessment Alignment**
   - Some assessment methods could be more closely aligned with the stated learning objectives
   - Consider incorporating more formative assessment opportunities throughout the lesson
   - The success criteria could be more explicitly communicated to students

3. **Resource Utilization**
   - Some instructional materials could be more effectively integrated into the lesson
   - Consider incorporating more diverse resources to enhance engagement
   - Digital tools could be better leveraged to support learning objectives

## Specific Recommendations

1. **Enhance Differentiation**
   - Add extension activities for advanced learners
   - Include scaffolded worksheets for students who need additional support
   - Incorporate flexible grouping strategies based on student needs

2. **Strengthen Assessment Practices**
   - Develop clear success criteria that students can understand and use for self-assessment
   - Add 2-3 strategic check-in points during the lesson to gauge understanding
   - Create an exit ticket that directly measures progress toward the learning objectives

3. **Improve Engagement Strategies**
   - Incorporate a relevant real-world connection at the beginning of the lesson
   - Add a collaborative problem-solving component to increase student interaction
   - Include a reflection activity to help students process their learning

4. **Enhance Instructional Materials**
   - Develop a visual anchor chart to support key concepts
   - Include examples and non-examples to clarify understanding
   - Create a digital resource that students can access for review

## Overall Evaluation

This lesson plan demonstrates thoughtful planning and a solid understanding of effective teaching practices. With the suggested enhancements, particularly in the areas of differentiation and assessment, this lesson has the potential to provide a highly effective learning experience for all students.

**Evaluation Score: 8/10**

## Next Steps

Consider implementing the recommendations above, particularly focusing on:
1. Enhancing differentiation strategies
2. Aligning assessments more closely with learning objectives
3. Incorporating more opportunities for student reflection and self-assessment

After revising the plan, consider peer review or collaborative planning to further refine the lesson.`

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
          name="lessonPlanName"
          render={({ field }) => (
            <FormItem>
              <RequiredLabel>Lesson Plan Name</RequiredLabel>
              <FormControl>
                <Input placeholder="Enter the name of your lesson plan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <RequiredLabel>Upload File (pdf, doc, docx)</RequiredLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
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
      toolName="Lesson Plan Evaluator"
      description="Evaluate and refine lesson plans for effectiveness"
      inputForm={inputForm}
      onGenerate={form.handleSubmit(onSubmit)}
      isGenerating={isGenerating}
      response={response}
      disableGenerate={!form.formState.isValid}
    />
  )
}
