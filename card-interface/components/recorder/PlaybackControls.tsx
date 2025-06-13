import React from "react";
import { View, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import Slider from "@react-native-community/slider";

interface PlaybackControlsProps {
  isPlaying: boolean;
  playbackStatus: {
    positionMillis: number;
    durationMillis: number;
  };
  playbackOpacity: any;
  onPlayPause: () => void;
  onStop: () => void;
  onSeek: (value: number) => void;
  onSeekComplete: (value: number) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  playbackStatus,
  playbackOpacity,
  onPlayPause,
  onStop,
  onSeek,
  onSeekComplete,
}) => {
  const playbackStyle = useAnimatedStyle(() => ({
    opacity: playbackOpacity.value,
  }));

  const formatTime = (milliseconds: number) => {
    if (!milliseconds) return "0:00";
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <View className="flex gap-2 absolute bottom-0 w-full left-0 p-4 mb-4">
      {isPlaying && (
        <View className="w-full px-2">
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-600 text-xs">
              {formatTime(playbackStatus.positionMillis)}
            </Text>
            <Text className="text-gray-600 text-xs">
              {formatTime(playbackStatus.durationMillis)}
            </Text>
          </View>
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={playbackStatus.durationMillis || 1}
            value={playbackStatus.positionMillis}
            onValueChange={onSeek}
            onSlidingComplete={onSeekComplete}
            minimumTrackTintColor="#3b82f6"
            maximumTrackTintColor="#e5e7eb"
            thumbTintColor="#3b82f6"
          />
        </View>
      )}
      {isPlaying && (
        <Animated.View
          className="flex-row items-center gap-1 justify-center p-2"
          style={playbackStyle}
        >
          <View className="w-[3px] h-[20px] bg-green-500 rounded-sm" />
          <View className="w-[3px] h-[30px] bg-green-500 rounded-sm" />
          <View className="w-[3px] h-[20px] bg-green-500 rounded-sm" />
          <Text className="text-green-500 text-base ml-2">Playing...</Text>
        </Animated.View>
      )}
      <View className="flex-row justify-center gap-2">
        <Pressable
          className="w-[40px] h-[40px] rounded-full bg-green-500 justify-center items-center"
          onPress={onPlayPause}
        >
          {isPlaying ? (
            <Ionicons name="pause" size={20} color="white" />
          ) : (
            <Ionicons name="play" size={20} color="white" />
          )}
        </Pressable>
        <Pressable
          className={`w-[40px] h-[40px] rounded-full bg-red-500 justify-center items-center ${
            isPlaying ? "block" : "invisible"
          }`}
          onPress={onStop}
        >
          <Ionicons name="stop" size={20} color="white" />
        </Pressable>
      </View>
    </View>
  );
};
