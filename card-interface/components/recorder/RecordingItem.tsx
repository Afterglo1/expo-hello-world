import React, { useState } from "react";
import { View, Text, Pressable, Alert, LayoutChangeEvent } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Recording } from "@/types/recording";

interface RecordingItemProps {
  recording: Recording;
  onPlay: () => void;
  onDelete: () => void;
  onTranscribe: () => void;
  containerHeight?: number;
  itemIndex?: number;
  totalItems?: number;
}

export const RecordingItem: React.FC<RecordingItemProps> = ({
  recording,
  onPlay,
  onDelete,
  onTranscribe,
  containerHeight = 0,
  itemIndex = 0,
  totalItems = 0,
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState<"above" | "below">("below");
  const [itemHeight, setItemHeight] = useState(0);

  const handlePlay = () => {
    setIsMenuVisible(false);
    onPlay();
  };

  const handleDelete = () => {
    setIsMenuVisible(false);
    Alert.alert("Delete Recording", "Are you sure you want to delete this recording?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: onDelete },
    ]);
  };

  const handleTranscribe = () => {
    setIsMenuVisible(false);
    onTranscribe();
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setItemHeight(height);
  };

  const handleMenuPress = () => {
    // Calculate position based on item index and height
    const estimatedItemHeight = 80; // Approximate height of each item
    const itemPosition = itemIndex * estimatedItemHeight;
    const menuHeight = 120; // Estimated menu height

    // Calculate available space
    const spaceBelow = containerHeight - (itemPosition + itemHeight + menuHeight);
    const spaceAbove = itemPosition - menuHeight;

    // Position menu above if there's not enough space below, but enough space above
    if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
      setMenuPosition("above");
    } else {
      setMenuPosition("below");
    }

    setIsMenuVisible(true);
  };

  const formatDuration = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getMenuPositionStyle = () => {
    const baseStyle = "absolute bg-white rounded-lg shadow-lg border border-gray-200 min-w-[150px] z-50";

    if (menuPosition === "above") {
      return `${baseStyle} bottom-10 right-0`;
    } else {
      return `${baseStyle} top-10 right-0`;
    }
  };

  return (
    <View
      className="flex-row items-center justify-between p-2 px-4 border-b border-gray-200"
      onLayout={handleLayout}
    >
      <View className="flex-1">
        <Text className="text-lg font-semibold">{recording.title}</Text>
        <View className="flex-row items-center gap-2">
          <Text className="text-sm text-gray-500">{new Date(recording.createdAt).toLocaleString("en-GB")}</Text>
          <Text className="text-sm text-gray-500">• {formatDuration(recording.duration)}</Text>
        </View>
      </View>
      <View className="relative">
        <Pressable
          className="p-2"
          onPress={handleMenuPress}
        >
          <Ionicons
            name="ellipsis-vertical"
            size={20}
            color="gray"
          />
        </Pressable>

        {isMenuVisible && (
          <View className={`${getMenuPositionStyle()}`}>
            <Pressable
              className="py-3 px-4 border-b border-gray-100"
              onPress={handlePlay}
            >
              <Text className="text-gray-800">Play</Text>
            </Pressable>

            <Pressable
              className="py-3 px-4 border-b border-gray-100"
              onPress={handleTranscribe}
            >
              <Text className="text-gray-800">Transcribe</Text>
            </Pressable>

            <Pressable
              className="py-3 px-4"
              onPress={handleDelete}
            >
              <Text className="text-red-600">Delete</Text>
            </Pressable>
          </View>
        )}
      </View>
      {/* Overlay to close menu when tapping outside */}
      {isMenuVisible && (
        <Pressable
          className="absolute inset-0 z-40"
          onPress={() => setIsMenuVisible(false)}
        />
      )}
    </View>
  );
};
