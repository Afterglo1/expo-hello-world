import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import {
  Audio,
  AVPlaybackStatusSuccess,
  InterruptionModeAndroid,
  InterruptionModeIOS,
  AVPlaybackSource,
} from "expo-av";
import { Vibration } from "react-native";
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  useAnimatedStyle,
} from "react-native-reanimated";
import { PlaybackControls } from "@/components/recorder/PlaybackControls";
import { RecordingButton } from "@/components/recorder/RecordingButton";
import { SampleMusicPlayer } from "@/components/recorder/SampleMusicPlayer";
import { transcribeAudio } from "@/api/voice-transcript";

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

  // Add new animation value for the wave
  const waveScale = useSharedValue(1);
  const waveOpacity = useSharedValue(0.5);

  // Add new state for track duration
  const [duration, setDuration] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState(false);

  // Add new state for playback status
  const [playbackStatus, setPlaybackStatus] = useState<{
    positionMillis: number;
    durationMillis: number;
  }>({ positionMillis: 0, durationMillis: 0 });

  // Update metering during recording
  useEffect(() => {
    let interval: number;
    if (recording) {
      // Start the wave animation
      waveScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      );
      waveOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1000 }),
          withTiming(0.3, { duration: 1000 })
        ),
        -1,
        true
      );

      interval = setInterval(async () => {
        const status = await recording.getStatusAsync();
        if (status.isRecording) {
          // Update wave scale based on metering
          const meteringValue = Math.abs(status.metering || 0);
          const scaleValue = 1 + meteringValue / 80;
          waveScale.value = withTiming(scaleValue, { duration: 100 });
        }
      }, 100);
    } else {
      // Reset wave animation when not recording
      waveScale.value = withTiming(1);
      waveOpacity.value = withTiming(0);
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
    if (soundRef.current && isPlaying) {
      const { positionMillis } =
        (await soundRef.current.getStatusAsync()) as AVPlaybackStatusSuccess;
      await soundRef.current.stopAsync();
      setPlaybackPosition(positionMillis);
      setIsPlaying(false);
      return;
    }

    if (soundRef.current && !isPlaying) {
      await soundRef.current.setStatusAsync({
        positionMillis: playbackPosition,
        shouldPlay: true,
      });
      setIsPlaying(true);
      return;
    }

    try {
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

      // Get initial status
      const status =
        (await newSound.getStatusAsync()) as AVPlaybackStatusSuccess;
      if (status.isLoaded) {
        setPlaybackStatus({
          positionMillis: 0,
          durationMillis: status.durationMillis || 0,
        });
      }

      soundRef.current = newSound;
      setSound(newSound);
      setIsPlaying(true);
      await newSound.playAsync();

      // Set up more frequent status updates
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          if (!isSeeking) {
            setPlaybackStatus({
              positionMillis: status.positionMillis,
              durationMillis: status.durationMillis as number,
            });
            setPlaybackPosition(status.positionMillis);
          }

          if (status.didJustFinish) {
            setIsPlaying(false);
            setPlaybackPosition(0);
            setPlaybackStatus((prev) => ({ ...prev, positionMillis: 0 }));
            newSound.unloadAsync();
            soundRef.current = null;
          }
        }
      });
    } catch (error) {
      console.error("Error playing sound:", error);
    }
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

  // Add new animated style for the wave
  const waveStyle = useAnimatedStyle(() => ({
    transform: [{ scale: waveScale.value }],
    opacity: waveOpacity.value,
  }));

  // Optimize seek handling
  const handleSeek = async (value: number) => {
    if (soundRef.current) {
      setIsSeeking(true);
      setPlaybackStatus((prev) => ({ ...prev, positionMillis: value }));
      setPlaybackPosition(value);
    }
  };

  const handleSeekComplete = async (value: number) => {
    if (soundRef.current) {
      try {
        await soundRef.current.setPositionAsync(value);
        setIsSeeking(false);
      } catch (error) {
        console.error("Error seeking:", error);
      }
    }
  };

  return (
    <View className="flex-1 mt-2">
      <SampleMusicPlayer
        isPlaying={isPlaying}
        onPlay={() => playSound(music)}
        onStop={stopSoundPlay}
      />

      <RecordingButton
        isRecording={!!recording}
        waveStyle={waveStyle}
        onPress={recording ? stopRecording : startRecording}
      />

      <PlaybackControls
        isPlaying={isPlaying}
        playbackStatus={playbackStatus}
        playbackOpacity={playbackOpacity}
        onPlayPause={() => playSound()}
        onStop={stopSoundPlay}
        onSeek={handleSeek}
        onSeekComplete={handleSeekComplete}
      />
    </View>
  );
}
