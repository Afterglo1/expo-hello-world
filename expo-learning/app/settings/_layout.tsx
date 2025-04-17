import { Stack } from "expo-router";

export default function Settingslayout() {
  return (
    <>
      <Stack >
        <Stack.Screen name="index" options={{headerShown:false}} />
        <Stack.Screen name="cellular" options={{title:"Cellular Settings"}}  />
      </Stack>
    </>
  );
}
