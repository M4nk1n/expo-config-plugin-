import type { AlertButton } from "react-native"

type PromptType = 'default' | 'plain-text' | 'secure-text'
type PromptTypeIOS = 'login-password'
type PromptTypeAndroid = 'numeric' | 'email-address' | 'phone-pad'

type PromptStyleAndroid = 'none' | 'default'

export type PromptButton = {
  text?: string
  onPress?: (message: string) => void

  /** @platform ios */
  style?: 'default' | 'cancel' | 'destructive'
}

export interface PromptOptions {
  /**
   * * Cross platform:
   *
   * - `'default'`
   * - `'plain-text'`
   * - `'secure-text'`
   *
   * * iOS only:
   *
   * - `'login-password'`
   *
   * * Android only:
   *
   * - `'numeric'`
   * - `'email-address'`
   * - `'phone-pad'`
   */
  type?: PromptType | PromptTypeIOS | PromptTypeAndroid

  defaultValue?: string

  keyboardType?: string

  /** @platform android */
  placeholder?: string

  /** @platform android */
  cancelable?: boolean

  /** @platform android */
  style?: PromptStyleAndroid
}

export type Prompt = (
  title: string,
  message?: string,
  callbackOrButtons?: ((value: string) => void) | Array<AlertButton>,
  options?: PromptOptions,
) => void
