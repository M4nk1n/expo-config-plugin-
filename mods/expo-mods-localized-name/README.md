# expo-mods-localized-name

Config plugin to auto-configure localized app name when the native code is generated (`expo prebuild`).

## Expo installation

```bash
npm install @mankin/expo-mods-localized-name
```

> Tested against Expo SDK 47.
>
> This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).
> First install the package with pnpm, yarn, npm, or [`expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

After installing this npm package, add the [locales](https://docs.expo.dev/guides/localization/#translating-app-metadata) and [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    ...
    "locales": {
      "en": "./locales/en.json",
      "zh": "./locales/zh.json"
    },
    "plugins": ["@mankin/expo-mods-localized-name"]
  }
}
```

Your `en.json` should look like:

```json
{
  "CFBundleDisplayName": "example", // iOS App Name
  "app_name": "example"             // Android App Name
}
```

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.
