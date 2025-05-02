// Schema descriptions for Clarify/Challenge tool

export const CHALLENGE_SCHEMA = `{
  critical_reflection_questions: { 
    type: "array",
    items: { type: "string" } 
  },
  advanced_concepts: {
    type: "array",
    items: { 
      type: "object",
      properties: {
        concept: { type: "string" },
        explanation: { type: "string" }
      }
    }
  },
  interdisciplinary_connections: {
    type: "array",
    items: {
      type: "object",
      properties: {
        field: { type: "string" },
        connection: { type: "string" }
      }
    }
  },
  counterarguments: {
    type: "array",
    items: { type: "string" }
  },
  future_challenges: {
    type: "array",
    items: { type: "string" }
  }
}`

export const CLARIFY_SCHEMA = `{
  main_argument: { type: "string" },
  key_concepts: {
    type: "array",
    items: {
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
      },
    },
  },
  critical_details: {
    type: "array",
    items: { type: "string" },
  },
  applications_in_practice: {
    type: "array",
    items: {
      type: "object",
      properties: {
        example: { type: "string" },
        description: { type: "string" },
      },
    },
  },
}`
