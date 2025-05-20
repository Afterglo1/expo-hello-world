import { Stack } from "expo-router";

import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useColorScheme } from "nativewind";
import { Pressable, Text } from "react-native";

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();
  console.log("INFO =>", colorScheme);

  const toggleTheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  return (
    <GluestackUIProvider mode={colorScheme}>
      <Stack>
        <Stack.Screen name="index" options={{ animation: "fade" }} />
        <Stack.Screen
          name="profile"
          options={{
            animation: "slide_from_right",
            headerTitle: "Profile",
            headerBackButtonDisplayMode: "minimal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            animation: "slide_from_right",
            // headerBackButtonDisplayMode: "minimal",
            headerShown: false,
            // headerTitle: "Login",
          }}
        />
      </Stack>
      <Pressable onPress={toggleTheme} className="p-3 bg-primary rounded-lg">
        <Text className="text-primary bg-primary font-bold text-center dark:text-slate-500">
          Switch to {colorScheme === "dark" ? "Light" : "Dark"} Mode
        </Text>
      </Pressable>
    </GluestackUIProvider>
  );
}
