/* eslint-disable no-useless-escape */
import { BaseMods, ConfigPlugin, IOSConfig, withAppDelegate } from "expo/config-plugins"
import fs from "fs"

export const setAppDelegateHeader: ConfigPlugin = config =>
  BaseMods.withGeneratedBaseMods<"appDelegateHeader">(config, {
    platform: "ios",
    skipEmptyMod: false,
    providers: {
      appDelegateHeader: BaseMods.provider<IOSConfig.Paths.AppDelegateProjectFile>({
        getFilePath({ modRequest: { projectRoot } }) {
          console.log("[JPushExpoConfigPlugin] 配置 AppDelegate Header")
          const filePath = IOSConfig.Paths.getAppDelegateFilePath(projectRoot)
          // Replace the .mm with a .h
          const [lastfix] = filePath.split(".").slice(-1)
          if (lastfix.endsWith("m")) {
            const fileStrArray = filePath.split(".")
            return [...filePath.split(".").slice(0, fileStrArray.length - 1), "h"].join(".")
          }
          // Possibly a Swift project...
          throw new Error(`Could not locate a valid AppDelegate.h at root: "${projectRoot}"`)
        },
        // Read the input file from the filesystem.
        async read(filePath) {
          return IOSConfig.Paths.getFileInfo(filePath)
        },
        // Write the resulting output to the filesystem.
        async write(filePath, { modResults: { contents } }) {
          let newContents = contents
          if (contents.indexOf("#import <RCTJPushModule.h>") === -1) {
            newContents = `#import <RCTJPushModule.h>\n` + contents
          }
          const reg = RegExp(/\@interface\ AppDelegate\ \: EXAppDelegateWrapper\ \<(.*?)\>/)
          const strArr = newContents.match(reg)
          if (
            !!strArr &&
            strArr.length > 0 &&
            strArr[0].indexOf("JPUSHRegisterDelegate") === -1 &&
            strArr[0].indexOf("JPUSHGeofenceDelegate") === -1
          ) {
            const { index } = strArr
            if (index !== undefined) {
              const startIndex = index + strArr[0].length - 1
              newContents =
                newContents.slice(0, startIndex) +
                `, JPUSHRegisterDelegate, JPUSHGeofenceDelegate` +
                newContents.slice(startIndex)
            }
          }
          await fs.promises.writeFile(filePath, newContents)
        }
      })
    }
  })

// 配置 iOS AppDelegate
export const setAppDelegate: ConfigPlugin<{
  appKey: string
  channel: string
}> = (config, { appKey, channel }) =>
  withAppDelegate(config, config => {
    if (config.modResults.contents.indexOf("#import <UserNotifications/UserNotifications.h>") === -1) {
      console.log("\n[JPushExpoConfigPlugin] 配置 AppDelegate import(UserNotifications) ... ")
      config.modResults.contents = config.modResults.contents.replace(
        "@implementation AppDelegate",
        `#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
#endif

@implementation AppDelegate`
      )
    }

    //   if (config.modResults.contents.indexOf('JPUSHService setupWithOption:launchOptions') === -1) {
    //     console.log('\n[JPushExpoConfigPlugin] 配置 AppDelegate didFinishLaunchingWithOptions ... ')
    //     const didFinishLaunchingWithOptionsResult =
    //       config.modResults.contents.match(
    //         /didFinishLaunchingWithOptions([\s\S]*)launchOptions\n\{\n/
    //       )
    //     const [didFinishLaunchingWithOptions] =
    //       didFinishLaunchingWithOptionsResult
    //     const didFinishLaunchingWithOptionsIndex =
    //       didFinishLaunchingWithOptionsResult.index
    //     const didFinishLaunchingWithOptionsStartIndex =
    //       didFinishLaunchingWithOptionsIndex
    //       + didFinishLaunchingWithOptions.length
    //     config.modResults.contents =
    //       config.modResults.contents.slice(0, didFinishLaunchingWithOptionsStartIndex)
    //       + `
    //   // JPush 初始化配置，可以延时初始化 不再强制在此初始化，在 js 里可以直接调用 init
    //   // [JPUSHService setupWithOption:launchOptions appKey:@"${appKey}" channel:@"${channel}" apsForProduction:YES];

    //   // APNS
    //   JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
    //   if (@available(iOS 12.0, *)) {
    //     entity.types = JPAuthorizationOptionAlert|JPAuthorizationOptionBadge|JPAuthorizationOptionSound|JPAuthorizationOptionProvidesAppNotificationSettings;
    //   }
    //   [JPUSHService registerForRemoteNotificationConfig:entity delegate:self];
    //   [launchOptions objectForKey: UIApplicationLaunchOptionsRemoteNotificationKey];

    //   // 自定义消息
    //   NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
    //   [defaultCenter addObserver:self selector:@selector(networkDidReceiveMessage:) name:kJPFNetworkDidReceiveMessageNotification object:nil];

    //   // 地理围栏
    //   [JPUSHService registerLbsGeofenceDelegate:self withLaunchOptions:launchOptions];

    //   #if defined(FB_SONARKIT_ENABLED) && __has_include(<FlipperKit/FlipperClient.h>)
    //     InitializeFlipper(application);
    //   #endif
    // ` + config.modResults.contents.slice(didFinishLaunchingWithOptionsStartIndex)
    //   } else {
    //     console.log('\n[JPushExpoConfigPlugin] 配置 AppDelegate appKey & channel ... ')
    //     config.modResults.contents = config.modResults.contents.replace(
    //       /appKey\:\@\"(.*)\" channel\:\@\"(.*)\" /,
    //       `appKey:@"${appKey}" channel:@"${channel}" `
    //     )
    //   }

    if (
      config.modResults.contents.indexOf(
        "return [super application:application didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];"
      ) > -1
    ) {
      config.modResults.contents = config.modResults.contents.replace(
        "return [super application:application didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];",
        "[JPUSHService registerDeviceToken:deviceToken];"
      )
    }
    if (
      config.modResults.contents.indexOf(
        "return [super application:application didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];"
      ) > -1
    ) {
      config.modResults.contents = config.modResults.contents.replace(
        "return [super application:application didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];",
        `// iOS 10 以下 Required
  NSLog(@"iOS 7 APNS");
  [JPUSHService handleRemoteNotification:userInfo];
  [[NSNotificationCenter defaultCenter] postNotificationName:J_APNS_NOTIFICATION_ARRIVED_EVENT object:userInfo];
  completionHandler(UIBackgroundFetchResultNewData);`
      )
    }
    if (config.modResults.contents.indexOf("JPush start") === -1) {
      console.log("\n[JPushExpoConfigPlugin] 配置 AppDelegate other ... ")
      config.modResults.contents = config.modResults.contents.replace(
        /\@end([\n]*)$/,
        `
//************************************************JPush start************************************************

// //注册 APNS 成功并上报 DeviceToken
// - (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
//   [JPUSHService registerDeviceToken:deviceToken];
// }

// //iOS 7 APNS
// - (void)application:(UIApplication *)application didReceiveRemoteNotification:  (NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
//   // iOS 10 以下 Required
//   NSLog(@"iOS 7 APNS");
//   [JPUSHService handleRemoteNotification:userInfo];
//   [[NSNotificationCenter defaultCenter] postNotificationName:J_APNS_NOTIFICATION_ARRIVED_EVENT object:userInfo];
//   completionHandler(UIBackgroundFetchResultNewData);
// }

//iOS 10 前台收到消息
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center  willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(NSInteger))completionHandler {
  NSDictionary * userInfo = notification.request.content.userInfo;
  if([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    // Apns
    NSLog(@"iOS 10 APNS 前台收到消息");
    [JPUSHService handleRemoteNotification:userInfo];
    [[NSNotificationCenter defaultCenter] postNotificationName:J_APNS_NOTIFICATION_ARRIVED_EVENT object:userInfo];
  }
  else {
    // 本地通知 todo
    NSLog(@"iOS 10 本地通知 前台收到消息");
    [[NSNotificationCenter defaultCenter] postNotificationName:J_LOCAL_NOTIFICATION_ARRIVED_EVENT object:userInfo];
  }
  //需要执行这个方法，选择是否提醒用户，有 Badge、Sound、Alert 三种类型可以选择设置
  completionHandler(UNNotificationPresentationOptionAlert);
}

//iOS 10 消息事件回调
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler: (void (^)(void))completionHandler {
  NSDictionary * userInfo = response.notification.request.content.userInfo;
  if([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    // Apns
    NSLog(@"iOS 10 APNS 消息事件回调");
    [JPUSHService handleRemoteNotification:userInfo];
    // 保障应用被杀死状态下，用户点击推送消息，打开app后可以收到点击通知事件
    [[RCTJPushEventQueue sharedInstance]._notificationQueue insertObject:userInfo atIndex:0];
    [[NSNotificationCenter defaultCenter] postNotificationName:J_APNS_NOTIFICATION_OPENED_EVENT object:userInfo];
  }
  else {
    // 本地通知
    NSLog(@"iOS 10 本地通知 消息事件回调");
    // 保障应用被杀死状态下，用户点击推送消息，打开app后可以收到点击通知事件
    [[RCTJPushEventQueue sharedInstance]._localNotificationQueue insertObject:userInfo atIndex:0];
    [[NSNotificationCenter defaultCenter] postNotificationName:J_LOCAL_NOTIFICATION_OPENED_EVENT object:userInfo];
  }
  // 系统要求执行这个方法
  completionHandler();
}

//自定义消息
- (void)networkDidReceiveMessage:(NSNotification *)notification {
  NSDictionary * userInfo = [notification userInfo];
  [[NSNotificationCenter defaultCenter] postNotificationName:J_CUSTOM_NOTIFICATION_EVENT object:userInfo];
}

//************************************************JPush end************************************************

@end
`
      )
    }

    return config
  })
