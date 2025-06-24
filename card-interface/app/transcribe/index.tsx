import RecordedList from "@/components/transcribe/RecordedList";
import Recorder from "@/components/transcribe/Recorder";
import { useRecordingsStore } from "@/hooks/useRecordingsStore";
import { useEffect } from "react";
import { View } from "react-native";

const Transcribe = () => {
  const { saveRecording, recordings, deleteRecording, loadRecordings } = useRecordingsStore();

  useEffect(() => {
    loadRecordings();
  }, []);

  return (
    <View className="flex-1">
      <RecordedList
        onDelete={deleteRecording}
        recordings={recordings}
      />
      <Recorder onSave={saveRecording} />
    </View>
  );
};

export default Transcribe;
