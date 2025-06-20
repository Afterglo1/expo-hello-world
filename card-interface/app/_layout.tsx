import { Stack } from "expo-router";
import "../global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView className="flex-1">
        <SafeAreaView className="flex-1 bg-white">
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
