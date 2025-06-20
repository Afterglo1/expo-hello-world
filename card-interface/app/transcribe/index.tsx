import RecordedList from "@/components/transcribe/RecordedList";
import Recorder from "@/components/transcribe/Recorder";
import { useRecordings } from "@/hooks/useRecordings";
import { View } from "react-native";

const Transcribe = () => {
  const { saveRecording, recordings, deleteRecording } = useRecordings();

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
