import React, { useState } from "react";
import { FlatList, View, LayoutChangeEvent } from "react-native";
import { RecordingItem } from "./RecordingItem";
import { Recording } from "@/types/recording";

interface RecordingsListProps {
  recordings: Recording[];
  onPlay: (recording: Recording) => void;
  onDelete: (id: string) => void;
  onTranscribe: (recording: Recording) => void;
}

export const RecordingsList: React.FC<RecordingsListProps> = ({ recordings, onPlay, onDelete, onTranscribe }) => {
  const [containerHeight, setContainerHeight] = useState(0);

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setContainerHeight(height);
  };

  const renderItem = ({ item, index }: { item: Recording; index: number }) => {
    return (
      <RecordingItem
        recording={item}
        onPlay={() => onPlay(item)}
        onDelete={() => onDelete(item.id)}
        onTranscribe={() => onTranscribe(item)}
        containerHeight={containerHeight}
        itemIndex={index}
        totalItems={recordings.length}
      />
    );
  };

  return (
    <View
      onLayout={handleContainerLayout}
      className="flex-1"
    >
      <FlatList
        showsVerticalScrollIndicator={false}
        data={recordings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerClassName="pb-40"
      />
    </View>
  );
};
