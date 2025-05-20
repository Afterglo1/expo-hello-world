import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Input, InputField } from "@/components/ui/input";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaProvider>
      <View className="flex-1 justify-center items-center">
        {/* <Text>Hello world</Text> */}
        <Pressable
          className="bg-slate-300 p-4 rounded-md"
          onPress={() => router.push("/login")}
        >
          <Text>Go to Login</Text>
        </Pressable>
      </View>
    </SafeAreaProvider>
  );
}
