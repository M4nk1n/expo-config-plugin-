import { AndroidConfig, ConfigPlugin, createRunOncePlugin } from "expo/config-plugins"

import { setAppBuildGradle, setSettingsGradle } from "./withAndroidGradle"
import { setAndroidManifest } from "./withAndroidManifest"
import { setAppDelegate, setAppDelegateHeader } from "./withAppDelegate"

const pkg = { name: "expo-mods-jpush", version: "UNVERSIONED" }

/**
 * Apply BLE configuration for Expo SDK 42 projects.
 */
const withJPush: ConfigPlugin<{ appKey: string; channel: string } | void> = (config, props) => {
  if (!props || !props.appKey || !props.channel) {
    throw new Error("[JPushExpoConfigPlugin] 请传入参数 appKey & channel")
  }

  // Android
  config = AndroidConfig.Permissions.withPermissions(config, [
    "android.permission.POST_NOTIFICATIONS" // since Android 13
  ])
  config = setAppDelegateHeader(config)
  config = setAppDelegate(config, props)
  config = setAndroidManifest(config)
  config = setAppBuildGradle(config, props)
  config = setSettingsGradle(config)
  return config
}

export default createRunOncePlugin(withJPush, pkg.name, pkg.version)
