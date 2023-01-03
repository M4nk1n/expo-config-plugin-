import { ConfigPlugin, withAppBuildGradle, withSettingsGradle } from "@expo/config-plugins"

/**
 * 配置 Android build.gradle
 * 貌似现在可以自动配置 settings.gradle 了，暂时去掉，如果有问题再加回来
 */
export const setAppBuildGradle: ConfigPlugin<{
  appKey: string
  channel: string
}> = (config, { appKey, channel }) =>
  withAppBuildGradle(config, config => {
    const defaultConfig = config.modResults.contents.match(/defaultConfig([\s\S]*)versionName(.*)\n/)
    if (defaultConfig) {
      const [startString] = defaultConfig
      const startStringLength = startString.length
      const startStringIndex = config.modResults.contents.indexOf(startString) + startStringLength

      console.log("\n[JPushExpoConfigPlugin] 配置 build.gradle appKey & channel ... ")
      if (config.modResults.contents.indexOf("JPUSH_APPKEY") === -1) {
        config.modResults.contents =
          config.modResults.contents.slice(0, startStringIndex) +
          `
        manifestPlaceholders = [
            JPUSH_APPKEY: "${appKey}",
            JPUSH_CHANNEL: "${channel}"
        ]\n` +
          config.modResults.contents.slice(startStringIndex)
      } else {
        config.modResults.contents = config.modResults.contents.replace(
          /manifestPlaceholders([\s\S]*)JPUSH_APPKEY([\s\S]*)JPUSH_CHANNEL(.*)"\n(.*)\]\n/,
          `manifestPlaceholders = [
            JPUSH_APPKEY: "${appKey}",
            JPUSH_CHANNEL: "${channel}"
        ]\n`
        )
      }
    } else {
      throw new Error("[JPushExpoConfigPlugin] 无法完成 build.gradle - defaultConfig 配置")
    }

    // 貌似现在可以自动处理 implementation 了，暂时去掉，如果有问题再加回来
    // const dependencies = config.modResults.contents.match(/dependencies {\n/)
    // if (dependencies) {
    //   const [startString] = dependencies
    //   const startStringLength = startString.length
    //   const startStringIndex = config.modResults.contents.indexOf(startString) + startStringLength

    //   if (config.modResults.contents.indexOf(`implementation project(':jpush-react-native')`) === -1) {
    //     console.log('\n[JPushExpoConfigPlugin] 配置 build.gradle dependencies jpush-react-native ... ')
    //     config.modResults.contents = config.modResults.contents.slice(0, startStringIndex)
    //       + `    implementation project(':jpush-react-native')\n`
    //       + config.modResults.contents.slice(startStringIndex)
    //   }

    //   if (config.modResults.contents.indexOf(`implementation project(':jcore-react-native')`) === -1) {
    //     console.log('\n[JPushExpoConfigPlugin] 配置 build.gradle dependencies jcore-react-native ... ')
    //     config.modResults.contents = config.modResults.contents.slice(0, startStringIndex)
    //       + `    implementation project(':jcore-react-native')\n`
    //       + config.modResults.contents.slice(startStringIndex)
    //   }
    // } else {
    //   throw new Error('[JPushExpoConfigPlugin] 无法完成 build.gradle dependencies 配置')
    // }

    return config
  })

/**
 * 配置 Android settings.gradle
 * 貌似现在可以自动配置 settings.gradle 了，暂时去掉，如果有问题再加回来
 */
export const setSettingsGradle: ConfigPlugin = config =>
  withSettingsGradle(config, config => {
    //   if (config.modResults.contents.indexOf(`include ':jcore-react-native'`) === -1) {
    //     console.log('\n[JPushExpoConfigPlugin] 配置 settings.gradle include jcore-react-native ... ')
    //     config.modResults.contents = config.modResults.contents
    //       + `
    // include ':jcore-react-native'
    // project(':jcore-react-native').projectDir = new File(["node", "--print", "require.resolve('jcore-react-native/package.json')"].execute(null, rootDir).text.trim(), "../android")
    // `
    //   }

    //   if (config.modResults.contents.indexOf(`include ':jpush-react-native'`) === -1) {
    //     console.log('\n[JPushExpoConfigPlugin] 配置 settings.gradle include jpush-react-native ... ')
    //     config.modResults.contents = config.modResults.contents
    //       + `
    // include ':jpush-react-native'
    // project(':jpush-react-native').projectDir = new File(["node", "--print", "require.resolve('jpush-react-native/package.json')"].execute(null, rootDir).text.trim(), "../android")
    // `
    //   }

    return config
  })
