import { formatDuration } from "@/utils/formatDuration";
import { formatTimestamp } from "@/utils/formatTimestamp";
import { Ionicons } from "@expo/vector-icons";
import { Audio, AVPlaybackStatusSuccess } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, Modal, Alert } from "react-native";

interface RecordedItemProps {
  recording: {
    duration: number;
    transcription?: string;
    createdAt: number;
    uri: string;
    id: string;
  };
  onDelete: (id: string) => void;
  isNew: boolean;
  currentlyPlaying: string | null;
  onSetCurrentlyPlaying: () => void;
}
const RecordedItem = (props: RecordedItemProps) => {
  const {
    recording: { createdAt, duration, transcription, uri, id },
    onDelete,
    isNew,
    currentlyPlaying,
    onSetCurrentlyPlaying,
  } = props;
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showOptionsModal, setShowOptionsModal] = useState<boolean>(false);
  const [playbackPosition, setPlaybackPosition] = useState<number>(0);
  const audioRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    if (currentlyPlaying !== id) {
      clearPlayback();
    }
  }, [currentlyPlaying]);

  // handle the first time playing of audio
  const handleAudioInitialPlay = async () => {
    const { sound } = await Audio.Sound.createAsync({ uri });
    sound.playAsync();
    audioRef.current = sound;
    onSetCurrentlyPlaying();

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && (status as AVPlaybackStatusSuccess).didJustFinish) {
        sound.unloadAsync();
        audioRef.current = null;
        setIsPlaying(false);
        setPlaybackPosition(0);
      }
    });
  };

  // handle audio playback. If the audio is not playing start it. If it is paused continue playing where it was stopped.
  const handlePlayPauseAudio = async () => {
    if (isPlaying) {
      const { positionMillis } = (await audioRef.current?.getStatusAsync()) as AVPlaybackStatusSuccess;
      setPlaybackPosition(positionMillis);
      await audioRef.current?.stopAsync();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        await audioRef.current?.setStatusAsync({ shouldPlay: true, positionMillis: playbackPosition });
      } else {
        await handleAudioInitialPlay();
      }
      setIsPlaying(true);
    }
  };

  const handleDeleteRecording = () => {
    Alert.alert("Delete", "Are you sure you want to delete the recording.?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          handleMenuPress();
          onDelete(id);
        },
      },
    ]);
  };

  const handleMenuPress = () => {
    setShowOptionsModal(!showOptionsModal);
  };

  const clearPlayback = async () => {
    await audioRef.current?.unloadAsync();
    audioRef.current = null;
    setIsPlaying(false);
    setPlaybackPosition(0);
  };

  return (
    <View className="p-4 border border-[#0060732c] rounded-lg relative gap-2">
      <View className=" flex-row justify-between ">
        <View className="flex-row items-center gap-2">
          {isNew && (
            <Text className=" text-white text-xs uppercase p-1 px-2 rounded-2xl bg-[#005f73] text-center font-bold">
              New{" "}
            </Text>
          )}
          <Text className="text-sm font-semibold text-slate-400">{formatTimestamp(createdAt)}</Text>
        </View>
        <Pressable
          className="flex-row justify-between p-1 px-3 bg-gray-200 rounded-xl items-center gap-1"
          onPress={handlePlayPauseAudio}
        >
          <Text>
            <Ionicons
              color="#005f73"
              size={12}
              name={`${isPlaying ? "pause" : "play"}`}
            />
          </Text>
          <Text className="text-sm font-bold">{formatDuration(duration)}</Text>
        </Pressable>
      </View>
      <View>
        <Text>{transcription || "Transcription text will appear here"}</Text>
      </View>
      <Pressable
        className="p-2 pt-4 items-end"
        onPress={handleMenuPress}
      >
        <Text>
          <Ionicons
            name="ellipsis-vertical"
            size={12}
            color="gray"
          />
        </Text>
      </Pressable>

      {/* Modal to show options for the audio */}
      {/* {showOptionsModal && ( */}
      <Modal
        visible={showOptionsModal}
        animationType="slide"
        transparent
        className="px-10"
      >
        <View className="flex-1 h-full w-full box-border ">
          <Pressable
            onPress={handleMenuPress}
            className="absolute w-full h-screen top-0 left-0"
          />
          <View className="flex-1 absolute bottom-0 w-full mx-auto shadow-xl bg-white rounded-3xl p-4 pb-14">
            <View className="flex-row justify-between items-center py-4">
              <Text className="text-center font-bold flex-1">Note Settings</Text>
              <Pressable
                className="p-1 bg-gray-100 rounded-full"
                onPress={handleMenuPress}
              >
                <Text className="font-bold">
                  <Ionicons
                    name="close"
                    size={18}
                    color="gray"
                  />
                </Text>
              </Pressable>
            </View>

            <View className="gap-4">
              <Pressable
                className="flex-row border border-[#00607329] rounded-3xl p-4 items-center gap-1"
                onPress={handleDeleteRecording}
              >
                <Ionicons
                  name="trash"
                  size={18}
                  color="#005f73"
                />
                <Text className="text-base text-[#005f73] font-semibold"> Delete this note</Text>
              </Pressable>
              <Pressable className="flex-row border border-[#00607329] rounded-3xl p-4 items-center gap-1">
                <Ionicons
                  name="download"
                  size={18}
                  color="#005f73"
                />
                <Text className="text-base text-[#005f73] font-semibold"> Download Audio</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* )} */}
    </View>
  );
};

export default RecordedItem;
