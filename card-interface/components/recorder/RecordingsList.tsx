import React from "react";
import { FlatList, View } from "react-native";
import { RecordingItem } from "./RecordingItem";
import { Recording } from "@/types/recording";

interface RecordingsListProps {
  recordings: Recording[];
  onPlay: (uri: string) => void;
  onDelete: (id: string) => void;
}

export const RecordingsList: React.FC<RecordingsListProps> = ({
  recordings,
  onPlay,
  onDelete,
}) => {
  return (
    <View className="h-1/3">
      <FlatList
        showsVerticalScrollIndicator={false}
        data={recordings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecordingItem
            recording={item}
            onPlay={() => onPlay(item.uri)}
            onDelete={() => onDelete(item.id)}
          />
        )}
      />
    </View>
  );
};
