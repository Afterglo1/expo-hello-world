import { FlatList } from "react-native";
import RecordedItem from "./RecordedItem";
import { Recording } from "@/types/recording";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

interface RecordedListProps {
  recordings: Recording[];
  onDelete: (id: string) => void;
}

const RecordedList = (props: RecordedListProps) => {
  const { onDelete, recordings } = props;
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setCurrentlyPlaying(null);
      };
    }, [])
  );

  const renderItem = ({ item, index }: { item: Recording; index: number }) => {
    return (
      <RecordedItem
        onDelete={onDelete}
        recording={item}
        isNew={index === 0}
        currentlyPlaying={currentlyPlaying}
        onSetCurrentlyPlaying={() => setCurrentlyPlaying(item.id)}
      />
    );
  };
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={recordings}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerClassName="gap-4 px-4 py-10"
    />
  );
};

export default RecordedList;
