import { Alert, type AlertType } from 'react-native'

import type { Prompt } from './types'

export const prompt: Prompt = (title, message, callbackOrButtons, options) => {
  Alert.prompt(title, message, callbackOrButtons, options?.type as AlertType, options?.defaultValue, options?.keyboardType)
}
