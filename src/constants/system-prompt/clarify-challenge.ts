// System prompts for Clarify/Challenge tool
import {
  CLARIFY_SCHEMA,
  CHALLENGE_SCHEMA,
} from '../../features/tools/clarify-or-challenge/schema/clarify-challenge'

// Audience prompt functions
export const getAudiencePrompt = (audience: string) => {
  switch (audience) {
    case 'beginner':
      return 'Explain concepts in simple terms, using basic vocabulary and clear examples. Avoid technical jargon and complex terminology.'
    case 'advanced':
      return 'Use sophisticated terminology and complex concepts. Include detailed technical explanations and advanced theoretical frameworks.'
    default: // intermediate
      return 'Balance accessibility with depth. Use moderate technical language and provide both practical and theoretical insights.'
  }
}

export const getClarifySystemPrompt = (audience: string) => {
  return `You are an AI that creates structured breakdowns of complex topics. ${getAudiencePrompt(
    audience
  )} Output must exactly match this JSON schema: ${JSON.stringify(
    CLARIFY_SCHEMA
  )}. Ensure the response is detailed but accessible. Use UK english only.`
}

export const getChallengeSystemPrompt = (audience: string) => {
  return `You are an AI that creates advanced analysis and challenging questions about topics. ${getAudiencePrompt(
    audience
  )} Output must exactly match this JSON schema: ${JSON.stringify(
    CHALLENGE_SCHEMA
  )}. Focus on thought-provoking and interdisciplinary perspectives. Use UK english only.`
}
