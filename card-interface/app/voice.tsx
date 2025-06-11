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
  withSequence,
} from "react-native-reanimated";

const startSound = require("@/assets/sounds/start.mp3");
const stopSound = require("@/assets/sounds/stop.mp3");

export default function VoiceRecorder() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Animation values for waves
  const waveHeights = Array.from({ length: 5 }, () => useSharedValue(10));
  const waveOpacities = Array.from({ length: 5 }, () => useSharedValue(0.5));
  const playbackOpacity = useSharedValue(0.5);

  // Update metering during recording
  useEffect(() => {
    let interval: number;
    if (recording) {
      interval = setInterval(async () => {
        const status = await recording.getStatusAsync();
        if (status.isRecording) {
          // Update each wave with different heights based on metering
          waveHeights.forEach((height, index) => {
            const baseHeight = Math.max(
              10,
              Math.min(60, 10 + Math.abs(status.metering || 0) / 2)
            );
            const offset = index * 5; // Stagger the heights
            height.value = withTiming(baseHeight + offset, { duration: 100 });
          });
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
      waveHeights.forEach((height) => {
        height.value = withTiming(20);
      });
      waveOpacities.forEach((opacity) => {
        opacity.value = withTiming(0.5);
      });
    } else {
      waveOpacities.forEach((opacity) => {
        opacity.value = withTiming(1);
      });
    }
  }, [recording]);

  // Animate playback indicator
  useEffect(() => {
    if (isPlaying) {
      playbackOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(0.5, { duration: 500 })
        ),
        -1,
        true
      );
    } else {
      playbackOpacity.value = withTiming(0.5);
    }
  }, [isPlaying]);

  // 🔊 Utility to play a sound
  const playEffect = async (soundPath: any): Promise<void> => {
    return new Promise((resolve) => {
      Audio.Sound.createAsync(soundPath).then(({ sound }) => {
        sound.playAsync();
        sound.setOnPlaybackStatusUpdate((status) => {
          if ((status as AVPlaybackStatusSuccess).didJustFinish) {
            sound.unloadAsync();
            resolve();
          }
        });
      });
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
        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );

        await playEffect(startSound).then(() => recording.startAsync());

        setRecording(recording);
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
      alert(
        `Recording successful.\nDuration : ${Math.floor(
          durationMillis / 1000
        )} s`
      );
      await playEffect(stopSound);
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  const playSound = async () => {
    if (!recordedUri) return;
    const { sound } = await Audio.Sound.createAsync({ uri: recordedUri });
    setSound(sound);
    setIsPlaying(true);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if ((status as AVPlaybackStatusSuccess).didJustFinish) {
        setIsPlaying(false);
        sound.unloadAsync();
      }
    });
  };

  const waveStyles = waveHeights.map((height, index) =>
    useAnimatedStyle(() => ({
      height: height.value,
      opacity: waveOpacities[index].value,
    }))
  );

  const playbackStyle = useAnimatedStyle(() => ({
    opacity: playbackOpacity.value,
  }));

  return (
    <View className="flex-1 justify-center items-center p-5">
      {/* Status indicators in fixed position above buttons */}
      <View className="h-[40px] mb-4 justify-center items-center">
        {recording && (
          <View className="flex-row items-center gap-1">
            {waveStyles.map((style, index) => (
              <Animated.View
                key={index}
                className="w-[3px] bg-blue-500 rounded-sm"
                style={style}
              />
            ))}
            <Text className="text-blue-500 text-base ml-2">Recording...</Text>
          </View>
        )}
        {isPlaying && !recording && (
          <Animated.View
            className="flex-row items-center gap-1"
            style={playbackStyle}
          >
            <View className="w-[3px] h-[20px] bg-green-500 rounded-sm" />
            <View className="w-[3px] h-[30px] bg-green-500 rounded-sm" />
            <View className="w-[3px] h-[20px] bg-green-500 rounded-sm" />
            <Text className="text-green-500 text-base ml-2">Playing...</Text>
          </Animated.View>
        )}
      </View>

      {/* Buttons in fixed position below */}
      <View className="flex-row items-center justify-center gap-5">
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
            className="w-[50px] h-[50px] rounded-full bg-green-500 justify-center items-center"
            onPress={playSound}
          >
            <Ionicons name="play" size={24} color="white" />
          </Pressable>
        )}
      </View>
    </View>
  );
}
