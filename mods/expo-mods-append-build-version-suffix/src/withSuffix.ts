import { ConfigPlugin, createRunOncePlugin } from "@expo/config-plugins"

import { withAndroidBundleVersionSuffix } from "./withAndroidSuffix"
import { withIOSBundleVersionSuffix } from "./withIOSSuffix"

const pkg = { name: "build-version-suffix", version: "UNVERSIONED" }

/**
 * Apply native configuration.
 */
const withLocalizedName: ConfigPlugin = config => {
  // Android
  config = withAndroidBundleVersionSuffix(config)
  // iOS
  config = withIOSBundleVersionSuffix(config)

  return config
}

export default createRunOncePlugin(withLocalizedName, pkg.name, pkg.version)
