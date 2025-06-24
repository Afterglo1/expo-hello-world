import { transcribeAudio } from "@/api/voice-transcript";
import { useRecordingsStore } from "@/hooks/useRecordingsStore";
import { Recording } from "@/types/recording";
import { Ionicons } from "@expo/vector-icons";
import { Text, View, Pressable, ActivityIndicator, Alert } from "react-native";

interface DisplayTranscriptionProps {
  recording: Recording;
  processing: { id: string } | null;
  setProcessing: (val: { id: string } | null) => void;
}
const DisplayTranscription = ({ recording, processing, setProcessing }: DisplayTranscriptionProps) => {
  const { updateRecording } = useRecordingsStore();
  const { transcribedText, uri, id, title } = recording;

  const retryAudioTranscription = async () => {
    try {
      const fileInfo = {
        uri,
        type: "audio/m4a",
        name: title,
      };
      setProcessing({ id });
      const transcribedText = await transcribeAudio(fileInfo);
      if (typeof transcribedText === "string") {
        const updatedRecording = { ...recording, transcribedText };
        updateRecording(updatedRecording);
      }
    } catch (error) {
      console.error("Error transcribing recording:", error);
      Alert.alert("Error", "Failed to transcribe audio");
    } finally {
      setProcessing(null);
    }
  };

  if (processing?.id === id)
    return (
      <View className=" flex-1">
        <ActivityIndicator
          size="small"
          color="#0a9396"
        />
      </View>
    );

  return transcribedText ? (
    <Text numberOfLines={4}>{transcribedText}</Text>
  ) : (
    <View className="flex items-center my-1">
      <Pressable
        onPress={retryAudioTranscription}
        className="flex-row items-center gap-2 p-2 bg-[#ca66022e] rounded-2xl border border-[#ca66022e]"
        style={{ alignSelf: "center" }}
      >
        <Ionicons
          name="refresh"
          size={16}
          color="#bb3e03"
        />
        <Text className="text-[#bb3e03] font-semibold text-xs">Retry Transcription</Text>
      </Pressable>
      <Text className="text-xs text-gray-400 mt-2 text-center">
        Transcription failed or is missing. Tap to try again.
      </Text>
    </View>
  );
};
export default DisplayTranscription;
