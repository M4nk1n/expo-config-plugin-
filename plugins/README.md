# Expo Plugins

Plugins are synchronous functions that accept an [ExpoConfig](https://docs.expo.dev/versions/latest/config/app/) and return a modified [ExpoConfig](https://docs.expo.dev/versions/latest/config/app/).

- Plugins should be named using the following convention: `with<Plugin Functionality>`, that is, `withFacebook`.

- Plugins should be synchronous and their return value should be serializable, except for any mods that are added.

- Optionally, a second argument can be passed to the plugin to configure it.

- `plugins` are always invoked when the config is read by the `expo/config` method `getConfig`. However, the `mods` are only invoked during the "syncing" phase of `npx expo prebuild`.
