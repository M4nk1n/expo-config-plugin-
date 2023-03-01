import { ConfigPlugin, createRunOncePlugin } from "@expo/config-plugins"

import { withAndroidLocalizedName } from "./withAndroidLocalizedName"
import { withIOSLocalizedName } from "./withIOSLocalizedName"

const pkg = { name: "expo-mods-localized-name", version: "UNVERSIONED" }

/**
 * Apply native configuration.
 */
const withLocalizedName: ConfigPlugin = config => {
  // Android
  config = withAndroidLocalizedName(config)
  // iOS
  config = withIOSLocalizedName(config)

  return config
}

export default createRunOncePlugin(withLocalizedName, pkg.name, pkg.version)
