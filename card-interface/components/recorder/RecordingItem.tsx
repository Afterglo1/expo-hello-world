import React from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Recording } from "@/types/recording";

interface RecordingItemProps {
  recording: Recording;
  onPlay: () => void;
  onDelete: () => void;
}

export const RecordingItem: React.FC<RecordingItemProps> = ({ recording, onPlay, onDelete }) => {
  const handleDelete = () => {
    Alert.alert("Delete Recording", "Are you sure you want to delete this recording?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: onDelete },
    ]);
  };

  const formatDuration = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
      <View className="flex-1">
        <Text className="text-lg font-semibold">{recording.title}</Text>
        <View className="flex-row items-center gap-2">
          <Text className="text-sm text-gray-500">{new Date(recording.createdAt).toLocaleString("en-GB")}</Text>
          <Text className="text-sm text-gray-500">• {formatDuration(recording.duration)}</Text>
        </View>
      </View>
      <View className="flex-row gap-2">
        <Pressable
          className="p-2 bg-blue-500 rounded-full"
          onPress={onPlay}
        >
          <Ionicons
            name="play"
            size={20}
            color="white"
          />
        </Pressable>
        <Pressable
          className="p-2 bg-red-500 rounded-full"
          onPress={handleDelete}
        >
          <Ionicons
            name="trash"
            size={20}
            color="white"
          />
        </Pressable>
      </View>
    </View>
  );
};
