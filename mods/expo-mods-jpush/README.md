# expo-mods-jpush

一个极光推送的 Expo 自动配置插件，免去配置原生项目的繁琐步骤

此软件包不能在 "Expo Go" 应用程序中使用

## 1. 安装

| Expo Version  | Latest Mod Version  |
| :-----------: | :-----------------: |
| <47           | 0.0.2               |
| >=47          | latest              |

首先通过 [`expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install) 或者 `pnpm/yarn/npm` 等包管理工具安装本依赖。

```bash
npx expo install @mankin/expo-mods-jpush
```

> 注意：如果项目里没有 jpush-react-native、jcore-react-native, 需要安装
>
> ```bash
> yarn add jpush-react-native jcore-react-native
> ```

## 2. 配置

安装此 npm 包后，请将 [配置插件](https://docs.expo.io/guides/config-plugins/) 添加到 app.json 或 app.config.js 的 [插件数组](https://docs.expo.io/versions/latest/config/app/#plugins) :

### app.json

```json
{
  "expo": {
    "plugins": [
      [
        "@mankin/expo-mods-jpush",
        {
          "appKey": "你的极光推送 AppKey",
          "channel": "你的极光推送 Channel"
        }
      ]
    ]
  }
}
```

接下来，按照 ["添加自定义 Native 代码"](https://docs.expo.io/workflow/customizing/) 指南中的描述重新构建应用程序

```bash
expo prebuild
```
