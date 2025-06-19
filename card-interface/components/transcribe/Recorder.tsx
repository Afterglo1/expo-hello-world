import { useRecordings } from "@/hooks/useRecordings";
import { Recording } from "@/types/recording";
import { formatDuration } from "@/utils/formatDuration";
import { Ionicons } from "@expo/vector-icons";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { useRef, useState } from "react";
import { Pressable, View, Modal, Text, Vibration } from "react-native";

const Recorder = () => {
  const [openRecordingModal, setOpenRecordingModal] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [recordingState, setRecordingState] = useState<"start" | "pause" | null>(null);
  const { saveRecording } = useRecordings();

  const handleRecording = () => {
    setOpenRecordingModal(true);
    startRecording();
  };

  const closeModal = () => {
    setOpenRecordingModal(false);
  };

  // Configure audio recording properties
  const configRecording = async () => {
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) return;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  };

  // start recording audio
  const startRecording = async () => {
    try {
      await configRecording();
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await newRecording.startAsync();
      recordingRef.current = newRecording;
      setRecordingState("start");
      newRecording.setOnRecordingStatusUpdate((status) => {
        const { durationMillis } = status;
        setRecordingDuration(durationMillis);
      });

      Vibration.vibrate(100);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const pauseContinueRecording = async () => {
    if (recordingState === "start") {
      await recordingRef.current?.pauseAsync();
      setRecordingState("pause");
    } else if (recordingState === "pause") {
      await recordingRef?.current?.startAsync();
      setRecordingState("start");
    }
  };

  // discard the recorded auio and close the modal
  const stopAndDiscardRecording = async () => {
    if (recordingRef.current) {
      await recordingRef.current.stopAndUnloadAsync();
    }
    Vibration.vibrate(100);
    setOpenRecordingModal(false);
  };

  // save the recorded auio and close the modal
  const stopAndSaveRecording = async () => {
    try {
      (await recordingRef.current?.stopAndUnloadAsync()) as Audio.RecordingStatus;
      const uri = recordingRef.current?.getURI() as string;
      Vibration.vibrate(100);

      const newRecording: Recording = {
        id: Date.now().toString(),
        title: Date.now().toString(),
        uri: uri,
        duration: recordingDuration,
        createdAt: Date.now(),
      };

      //   alert(JSON.stringify(newRecording));

      saveRecording(newRecording);
      recordingRef.current = null;
      setRecordingState(null);
      setOpenRecordingModal(false);
    } catch (error) {
      console.log("ERROR =>", error);
    }
  };

  return (
    <View className="flex-1 flex-row w-full absolute bottom-2  justify-center ">
      <Pressable
        className="p-4 shadow-md  rounded-full bg-blue-600 border border-gray-400"
        onPress={handleRecording}
      >
        <Ionicons
          name="mic"
          color="white"
          size={20}
        />
      </Pressable>
      {openRecordingModal && (
        <Modal
          visible={openRecordingModal}
          onRequestClose={stopAndDiscardRecording}
          animationType="slide"
          transparent
          className="px-10"
        >
          <View className=" flex-1 w-full box-border h-1/5 absolute bottom-10  ">
            <View className=" flex-1 w-11/12 mx-auto shadow-xl bg-white rounded-3xl p-4">
              <Text className="text-center font-bold">Recording Audio</Text>
              <View className="py-2 items-center h-20 justify-center ">
                <Text>Audio Waves</Text>
              </View>
              <View className="py-2 items-center">
                <Text className="font-bold">{formatDuration(recordingDuration)}</Text>
              </View>
              <View className="flex-row gap-3 justify-between items-center">
                <Pressable
                  className="border rounded-full p-2 border-slate-300"
                  onPress={stopAndDiscardRecording}
                >
                  <Ionicons
                    name="close"
                    size={16}
                    color="blue"
                  />
                </Pressable>
                <Pressable
                  className="bg-blue-600 py-2 px-4 rounded-xl"
                  onPress={stopAndSaveRecording}
                >
                  <Text className="text-white">Stop Recording</Text>
                </Pressable>
                <Pressable
                  className="border rounded-full p-2 border-slate-300"
                  onPress={pauseContinueRecording}
                >
                  <Ionicons
                    name={`${recordingState === "start" ? "pause" : "play"}`}
                    size={16}
                    color="blue"
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Recorder;
