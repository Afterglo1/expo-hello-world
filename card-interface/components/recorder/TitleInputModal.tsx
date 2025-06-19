import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";

interface TitleInputModalProps {
  visible: boolean;
  title: string;
  onTitleChange: (title: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const TitleInputModal: React.FC<TitleInputModalProps> = ({
  visible,
  title,
  onTitleChange,
  onSave,
  onCancel,
}) => {
  if (!visible) return null;

  return (
    <View className="absolute inset-0 bg-black/50 justify-center items-center">
      <View className="bg-white p-4 rounded-lg w-4/5">
        <Text className="text-lg font-semibold mb-4">Save Recording</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-2 mb-4"
          placeholder="Enter recording title"
          value={title}
          onChangeText={onTitleChange}
          autoFocus
        />
        <View className="flex-row justify-end gap-2">
          <Pressable
            className="px-4 py-2 bg-gray-300 rounded-lg"
            onPress={onCancel}
          >
            <Text>Cancel</Text>
          </Pressable>
          <Pressable
            className="px-4 py-2 bg-blue-500 rounded-lg"
            onPress={onSave}
          >
            <Text className="text-white">Save</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
