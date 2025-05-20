import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { IInputFieldProps } from "@gluestack-ui/input/lib/types";
import { router } from "expo-router";
import { RefAttributes, RefObject, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInputProps,
  TextInputChangeEventData,
  NativeSyntheticEvent,
  TextInput,
} from "react-native";

export default function VerifyLogin() {
  const inputRefs: RefObject<any>[] = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const [inputOtp, setInputOtp] = useState<Array<string>>(["", "", "", ""]);

  const toast = useToast();
  const [toastId, setToastId] = useState("");

  const handleToast = () => {
    if (!toast.isActive(toastId)) {
      showNewToast();
    }
  };
  const showNewToast = () => {
    const newId = String(Math.random());
    setToastId(newId);
    toast.show({
      id: newId,
      placement: "top",
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id;
        return (
          <Toast nativeID={uniqueToastId} action="warning" variant="outline">
            <ToastTitle>Error</ToastTitle>
            <ToastDescription>Please enter the valid OTP</ToastDescription>
          </Toast>
        );
      },
    });
  };

  const handleInputChange = (fieldIndex: number) => {
    // return (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    //   const {
    //     nativeEvent: { text },
    //   } = e;

    return (text: string) => {
      const numRegex = /^[0-9]$/;
      if (numRegex.test(text) || text === "") {
        // setInputOtp({ ...inputOtp, [fieldIndex]: text });
        let newOtp = [...inputOtp];
        newOtp[fieldIndex] = text;
        setInputOtp(newOtp);
        text === ""
          ? inputRefs[fieldIndex - 1]?.current?.focus()
          : inputRefs[fieldIndex + 1]?.current?.focus();
      }
    };
  };

  const verifyOtp = () => {
    const otp = inputOtp.join("").trim();
    const isValidOtp = otp.length === 4;
    if (isValidOtp && otp === "1234") {
      router.navigate("/profile");
    } else {
      handleToast();
    }
  };

  useEffect(() => {
    inputRefs[0].current.focus();
  }, []);

  return (
    <View className="m-10 mt-4  box-border">
      <View>
        <Text>Enter the OTP sent to verify</Text>
      </View>
      <Box>
        <Center>
          <HStack space="md">
            {inputOtp.map((el, i) => (
              <Box key={i}>
                <Input className="w-14 h-14 my-4 mr-4">
                  <InputField
                    ref={inputRefs[i]}
                    className="text-center"
                    maxLength={1}
                    value={inputOtp[i]}
                    onChangeText={handleInputChange(i)}
                    keyboardType="number-pad"
                  />
                </Input>
              </Box>
            ))}
          </HStack>
        </Center>

        <Button action="positive" onPress={verifyOtp}>
          <ButtonText>Verify</ButtonText>
        </Button>
      </Box>
    </View>
  );
}
