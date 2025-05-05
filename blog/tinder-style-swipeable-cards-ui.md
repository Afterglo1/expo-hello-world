## Card Interface

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

If we want to have multiple gestures like tap, swipe on the same component, we can make use of Gesture composition to handle the respective gestures.
[Reference](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/gesture-composition)

In the below example only one gesture can become activate at the same time. The first active gesture will cancel the rest of the gesture

```jsx
import { GestureDetector } from "react-native-gesture-handler";

const compose=Gesture.Race(swipe,doubleTap,zoom)

<GestureDetector gesture={compose}>
    // rest of the component code
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

To animate the card component we will be using following components,methods and hooks provided by `react-native-reanimated` library.

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

To combine gestures with animations we need to maintain state variables which will be acting like switches. The animations will be applied to the components depending on the values of the state variables. We won't be using any state management methods provided by React as it will cause the re-render of the entire component when the value of any state variable changes. We will use the hooks provided by the `react-native-reanimated` library to implement the same.

The reason behind not using state management from React for this purpose is that the using react state management will cause multiple re-renders as animations will be happening in frame by frame which will result in slow and laggy UI response. By using the hooks provided by `react-native-reanimated` it will ensure that there is no re-renders and also it will help animate any component we want to.

#### 2. Combining hooks and methods along with Gesture handling to implementing animated styles

```js
const CardComponent = () => {
  // Initialising the intial state for liked status and the value will be stored as variable.value in this case liked.value
  const liked = useSharedValue(0);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      // on double-tap on the screen the liked.value is getting updated/switched to 1 or 0 depending on the previous value.
      liked.value = liked.value === 1 ? 0 : 1;
    });

  // iconStyle is a style object which is updated everytime when the liked.value changes
  const iconStyle = useAnimatedStyle(() => {
    // creates animated color updation when the liked.value changes
    const color = interpolateColor(liked.value, [0, 1], ["black", "white"]);
    return {
      color,
    };
  });

  return (
    <GestureDetector gesture={doubleTap}>
      <AnimatedIcon
        name="heart"
        size={25}
        className="absolute bottom-2 right-2"
        style={iconStyle}
      />
    </GestureDetector>
  );
};
```

In the above example a `liked` state variable is initialized for maintaining the liked status value using `useSharedValue` hook by passing the initial value as 0. When a double tap is triggered on the screen it calls the `doubleTap` method which updates the value of `liked.value` to either `0` or `1` by checking the previous value.

When this update happens the `iconStyle` object value gets updated as the `interpolateColor` method inside the `useAnimatedStyle` hook gets triggered. The `useAnimatedStyle` lets us create a styles object, similar to StyleSheet styles, which can be animated using shared values.

The `interpolateColor` lets us map a value from a range of numbers to a range of colors using linear interpolation. This method takes 3 mandatory params.

1. The range value
2. Input range (Array of values)
3. Output range (Array of values. i.e colors)

The range value should be one of the values in the input range, which will result in returning a value from the Output range at the same index. In our example above the first parameter liked.value will be either 1 or 0. Which is passed as the second parameter input range to the `interpolateColor` method. And the third parameter Output range is an array of colors. When the liked.value is `0` the resulting color will be `black` and when it is `1` the resulting color will be `white`

#### Using other methods for animating

```js
const doubleTap = Gesture.Tap()
  .numberOfTaps(2)
  .onStart(() => {
    iconScale.value = withSequence(withSpring(1.5), withSpring(1));
  });

const iconStyle = useAnimatedStyle(() => {
  return {
    transform: [{ scale: iconScale.value }],
  };
});
```

In the above example we are using `withSequence` and `withSpring` methods.
The withSequence method lets us run animations in a sequence. and the withSpring method lets us create spring-based animations. The resultant value is used in animating the icon by updating the transform values. Which will result in animating icon scaling to 1.5x of the initial size and then scaling down to the normal 1x size.

The `withTiming` method can also be used to implement the same animation by specifying the value and the duration

```js
const iconStyle = useAnimatedStyle(() => {
  return {
    transform: [{ scale: withTiming(iconScale.value, { duration: 500 }) }],
  };
});
```
