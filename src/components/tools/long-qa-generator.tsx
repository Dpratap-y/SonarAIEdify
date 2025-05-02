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
    questionsPerLevel: z.string({
      required_error: 'Please select the number of questions per level',
    }),
    complexityLevel: z.enum(['key-stage-3', 'key-stage-4', 'advanced'], {
      required_error: 'Please select a complexity level',
    }),
    bloomsLevels: z.array(z.string()).min(1, {
      message: "Select at least one Bloom's Taxonomy level",
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

export function LongQAGenerator() {
  const [response, setResponse] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inputMethod: 'topic',
      topic: '',
      questionsPerLevel: '',
      complexityLevel: undefined,
      bloomsLevels: [],
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

      const complexityText = {
        'key-stage-3': 'Key Stage 3',
        'key-stage-4': 'Key Stage 4',
        advanced: 'Advanced',
      }[data.complexityLevel]

      // Generate mock questions based on the selected Bloom's levels
      const questions = []

      for (const level of data.bloomsLevels) {
        const bloomLevel = bloomsLevels.find((bl) => bl.id === level)?.label

        for (let i = 1; i <= Number.parseInt(data.questionsPerLevel); i++) {
          let question = ''

          switch (level) {
            case 'remembering':
              question = `**Question ${questions.length + 1} (${bloomLevel}):**
Define the concept of ${data.topic || 'the topic'} and list its key characteristics.

**Answer:**
${data.topic || 'The topic'} refers to a fundamental concept in the field that involves specific processes and principles. Its key characteristics include:
1. Systematic approach to problem-solving
2. Integration of multiple theoretical frameworks
3. Application across various contexts
4. Historical development through several key phases`
              break
            case 'understanding':
              question = `**Question ${questions.length + 1} (${bloomLevel}):**
Explain how ${data.topic || 'the topic'} works and why it is important in this field.

**Answer:**
${data.topic || 'The topic'} functions through a series of interconnected processes that work together to achieve specific outcomes. It begins with initial input, which is then processed through several stages including analysis, transformation, and synthesis.

The importance of ${data.topic || 'the topic'} in this field cannot be overstated. It provides a framework for understanding complex phenomena, enables practitioners to make predictions based on established patterns, and facilitates the development of new approaches to persistent challenges.`
              break
            case 'applying':
              question = `**Question ${questions.length + 1} (${bloomLevel}):**
How would you apply the principles of ${data.topic || 'the topic'} to solve a real-world problem?

**Answer:**
To apply the principles of ${data.topic || 'the topic'} to a real-world problem, I would follow these steps:

1. Identify the specific challenge and its key components
2. Analyze how the principles of ${data.topic || 'the topic'} relate to this particular situation
3. Develop a structured approach that incorporates the most relevant aspects of ${data.topic || 'the topic'}
4. Implement the solution while monitoring for effectiveness
5. Evaluate outcomes and refine the approach as needed

For example, if addressing a problem in educational settings, I would first assess the learning environment, then apply ${data.topic || 'the topic'}'s frameworks to design an intervention that addresses the specific needs identified.`
              break
            case 'analysing':
              question = `**Question ${questions.length + 1} (${bloomLevel}):**
Analyze the relationship between ${data.topic || 'the topic'} and related concepts in the field.

**Answer:**
The relationship between ${data.topic || 'the topic'} and related concepts in the field is multifaceted and can be analyzed through several lenses:

From a structural perspective, ${data.topic || 'the topic'} serves as a foundational element that supports and connects with concepts such as [related concept 1] and [related concept 2]. These connections are not merely superficial but represent deep theoretical integrations.

From a functional perspective, ${data.topic || 'the topic'} operates in tandem with these related concepts, sometimes as a prerequisite, sometimes as a complementary process, and occasionally as a competing framework.

The historical development of these concepts reveals how they have influenced each other over time, with advances in one area often spurring developments in others.`
              break
            case 'evaluating':
              question = `**Question ${questions.length + 1} (${bloomLevel}):**
Evaluate the strengths and limitations of ${data.topic || 'the topic'} as an approach to understanding this subject.

**Answer:**
**Strengths of ${data.topic || 'the topic'}:**

1. Comprehensive framework that addresses multiple dimensions of the subject
2. Strong empirical support from numerous studies across different contexts
3. Practical applicability to real-world situations
4. Flexibility to incorporate new findings and adapt to changing conditions
5. Interdisciplinary relevance that bridges multiple fields of study

**Limitations of ${data.topic || 'the topic'}:**

1. Tendency to oversimplify complex phenomena in some applications
2. Methodological challenges in measuring certain aspects
3. Cultural and contextual variations that may limit universal applicability
4. Theoretical gaps in explaining certain edge cases or exceptions
5. Practical implementation barriers in resource-limited settings

On balance, while ${data.topic || 'the topic'} provides a valuable and well-supported approach, it must be applied with awareness of these limitations and potentially supplemented with complementary frameworks in certain contexts.`
              break
            case 'creating':
              question = `**Question ${questions.length + 1} (${bloomLevel}):**
Design a new framework that builds upon and extends ${data.topic || 'the topic'} to address current challenges in the field.

**Answer:**
# Integrated Adaptive Framework for ${data.topic || 'the topic'}

## Conceptual Foundation
This new framework builds upon the established principles of ${data.topic || 'the topic'} while addressing its limitations through the integration of emerging approaches and technologies.

## Core Components
1. **Dynamic Assessment Module**: Enhances the traditional ${data.topic || 'topic'} approach by incorporating real-time feedback mechanisms
2. **Contextual Adaptation Layer**: Addresses the limitation of contextual variability by providing customizable parameters
3. **Cross-disciplinary Integration Hub**: Expands the applicability of ${data.topic || 'the topic'} by systematically incorporating insights from adjacent fields
4. **Implementation Pathway**: Provides a structured approach to overcome practical barriers

## Innovative Applications
This framework enables novel applications such as:
- Predictive modeling in previously challenging domains
- Personalized interventions based on individual profiles
- Scalable solutions for resource-constrained environments

## Evaluation Metrics
Success of this framework would be measured through:
- Improved outcomes compared to traditional ${data.topic || 'topic'} approaches
- Broader applicability across diverse contexts
- Enhanced user engagement and satisfaction
- Longitudinal sustainability indicators`
              break
            default:
              question = `**Question ${questions.length + 1}:**
Discuss the importance of ${data.topic || 'the topic'} in contemporary contexts.

**Answer:**
${data.topic || 'The topic'} plays a crucial role in contemporary contexts through its influence on multiple domains. Its theoretical foundations provide a basis for understanding complex phenomena, while its practical applications offer solutions to pressing challenges.`
          }

          questions.push(question)
        }
      }

      const responseText = `# Long-Form Questions and Answers on ${data.topic || 'Uploaded Document'}

**Complexity Level:** ${complexityText}
**Bloom's Taxonomy Levels:** ${selectedBlooms.join(', ')}
**Questions per Level:** ${data.questionsPerLevel}

## Questions and Answers

${questions.join('\n\n')}

## Study Guide

This set of questions and answers covers the topic of ${data.topic || 'the uploaded document'} at the ${complexityText} level. The questions are designed to assess understanding across multiple cognitive levels according to Bloom's Taxonomy.

### How to Use This Resource

1. **For Students:**
   - Use these questions for self-assessment and exam preparation
   - Practice answering similar questions to develop your understanding
   - Identify areas where you need additional study based on your ability to answer

2. **For Educators:**
   - Use these as model questions for assessments
   - Adapt the questions to suit specific learning objectives
   - Use the answers as a guide for evaluating student responses`

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

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="questionsPerLevel"
            render={({ field }) => (
              <FormItem>
                <RequiredLabel>Questions per Level</RequiredLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select number" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
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
                    <SelectItem value="key-stage-3">Key Stage 3</SelectItem>
                    <SelectItem value="key-stage-4">Key Stage 4</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <RequiredLabel>Select Bloom&apos;s Taxonomy Levels</RequiredLabel>
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
      toolName="Long Question Answer Generator"
      description="Generate well-structured questions and answers"
      inputForm={inputForm}
      onGenerate={form.handleSubmit(onSubmit)}
      isGenerating={isGenerating}
      response={response}
      disableGenerate={!form.formState.isValid}
    />
  )
}
