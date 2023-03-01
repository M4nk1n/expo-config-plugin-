import { ConfigPlugin, withAndroidManifest, AndroidConfig } from "@expo/config-plugins"

// 配置 Android AndroidManifest
export const setAndroidManifest: ConfigPlugin = config =>
  withAndroidManifest(config, config => {
    if (!config.modResults.manifest.application) {
      return config
    }

    if (AndroidConfig.Manifest.findMetaDataItem(config.modResults.manifest.application[0], "JPUSH_CHANNEL") === -1) {
      console.log("\n[JPushExpoConfigPlugin] 配置 AndroidManifest JPUSH_CHANNEL ... ")
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        config.modResults.manifest.application[0],
        "JPUSH_CHANNEL",
        "${JPUSH_CHANNEL}"
      )
    }

    if (AndroidConfig.Manifest.findMetaDataItem(config.modResults.manifest.application[0], "JPUSH_APPKEY") === -1) {
      console.log("\n[JPushExpoConfigPlugin] 配置 AndroidManifest JPUSH_APPKEY ... ")
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        config.modResults.manifest.application[0],
        "JPUSH_APPKEY",
        "${JPUSH_APPKEY}"
      )
    }

    if (!config.modResults.manifest.application[0].activity) {
      return config
    }

    // 插件中已有此部份配置
    // if (
    //   config.modResults.manifest.application[0].activity.findIndex(
    //     item => item.$["android:name"] === "cn.jpush.android.service.JNotifyActivity"
    //   ) === -1
    // ) {
    //   console.log("\n[JPushExpoConfigPlugin] 此后两项为BUG修复, 对应版本 jpush-react-native 2.8.3")
    //   console.log("\n[JPushExpoConfigPlugin] - 配置 AndroidManifest xmlns:tools ... ")

    //   config.modResults.manifest.$["xmlns:tools"] = "http://schemas.android.com/tools"

    //   console.log("\n[JPushExpoConfigPlugin] - 配置 AndroidManifest activity ... ")
    //   config.modResults.manifest.application[0].activity.push({
    //     $: {
    //       "android:name": "cn.jpush.android.service.JNotifyActivity",
    //       "android:exported": "true",
    //       "tools:node": "replace",
    //       "android:taskAffinity": "jpush.custom",
    //       "android:theme": "@style/JPushTheme"
    //     },
    //     "intent-filter": [
    //       {
    //         action: [
    //           {
    //             $: { "android:name": "cn.jpush.android.intent.JNotifyActivity" }
    //           }
    //         ],
    //         category: [
    //           {
    //             $: { "android:name": "android.intent.category.DEFAULT" }
    //           },
    //           {
    //             $: { "android:name": "${applicationId}" }
    //           }
    //         ]
    //       }
    //     ]
    //   })
    // }

    return config
  })
