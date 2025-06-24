import { useRecordings } from "@/hooks/useRecordings";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { formatTimestamp } from "@/utils/formatTimestamp";
import { Recording } from "@/types/recording";
import { useEffect, useState } from "react";
import Playback from "@/components/transcribe/Playback";
import TranscriptDetailTabs from "@/components/transcribe/TranscriptDetailTabs";

const TranscribedAudioComponent = () => {
  const { audioId } = useLocalSearchParams();
  const { recordings } = useRecordings();
  const [recordingData, setRecordingData] = useState<Recording | null>(null);

  const fetchRecordingData = () => {
    const recording = recordings.filter((item) => item.id === audioId).at(0) as Recording;
    setRecordingData(recording);
  };

  useEffect(() => {
    fetchRecordingData();
  }, [recordings]);

  const naviagateBack = () => {
    router.back();
  };

  if (!recordingData) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator
          size="small"
          color="#005f73"
        />
      </View>
    );
  }

  return (
    <View className="p-4">
      <View>
        <Pressable
          className="p-2 bg-slate-200 rounded-full self-start"
          onPress={naviagateBack}
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color="#005f73"
          />
        </Pressable>
      </View>
      <View className="py-2 mt-2">
        <Text className="font-bold text-xl ">Transcription Title</Text>
        <Text className="text-slate-400 text-xs font-semibold">{formatTimestamp(recordingData?.createdAt)}</Text>
      </View>
      <Playback uri={recordingData?.uri} />
      <TranscriptDetailTabs recording={recordingData} />
    </View>
  );
};

export default TranscribedAudioComponent;
