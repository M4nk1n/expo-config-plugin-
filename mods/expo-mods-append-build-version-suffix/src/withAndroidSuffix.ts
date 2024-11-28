import { ConfigPlugin, withAppBuildGradle } from "expo/config-plugins"

/**
 * Append `process.env.EXPO_PUBLIC_BUILD_SUFFIX` to the `versionCode`.
 */
export const withAndroidBundleVersionSuffix: ConfigPlugin = c => withAppBuildGradle(c, config => {
  const defaultConfig = config.modResults.contents.match(/defaultConfig([\s\S]*)versionCode(.*)/)
  if (defaultConfig) {
    const [startString] = defaultConfig
    const startStringLength = startString.length
    const startStringIndex = config.modResults.contents.indexOf(startString) + startStringLength

    console.log("\n[AppendBuildVersionSuffixPlugin] 配置 versionCode suffix ... ")
    config.modResults.contents =
      config.modResults.contents.slice(0, startStringIndex) +
      (process.env.EXPO_PUBLIC_BUILD_SUFFIX ?? "") +
      config.modResults.contents.slice(startStringIndex)
  } else {
    throw new Error("[AppendBuildVersionSuffixPlugin] 无法完成 build.gradle - defaultConfig.versionCode suffix 配置")
  }

  return config
})
