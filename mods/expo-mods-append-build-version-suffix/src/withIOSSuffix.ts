import { ConfigPlugin, withInfoPlist } from "expo/config-plugins"

/**
 * Append `process.env.EXPO_PUBLIC_BUILD_SUFFIX` to the `CFBundleVersion`.
 */
export const withIOSBundleVersionSuffix: ConfigPlugin = c => withInfoPlist(c, config => {
  config.modResults.CFBundleVersion = (config.modResults.CFBundleVersion ?? config.modRawConfig.ios?.buildNumber ?? "") + (process.env.EXPO_PUBLIC_BUILD_SUFFIX ?? "")
  return config
})
