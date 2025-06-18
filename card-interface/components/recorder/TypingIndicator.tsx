import { useEffect } from "react";
import { useState } from "react";
import Animated, { FadeIn } from "react-native-reanimated";
import { View } from "react-native";

export default function TypingIndicator() {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      className="self-start flex-row items-end mb-4"
    >
      <View className="py-2.5">
        <View className="flex-row space-x-1 gap-[1px]">
          {[...Array(3)].map((_, i) => (
            <Animated.View
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                opacity: i < dots ? 0.8 : 0.3,
                transform: [{ scale: i < dots ? 1.1 : 1 }],
              }}
              className="bg-slate-900"
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
}
