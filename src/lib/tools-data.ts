type ToolMeta = {
  name: string
  description: string
  slug: string
  icon: string
}

export const tools: ToolMeta[] = [
  {
    name: 'Lesson Planner',
    description: 'Create comprehensive lesson plans with learning objectives and activities',
    icon: 'BookOpen',
    slug: 'lesson-planner',
  },
  {
    name: 'Prompt Generator',
    description: 'Generate engaging educational prompts for discussions',
    icon: 'MessageSquare',
    slug: 'prompt-generator',
  },
  {
    name: 'Long Question Answer Generator',
    description: 'Generate well-structured questions and answers.',
    icon: 'FileText',
    slug: 'long-question-answer',
  },
  {
    name: 'Research Paper Search',
    description: 'Search for research papers on a specific topic.',
    icon: 'Search',
    slug: 'research-paper-search',
  },
  {
    name: 'Edify Chat',
    description: 'View and manage your AI chat conversations',
    icon: 'MessageCircle',
    slug: 'edify-chat',
  },
  {
    name: 'PEEL Generator',
    description: 'Generate well-structured paragraphs using the PEEL format',
    icon: 'AlignLeft',
    slug: 'peel-generator',
  },
  {
    name: 'MCQ Generator',
    description: 'Create multiple-choice questions with varying complexity levels',
    icon: 'CheckSquare',
    slug: 'mcq-generator',
  },
  {
    name: 'Report Generator',
    description: 'Generate detailed student progress reports',
    icon: 'FileBarChart',
    slug: 'report-generator',
  },
  {
    name: 'Clarify or Challenge',
    description:
      'Engage in critical thinking exercises by clarifying concepts or challenging ideas.',
    icon: 'HelpCircle',
    slug: 'clarify-challenge',
  },
  {
    name: 'Perspective Challenge',
    description: 'Test and expand your viewpoints with thought-provoking questions.',
    icon: 'Compass',
    slug: 'perspective-challenge',
  },
  {
    name: 'Rubric Generator',
    description: 'Create detailed assessment rubrics for any task',
    icon: 'ListChecks',
    slug: 'rubric-generator',
  },
  {
    name: 'SOW Generator',
    description: 'Create comprehensive schemes of work',
    icon: 'Calendar',
    slug: 'sow-generator',
  },
  {
    name: 'Quiz Generator',
    description: 'Create customised quizzes with various question types',
    icon: 'PuzzleIcon',
    slug: 'quiz-generator',
  },
  {
    name: 'Lesson Plan Evaluator',
    description: 'Evaluate and refine lesson plans for effectiveness',
    icon: 'CheckCircle',
    slug: 'lesson-plan-evaluator',
  },
]
