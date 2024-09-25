import { NativeModules } from 'react-native'

import type { Prompt } from './types'

const PromptAndroid = NativeModules.PromptAndroid

export const prompt: Prompt = (title, message, callbackOrButtons, options) => {
  const defaultButtons = [
    {
      text: 'Cancel',
    },
    {
      text: 'OK',
      onPress: typeof callbackOrButtons === 'function' ? callbackOrButtons : () => { }
    }
  ]

  let buttons = typeof callbackOrButtons === 'function'
    ? defaultButtons
    : callbackOrButtons

  let config: { [key: string]: any } = {
    title: title,
    message: message || '',
  }

  if (options) {
    config = {
      ...config,
      cancelable: options.cancelable !== false,
      type: options.type || 'default',
      style: options.style || 'default',
      defaultValue: options.defaultValue || '',
      placeholder: options.placeholder || ''
    }
  }

  // At most three buttons (neutral, negative, positive). Ignore rest.
  // The text 'OK' should be probably localized. iOS Alert does that in native.
  const validButtons = buttons ? buttons.slice(0, 3) : [{ text: 'OK' }]
  const buttonPositive = validButtons.pop()
  const buttonNegative = validButtons.pop()
  const buttonNeutral = validButtons.pop()

  if (buttonNeutral) {
    config = { ...config, buttonNeutral: buttonNeutral.text || '' }
  }
  if (buttonNegative) {
    config = { ...config, buttonNegative: buttonNegative.text || '' }
  }
  if (buttonPositive) {
    config = {
      ...config,
      buttonPositive: buttonPositive.text || ''
    }
  }

  PromptAndroid.promptWithArgs(
    config,
    (action: any, buttonKey: any, input: string) => {
      if (action !== PromptAndroid.buttonClicked) {
        return
      }
      if (buttonKey === PromptAndroid.buttonNeutral) {
        buttonNeutral?.onPress && buttonNeutral.onPress(input)
      } else if (buttonKey === PromptAndroid.buttonNegative) {
        buttonNegative?.onPress && (buttonNegative.onPress as () => void)()
      } else if (buttonKey === PromptAndroid.buttonPositive) {
        buttonPositive?.onPress && buttonPositive.onPress(input)
      }
    }
  )
}
