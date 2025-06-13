import React, { useState, useEffect, useRef } from "react";
import { View, Pressable, Text } from "react-native";
import {
  Audio,
  AVPlaybackStatusSuccess,
  InterruptionModeAndroid,
  InterruptionModeIOS,
  AVPlaybackSource,
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
import { transcribeAudio } from "@/api/voice-transcript";
import { Vibration } from "react-native";

const startSound = require("@/assets/sounds/start.mp3");
const stopSound = require("@/assets/sounds/stop.mp3");
const music = require("@/assets/sounds/music.mp3");

export default function VoiceRecorder() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const [playbackPosition, setPlaybackPosition] = useState<number>(0);

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
      if (recording) return;
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

        Vibration.vibrate(100);

        // await playEffect(startSound).then(() => recording.startAsync());
        await recording.startAsync();
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

      // await playEffect(startSound);
      Vibration.vibrate(100);
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  const playSound = async (music?: AVPlaybackSource) => {
    // if (!recordedUri) return;

    // If playing already store the playback position and stop the music
    if (soundRef.current && isPlaying) {
      const { positionMillis } =
        (await soundRef.current.getStatusAsync()) as AVPlaybackStatusSuccess;
      await soundRef.current.stopAsync();
      setPlaybackPosition(positionMillis);
      // soundRef.current = null;
      setIsPlaying(false);
      // console.log("INFO =>", `STOP`, positionMillis);
      return;
    }

    //  if not playing and was stopped playing between then start from where it stopped.
    if (soundRef.current && !isPlaying) {
      // console.log("INFO =>", `CONTINUE`, playbackPosition);
      await soundRef.current.setStatusAsync({
        positionMillis: playbackPosition,
        shouldPlay: true,
      });

      setIsPlaying(true);
      return;
    }

    // console.log("INFO =>", `play first time`);

    // const { sound } = await Audio.Sound.createAsync({ uri: recordedUri });
    let newSound: Audio.Sound;
    if (!!music) {
      const { sound } = await Audio.Sound.createAsync(music);
      newSound = sound;
    } else {
      const { sound } = await Audio.Sound.createAsync({
        uri: recordedUri as string,
      });
      newSound = sound;
    }
    soundRef.current = newSound;
    setSound(newSound);
    setIsPlaying(true);
    await newSound.playAsync();

    newSound.setOnPlaybackStatusUpdate((status) => {
      if ((status as AVPlaybackStatusSuccess).didJustFinish) {
        setIsPlaying(false);
        newSound.unloadAsync();
        soundRef.current = null;
      }
    });
  };

  const stopSoundPlay = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      soundRef.current = null;
      setIsPlaying(false);
      setPlaybackPosition(0);
    }
  };

  const handleAudioTranscribe = async () => {
    await transcribeAudio(recordedUri as string);
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
    <View className="flex-1 mt-2">
      {/* Status indicators in fixed position above buttons */}
      <View
        className={`flex-row justify-between items-center p-2 ${
          isPlaying ? "bg-slate-300 text-white" : ""
        }`}
      >
        <Pressable
          onPress={() => playSound(music)}
          className="flex-1 h-10 justify-center"
        >
          <Text> 1. Sample Music</Text>
        </Pressable>
        {isPlaying && (
          <Pressable
            onPress={stopSoundPlay}
            className="w-[20px] h-[20px] rounded-full bg-red-500 justify-center items-center "
          >
            <Ionicons name="stop" size={10} color="white" />
          </Pressable>
        )}
      </View>

      {/* Buttons in fixed position below */}
      <View className="flex-row items-center justify-center gap-5 flex-1">
        <Pressable
          className={`w-[50px] h-[50px] rounded-full justify-center items-center ${
            recording ? "bg-red-500" : "bg-blue-500"
          }`}
          onPress={recording ? stopRecording : startRecording}
        >
          <Ionicons name="mic" size={24} color="white" />
        </Pressable>
      </View>
      <View className="flex gap-2 absolute bottom-0 w-full left-0  p-4 mb-4">
        {isPlaying && !recording && (
          <Animated.View
            className="flex-row items-center gap-1 justify-center p-2"
            style={playbackStyle}
          >
            <View className="w-[3px] h-[20px] bg-green-500 rounded-sm" />
            <View className="w-[3px] h-[30px] bg-green-500 rounded-sm" />
            <View className="w-[3px] h-[20px] bg-green-500 rounded-sm" />
            <Text className="text-green-500 text-base ml-2">Playing...</Text>
          </Animated.View>
        )}
        <View className=" flex-row justify-center gap-2">
          <Pressable
            className="w-[40px] h-[40px] rounded-full bg-green-500 justify-center items-center"
            onPress={() => playSound()}
          >
            {isPlaying ? (
              <Ionicons name="pause" size={20} color="white" />
            ) : (
              <Ionicons name="play" size={20} color="white" />
            )}
          </Pressable>
          {
            <Pressable
              className={`w-[40px] h-[40px] rounded-full bg-red-500 justify-center items-center  ${
                isPlaying || playbackPosition > 0 ? "block" : "invisible"
              }`}
              onPress={stopSoundPlay}
            >
              <Ionicons name="stop" size={20} color="white" />
            </Pressable>
          }
        </View>
      </View>
    </View>
  );
}
