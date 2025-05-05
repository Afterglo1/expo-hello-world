## Tinder-style Card Interface

[react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started) library is used for implementing animations and [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/docs/) library for handling gestures like swipe and double tap. Combining both which the swipeable card interface and like/dislike actions with visual feedback is implemented.

### Installation

```sh
npx expo install react-native-gesture-handler
npx expo install react-native-reanimated
```

### Components used for handling gesture.

1. `GestureHandlerRootView` is a wrapper component for root element for handling gestures i.e index.tsx. We need to wrap this component around entire root element.

```js
// index.tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";

const App = () => {
  return <GestureHandlerRootView>// rest of the code</GestureHandlerRootView>;
};

export default app;
```

2. `GestureDetector` is the wrapper component used for detecting the touch gestures at the component level. In our case it is for detecting gestures on card component.

```jsx
// Card.tsx
import { GestureDetector } from "react-native-gesture-handler";

<GestureDetector gesture={doubleTap}>
  // rest of the component code
</GestureDetector>;
```

The gesture prop needs a handler function which is reponsible for handling and processing gestures.

If we want to have multiple gestures like tap, swipe on the same component, we can simply wrap multiple `GestureDetector` component around our `Card` component to handle the respective gestures.

```jsx
import { GestureDetector } from "react-native-gesture-handler";

<GestureDetector gesture={doubleTap}>
  <GestureDetector gesture={swipe}>
    // rest of the component code
  </GestureDetector>
</GestureDetector>;
```

3. `Gesture` method is used for handling the gestures like swipe, double-tap etc. This gesture handler method is assigned to a variable and passed as a prop to `gesture` in `GestureDetector`

```js
//top level import
import { Gesture } from "react-native-gesture-handler";

// Function for handling gestures
const doubleTap = Gesture.Tap()
  .numberOfTaps(2)
  .onStart(() => {
    // Logic to process the double-tap
  });
```

In the above example we are using `Tap` method from Gesture which will be handling double-taps using `numberOfTaps` method.

<!-- The way we use GestureDetector is by wrapping the entire component -->

## Implementing Card animations

To animate the card component we will be using following components and hooks provided by `react-native-reanimated` library.

1. Animated
2. useAnimatedStyle
3. useSharedValue
4. interpolateColor
5. withSpring
6. withSequence
7. withTiming

#### 1. Animated

Animated component is used to create components to which we can pass dynamic styles for the animating purposes.
By default `Animated` component can be used directly for animating Flatlist, Image,ScrollView, Text, View components by directly calling the built in methods. For example to create an Animated View component we can use `Animated.View` as a component.

```tsx
import Animated from "react-native-reanimated";

<Animated.View> // rest of the code </Animated.View>;

// same for Flatlist, Image,ScrollView, Text, View components
```

For any other components we can create animated component using `createAnimatedComponent` method.

```jsx
import { Ionicons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";

// Creating animated icon
const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);
```
