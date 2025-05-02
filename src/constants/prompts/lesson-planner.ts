import { LessonPlan } from '@/features/tools/lesson-planner/schema/input-schema'

/**
 * Generate a prompt for lesson plan creation based on user input
 */
export const generateLessonPlanPrompt = (input: LessonPlan): string => {
  return `Create an educational lesson plan focusing on academic understanding and critical analysis:
  Topic: ${input.topic}
  ${input.yearGroup ? `Year Group: ${input.yearGroup}` : ''}
  Duration: ${input.duration} minutes (STRICT REQUIREMENT)
  ${input.objectives ? `Learning Objectives: ${input.objectives.join(', ')}` : ''}
  
  Please create an academically rigorous lesson plan that:
  1. Develops analytical and critical thinking skills
  2. Uses evidence-based teaching methods that:
     - Promote academic understanding
     - Incorporate varied learning resources
     - Support analytical skill development
  3. Structure each teaching approach (total: ${input.duration} minutes) as:
     - Opening activity (5-10 minutes)
     - Main learning activities (remaining time)
     - Concluding assessment (5-10 minutes)
  4. Use academic sources and materials
  5. Include varied teaching resources

  Key Requirements:
  1. Provide THREE distinct teaching approaches:
     - Approach 1: Research and analysis based learning
     - Approach 2: Structured academic exploration
     - Approach 3: Collaborative academic investigation
  2. For each approach:
     - Use academic terminology
     - Include varied learning materials
     - Support evidence-based learning
     - Maintain exact timing (${input.duration} minutes)
  3. Include assessment criteria that:
     - Measure academic understanding
     - Support analytical thinking
     - Evaluate learning outcomes

  Additional Guidelines:
  - Use academic language throughout
  - Include varied source materials
  - Support analytical discussion
  - Focus on evidence-based learning
  ${input.activities?.some((a) => a.differentiation) ? '- Support diverse learning needs' : ''}
  ${input.activities?.some((a) => a.differentiation?.visualImpairment || a.differentiation?.hearingImpairment) ? '- Ensure accessible learning materials' : ''}

  TIMING REQUIREMENT: Each approach must total EXACTLY ${input.duration} minutes.`
}
