import React, { useState, useEffect } from "react";
import { View, Pressable, Text } from "react-native";
import {
  Audio,
  AVPlaybackStatusSuccess,
  InterruptionModeAndroid,
  InterruptionModeIOS,
} from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

const startSound = require("@/assets/sounds/start.mp3");
const stopSound = require("@/assets/sounds/stop.mp3");

export default function VoiceRecorder() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  // const [metering, setMetering] = useState<number>(0);

  // Animation values
  const waveHeight = useSharedValue(20);
  const opacity = useSharedValue(0.5);

  // Update metering during recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (recording) {
      interval = setInterval(async () => {
        const status = await recording.getStatusAsync();
        if (status.isRecording) {
          // Convert metering value to a height between 20 and 60
          const newHeight = Math.max(
            20,
            Math.min(60, 20 + Math.abs(status.metering || 0) / 2)
          );
          waveHeight.value = withTiming(newHeight, { duration: 100 });
          // setMetering(status.metering || 0);
        }
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [recording]);

  // Reset animation when not recording
  useEffect(() => {
    if (!recording) {
      waveHeight.value = withTiming(20);
      opacity.value = withTiming(0.5);
    } else {
      opacity.value = withTiming(1);
    }
  }, [recording]);

  // 🔊 Utility to play a sound
  const playEffect = async (soundPath: any) => {
    const { sound } = await Audio.Sound.createAsync(soundPath);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if ((status as any).didJustFinish) {
        sound.unloadAsync();
      }
    });
  };

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (granted) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        const newRecording = new Audio.Recording();
        await newRecording.prepareToRecordAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        await newRecording.startAsync();
        await playEffect(startSound);
        setRecording(newRecording);
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;
      const { durationMillis, isDoneRecording } =
        await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordedUri(uri);
      setRecording(null);
      await playEffect(stopSound);
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  const playSound = async () => {
    if (!recordedUri) return;
    const { sound } = await Audio.Sound.createAsync({ uri: recordedUri });
    setSound(sound);
    await sound.playAsync();
    //  const {}= await sound.()
  };

  const waveStyle = useAnimatedStyle(() => ({
    height: waveHeight.value,
    opacity: opacity.value,
  }));

  return (
    <View className="flex-1 justify-center items-center p-5">
      <View className="flex-row items-center justify-center gap-5">
        {recording && (
          <View className="flex-row items-center gap-2.5">
            <Animated.View
              className="w-[3px] bg-blue-500 rounded-sm"
              style={waveStyle}
            />
            <Text className="text-blue-500 text-base">Recording...</Text>
          </View>
        )}
        <Pressable
          className={`w-[50px] h-[50px] rounded-full justify-center items-center ${
            recording ? "bg-red-500" : "bg-blue-500"
          }`}
          onPress={recording ? stopRecording : startRecording}
        >
          <Ionicons name={recording ? "stop" : "mic"} size={24} color="white" />
        </Pressable>
        {recordedUri && !recording && (
          <Pressable
            className="w-[50px] h-[50px] rounded-full bg-green-500 justify-center items-center "
            onPress={playSound}
          >
            <Ionicons name="play" size={24} color="white" />
          </Pressable>
        )}
      </View>
    </View>
  );
}
