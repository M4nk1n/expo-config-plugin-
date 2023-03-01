import { ConfigPlugin, withInfoPlist } from "@expo/config-plugins"

/**
 * Append `CFBundleAllowMixedLocalizations` to the `Info.plist`.
 */
export const withIOSLocalizedName: ConfigPlugin = c => {
  return withInfoPlist(c, config => {
    config.modResults.CFBundleAllowMixedLocalizations = true
    return config
  })
}
