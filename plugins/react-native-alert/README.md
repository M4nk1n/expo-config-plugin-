# @mankin/react-native-alert

> Fork from: [shimohq/react-native-prompt-android](https://github.com/shimohq/react-native-prompt-android)

A polyfill library for Alert.prompt on Android platform, working both on Android and iOS platform(iOS using [AlertIOS.prompt](http://facebook.github.io/react-native/docs/alertios.html#prompt))

## Installation

* Install from npm

```bash
npm install @mankin/react-native-alert --save
```

## Usage

```js
import Alert from '@mankin/react-native-alert'

Alert.prompt(
    'Enter password',
    'Enter your password to claim your $1.5B in lottery winnings',
    [
     {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
     {text: 'OK', onPress: password => console.log('OK Pressed, password: ' + password)},
    ],
    {
        type: 'secure-text',
        cancelable: false,
        defaultValue: 'test',
        placeholder: 'placeholder'
    }
)
```

## Props

| name                 | description                                 | type     | default           |
|:-------------------- |:------------------------------------------- |:--------:|:----------------- |
| type                 | Text input type: `'numeric', 'secure-text', 'phone-pad', 'email-address'`  | String | 'default' |
| cancelable           |                                             | Boolean  | |
| defaultValue         | Default input value                         | String   | '' |
| keyboardType         | The keyboard type of first text field(if exists). One of `'default'`, `'email-address'`, `'numeric'`, `'phone-pad'`, `'ascii-capable'`, `'numbers-and-punctuation'`, `'url'`, `'number-pad'`, `'name-phone-pad'`, `'decimal-pad'`, `'twitter'` or `'web-search'`. | String | 'default' |
| placeholder          |                                             | String   | '' |

![Android Screen Shoot](./docs/android.png)

![Android Screen Shoot](./docs/ios.png)
