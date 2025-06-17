// components/ThemeToggle.tsx

import React from "react";
import { Pressable, Text } from "react-native";
import { useColorScheme } from "nativewind";

export default function ThemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme();

  const toggleTheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  return (
    <Pressable
      onPress={toggleTheme}
      className="p-3 bg-primary rounded-lg"
    >
      <Text className="text-primary bg-primary font-bold text-center dark:text-slate-500">
        Switch to {colorScheme === "dark" ? "Light" : "Dark"} Mode
      </Text>
    </Pressable>
  );
}
