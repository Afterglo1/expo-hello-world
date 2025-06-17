import React from "react";
import { View, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SampleMusicPlayerProps {
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
}

export const SampleMusicPlayer: React.FC<SampleMusicPlayerProps> = ({ isPlaying, onPlay, onStop }) => {
  return (
    <View className={`flex-row justify-between items-center p-2 ${isPlaying ? "bg-slate-300 text-white" : ""}`}>
      <Pressable
        onPress={onPlay}
        className="flex-1 h-10 justify-center"
      >
        <Text> 1. Sample Music</Text>
      </Pressable>
      {isPlaying && (
        <Pressable
          onPress={onStop}
          className="w-[20px] h-[20px] rounded-full bg-red-500 justify-center items-center"
        >
          <Ionicons
            name="stop"
            size={10}
            color="white"
          />
        </Pressable>
      )}
    </View>
  );
};
