import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Input, InputField } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import colors from "tailwindcss/colors";

export default function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const [loginData, setLoginData] = useState<{
    email: string;
    password: string;
  }>({ email: "", password: "" });

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      router.push("/login/verify");
    }, 300);
  };

  return loading ? (
    <View className="flex-1 items-center justify-center text-warning-600">
      <Spinner size="large" color={colors.slate[500]} />
    </View>
  ) : (
    <View>
      <Box className="mx-10  box-border">
        <Box className="my-2">
          <Text className="my-2">Email</Text>
          <Input>
            <InputField placeholder="Enter your email..." />
          </Input>
        </Box>
        <Box className="my-2">
          <Text className="my-2">Password</Text>
          <Input>
            <InputField type="password" placeholder="Enter password..." />
          </Input>
        </Box>
        <Button onPress={handleLogin}>
          <ButtonText>Login</ButtonText>
        </Button>
      </Box>
    </View>
  );
}
