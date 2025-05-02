import OpenAI from 'openai'
import { config } from './api-config'

/**
 * Configured OpenAI client using settings from api-config
 */
export const openai = new OpenAI({
  apiKey: config.openai.apiKey,
})
