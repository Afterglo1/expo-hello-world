import { Stack } from "expo-router";

export default function LoginLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Login",
          headerBackButtonDisplayMode: "minimal",
          // headerShown: false,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="verify"
        options={{
          headerTitle: "Verify",
          headerBackButtonDisplayMode: "minimal",
          // headerShown: false,
          // headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="question"
        options={{
          headerTitle: "Questions",
          headerBackButtonDisplayMode: "minimal",
          // headerShown: false,
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
}
