import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolateColor,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";
import { useEffect } from "react";

const SWIPE_THRESHOLD = 200;
const SWIPE_DURATION = 300;
const ACTIVE_OFFSET_X = 20;
const FAIL_OFFSET_Y: [number, number] = [-25, 25];

type SwipeGestureState = {
  velocityX: number;
  translationX: number;
};

type CardProps = {
  id: number;
  name: string;
  removeCard: (id: number) => void;
};

export default function Card({ id, name, removeCard }: CardProps) {
  const hearts = Array.from({ length: 6 }).map((_, index) => ({
    id: index,
    offsetX: Math.random() * 100 - 70,
    offsetY: Math.random() * -100 - 10, // upwards burst
  }));
  const liked = useSharedValue(0);
  const swiped = useSharedValue(0);
  const entryAnim = useSharedValue(20); // start 20px lower
  const opacity = useSharedValue(0);

  useEffect(() => {
    entryAnim.value = withTiming(0, { duration: 300 });
    opacity.value = withTiming(1, { duration: 300 });
  }, [id]);

  const entryStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: entryAnim.value }],
    opacity: opacity.value,
  }));

  const iconScale = useSharedValue(1);
  const cardScale = useSharedValue(1);
  const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

  const burstAnimations = hearts.map(() => ({
    x: useSharedValue(0),
    y: useSharedValue(0),
    scale: useSharedValue(0),
    opacity: useSharedValue(0),
  }));

  // const animatedLiked = useDerivedValue(() => {
  //   return withSpring(liked.value);
  // });

  const swipe = (id: number) => {
    return Gesture.Pan()
      .onUpdate((e) => {
        // Real-time animation during swipe
        const progress = Math.min(Math.abs(e.translationX) / 200, 1);
        swiped.value = progress;
      })
      .onEnd((e: SwipeGestureState) => {
        if (Math.abs(e.velocityX) >= SWIPE_THRESHOLD) {
          const direction = e.velocityX > 0 ? 1 : -1;
          swiped.value = withTiming(
            direction,
            {
              duration: SWIPE_DURATION,
            },
            (finished) => {
              if (finished) {
                runOnJS(removeCard)(id);
              }
            }
          );
        } else {
          // Reset if threshold not met
          swiped.value = withTiming(0, { duration: SWIPE_DURATION });
        }
      })
      .activeOffsetX(ACTIVE_OFFSET_X)
      .failOffsetY(FAIL_OFFSET_Y);
  };

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      liked.value = liked.value === 1 ? 0 : 1;
      iconScale.value = withSequence(withSpring(1.5), withSpring(1));
      cardScale.value = withSequence(withSpring(1.1), withSpring(1));

      if (liked.value === 1) {
        burstAnimations.forEach((anim, index) => {
          anim.x.value = withSpring(hearts[index].offsetX);
          anim.y.value = withSpring(hearts[index].offsetY);
          anim.scale.value = withTiming(1, { duration: 500 });
          anim.opacity.value = withTiming(1, { duration: 500 }, () => {
            anim.opacity.value = withTiming(0, { duration: 500 });
          });
        });
      }
    });

  const iconStyle = useAnimatedStyle(() => {
    const color = interpolateColor(liked.value, [0, 1], ["#77797d", "#e0126f"]);
    return {
      color,
      transform: [{ scale: iconScale.value }],
    };
  });

  const cardStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(liked.value, [0, 1], ["#cccdcf", "#103878"]);

    const bgColor = interpolateColor(liked.value, [0, 1], ["#cfd0d1", "#6795f0"]);

    return {
      transform: [{ scale: cardScale.value }],
      backgroundColor: bgColor,
    };
  });

  const swipeStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: swiped.value * 400, // Now responds to real-time swipe
        },
      ],
    };
  });

  const composed = Gesture.Race(doubleTap, swipe(id));

  return (
    <GestureDetector gesture={composed}>
      {/* <GestureDetector gesture={swipe(id)}> */}
      <Animated.View
        className="relative h-80 w-52 p-10 border-2 border-gray-300 rounded-lg opacity-0 translate-y-10"
        style={[entryStyle, cardStyle, swipeStyle]}
      >
        <AnimatedIcon
          name="heart"
          size={25}
          className="absolute bottom-2 right-2"
          style={iconStyle}
        />
        <Text>{name}</Text>
        {burstAnimations.map((anim, index) => {
          const style = useAnimatedStyle(() => ({
            position: "absolute",
            bottom: 10,
            right: 10,
            transform: [{ translateX: anim.x.value }, { translateY: anim.y.value }, { scale: anim.scale.value }],
            opacity: anim.opacity.value,
          }));

          return (
            <Animated.Text
              key={index}
              style={style}
            >
              ❤️
            </Animated.Text>
          );
        })}
      </Animated.View>
      {/* </GestureDetector> */}
    </GestureDetector>
  );
}
