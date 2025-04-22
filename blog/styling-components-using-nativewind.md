## Styling Components using Tailwind
### Tailwind for Android and iOS
Tailwind does not support Android and iOS platforms. We can use a compatibility library such as NativeWind for universal support.

### What is [NativeWind](https://www.nativewind.dev/overview/)?
NativeWind allows you to use Tailwind CSS to style your components in React Native. Styled components can be shared between all React Native platforms, using the best style engine for that platform; CSS StyleSheet on web and StyleSheet.create for native. Its goals are to provide a consistent styling experience across all platforms, improving Developer UX, component performance and code maintainability.

On native platforms, NativeWind performs two functions. First, at build time, it compiles your Tailwind CSS styles into StyleSheet.create objects and determines the conditional logic of styles (e.g. hover, focus, active, etc). Second, it has an efficient runtime system that applies the styles to your components. This means you can use the full power of Tailwind CSS, including media queries, container queries, and custom values, while still having the performance of a native style system.

### 1. Installing NativeWind
```sh
npx expo install nativewind tailwindcss@^3.4.17 react-native-reanimated@3.16.2 react-native-safe-area-context
```

### 2. Setup Tailwind CSS
Run npx tailwindcss init to create a tailwind.config.js file

Add the paths to all of your component files in your tailwind.config.js file.

`tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}
```


Create a CSS file and add the Tailwind directives.

`global.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3. Add the Babel preset

`babel.config.js`
```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```


### 4. Modify your metro.config.js

`metro.config.js`

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname)

module.exports = withNativeWind(config, { input: './global.css' })
```


### 5. Import your CSS file

`App.js`

```js
import "./global.css"

export default App() {
  /* Your App */
}
```


## Typescript
NativeWind extends the React Native types via declaration merging. The simplest method to include the types is to create a new nativewind-env.d.ts file and add a triple-slash directive referencing the types.

`nativewind-env.d.ts`

```js
/// <reference types="nativewind/types" />
```



Here are some popular component libraries that work well with NativeWind:
1. [NativeWindUI](https://nativewindui.com/)
2. [NativeWindUI](https://github.com/mrzachnugent/react-native-reusables)
3. [Gluestack](https://gluestack.io/)