### Development roadmap for required libraries and configuration

### Libraries

#### 1. For accessing localstorage and persistent storage

Installation of library

```sh
npx expo install @react-native-async-storage/async-storage
```

Usage

```js
import AsyncStorage from "@react-native-async-storage/async-storage";

// Save data
await AsyncStorage.setItem("key", JSON.stringify(value));

// Get data
const value = await AsyncStorage.getItem("key");
if (value !== null) {
  const parsed = JSON.parse(value);
}
```

Reference in Expo docs [react-native-async-storage/async-storage](https://docs.expo.dev/versions/v52.0.0/sdk/async-storage/)

[Official documentation](https://react-native-async-storage.github.io/async-storage/)

#### Where your data is stored (from the docs)

- Android - SQLite
- iOS - small values (not exceeding 1024 characters) are serialized and stored in a common manifest.json file, while larger values are stored in individual, dedicated files (named as MD5 hashed key)
- macOS - Same as iOS
- Web - window.localStorage
- Windows - SQLite

#### 2. Date picker

```sh
 npx expo install @react-native-community/datetimepicker
```

#### 3. Image picker

```sh
npx expo install expo-image-picker
```

#### 4. Image viewer

```sh
npx expo install expo-image
```

#### 5. Audio recording and playback

```sh
npx expo install expo-audio
```

### Loading custom fonts

[Docs Reference](https://docs.expo.dev/versions/v52.0.0/sdk/font/)

```sh
npx expo install expo-font
```

Usage

```js
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, error] = useFonts({
    "Inter-Black": require("./assets/fonts/Inter-Black.otf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontFamily: "Inter-Black", fontSize: 30 }}>
        Inter Black
      </Text>
      <Text style={{ fontSize: 30 }}>Platform Default</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
```

### Configs for Styling

Styling using [Nativewind](https://www.nativewind.dev/docs). Nativewind allows you to use Tailwind CSS to style your components in React Native

Color scheme setting

https://www.nativewind.dev/docs/core-concepts/dark-mode

Tailwind default configuration file https://app.unpkg.com/tailwindcss@2.2.19/files/stubs/defaultConfig.stub.js

[Tailwind css docs](https://tailwindcss.com/)

https://v2.tailwindcss.com/docs/configuration

```js
//tailwind.config.js

const colors = require("../colors");

module.exports = {
  purge: [],
  presets: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor"
      indigo: colors.indigo,
      purple: colors.violet,
      pink: colors.pink,
    },
    spacing: {
      px: "1px",
      0: "0px",
      0.5: "0.125rem",
      1: "0.25rem",
      1.5: "0.375rem",
      2: "0.5rem",
    },
  },
};
```
