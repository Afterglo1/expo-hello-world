import React from "react";
import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";

interface RecordingButtonProps {
  isRecording: boolean;
  waveStyle: any;
  onPress: () => void;
}

export const RecordingButton: React.FC<RecordingButtonProps> = ({ isRecording, waveStyle, onPress }) => {
  return (
    <View className="flex-1 items-center pt-32 shrink-0">
      <Animated.View
        className="absolute top-28 w-[70px] h-[70px] rounded-full bg-sky-200 "
        style={waveStyle}
      />
      <Pressable
        className={`w-[50px] h-[50px] rounded-full justify-center items-center ${
          isRecording ? "bg-red-500" : "bg-blue-500"
        }`}
        onPress={onPress}
      >
        <Ionicons
          name="mic"
          size={24}
          color="white"
        />
      </Pressable>
    </View>
  );
};
