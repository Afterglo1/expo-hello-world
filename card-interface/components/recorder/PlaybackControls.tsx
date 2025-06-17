import React, { useEffect } from "react";
import { View, Pressable, Text, GestureResponderEvent } from "react-native";
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
  onSpeedChange: (speed: number) => void;
  currentSpeed: number;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  playbackStatus,
  playbackOpacity,
  onPlayPause,
  onStop,
  onSeek,
  onSeekComplete,
  onSpeedChange,
  currentSpeed,
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

  const speeds = [0.5, 1, 1.5, 2];

  const handleSpeedPress = () => {
    const currentIndex = speeds.indexOf(currentSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    onSpeedChange(speeds[nextIndex]);
  };

  const handleTrackPress = (e: GestureResponderEvent) => {
    const { locationX } = e.nativeEvent;
    e.currentTarget.measure((x, y, width) => {
      const percentage = locationX / width;
      const newPosition = percentage * playbackStatus.durationMillis;
      onSeek(newPosition);
      onSeekComplete(newPosition);
    });
  };

  useEffect(() => {
    onSpeedChange(currentSpeed);
  }, [isPlaying]);

  return (
    <View className="flex gap-2 absolute bottom-0 w-full left-0 p-4 mb-4">
      <View className="w-full px-2">
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-600 text-xs">{formatTime(playbackStatus.positionMillis)}</Text>
          <Text className="text-gray-600 text-xs">{formatTime(playbackStatus.durationMillis)}</Text>
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
          onTouchStart={handleTrackPress}
        />
      </View>

      <View className="flex-row justify-center gap-2">
        <Pressable
          className="w-[40px] h-[40px] rounded-full bg-green-500 justify-center items-center"
          onPress={onPlayPause}
        >
          {isPlaying ? (
            <Ionicons
              name="pause"
              size={20}
              color="white"
            />
          ) : (
            <Ionicons
              name="play"
              size={20}
              color="white"
            />
          )}
        </Pressable>
        <Pressable
          className={`w-[40px] h-[40px] rounded-full bg-red-500 justify-center items-center ${
            isPlaying ? "block" : "invisible"
          }`}
          onPress={onStop}
        >
          <Ionicons
            name="stop"
            size={20}
            color="white"
          />
        </Pressable>
        <Pressable
          className="w-[40px] h-[40px] rounded-full bg-blue-500 justify-center items-center"
          onPress={handleSpeedPress}
        >
          <Text className="text-white font-bold">{currentSpeed}x</Text>
        </Pressable>
      </View>
    </View>
  );
};
