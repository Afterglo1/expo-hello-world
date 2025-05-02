import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolateColor,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";

type CardProps = {
  id: number;
  name: string;
};

export default function Card({ id, name }: CardProps) {
  const hearts = Array.from({ length: 6 }).map((_, index) => ({
    id: index,
    offsetX: Math.random() * 100 - 70, // -50 to +50
    offsetY: Math.random() * -100 - 10, // upwards burst
  }));
  const liked = useSharedValue(0);
  const swiped = useSharedValue(0);

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
      .onEnd((e) => {
        if (e.velocityX >= 200) {
          swiped.value = 1;
        }
      })
      .activeOffsetX(20)
      .failOffsetY([-25, 25]);
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
    const borderColor = interpolateColor(
      liked.value,
      [0, 1],
      ["#cccdcf", "#103878"]
    );

    const bgColor = interpolateColor(
      liked.value,
      [0, 1],
      ["#cfd0d1", "#6795f0"]
    );

    return {
      transform: [{ scale: cardScale.value }],
      backgroundColor: bgColor,
    };
  });

  const swipeStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: swiped.value ? withTiming(400, { duration: 400 }) : 0,
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={doubleTap}>
      <GestureDetector gesture={swipe(id)}>
        <Animated.View
          className="relative h-80 w-52 p-10 border-2 border-gray-300 rounded-lg"
          style={[cardStyle, swipeStyle]}
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
              transform: [
                { translateX: anim.x.value },
                { translateY: anim.y.value },
                { scale: anim.scale.value },
              ],
              opacity: anim.opacity.value,
            }));

            return (
              <Animated.Text key={index} style={style}>
                ❤️
              </Animated.Text>
            );
          })}
        </Animated.View>
      </GestureDetector>
    </GestureDetector>
  );
}
