import { Alert as RNAlert } from 'react-native'

import { prompt } from './alert'
export * from './types'

const Alert = {
  alert: RNAlert.alert,
  prompt
}

export default Alert
