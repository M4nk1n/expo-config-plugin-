# Expo Mods

A modifier (mod for short) is an async function that accepts a config and a data object, then manipulates and returns both as an object.

Mods are added to the `mods` object of the Expo config. The `mods` object is different to the rest of the Expo config because it doesn't get serialized after the initial reading, this means you can use it to perform actions during code generation. If possible, you should attempt to use basic plugins instead of mods as they're simpler to work with.

- `mods` are omitted from the manifest and cannot be accessed via `Updates.manifest`. Mods exist for the sole purpose of modifying native project files during code generation!

- `mods` can be used to read and write files safely during the `expo prebuild` command. This is how Expo CLI modifies the Info.plist, entitlements, xcproj, etc...

- `mods` are platform-specific and should always be added to a platform-specific object:

  app.config.js

  ```javascript
  module.exports = {
    name: 'my-app',
    mods: {
      ios: {
        /* iOS mods... */
      },
      android: {
        /* Android mods... */
      },
    },
  };
  ```
