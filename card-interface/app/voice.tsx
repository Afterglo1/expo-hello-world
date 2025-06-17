import React, { useEffect, useReducer, useRef, useState } from "react";
import { View, Alert } from "react-native";
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
import { RecordingsList } from "@/components/recorder/RecordingsList";
import { TitleInputModal } from "@/components/recorder/TitleInputModal";
import { useRecordings } from "@/hooks/useRecordings";
import { Recording } from "@/types/recording";
import {
  recordingReducer,
  initialRecordingState,
} from "@/reducers/recordingReducer";
import {
  playbackReducer,
  initialPlaybackState,
} from "@/reducers/playbackReducer";

const music = require("@/assets/sounds/music.mp3");

export default function VoiceRecorder() {
  const [recordingState, recordingDispatch] = useReducer(
    recordingReducer,
    initialRecordingState
  );
  const [playbackState, playbackDispatch] = useReducer(
    playbackReducer,
    initialPlaybackState
  );

  // Destructure recording state
  const {
    recording,
    recordedUri,
    recordingTitle,
    isTitleModalVisible,
    recordingDuration,
  } = recordingState;

  // Destructure playback state
  const {
    isPlaying,
    playbackPosition,
    playbackSpeed,
    isSeeking,
    playbackStatus: { positionMillis, durationMillis },
  } = playbackState;

  // Sound reference
  const soundRef = useRef<Audio.Sound | null>(null);

  // Animation values
  const waveScale = useSharedValue(1);
  const waveOpacity = useSharedValue(0.5);
  const playbackOpacity = useSharedValue(0.5);

  // Custom hooks
  const { recordings, saveRecording, deleteRecording } = useRecordings();

  // Animation values for waves
  const waveHeights = Array.from({ length: 5 }, () => useSharedValue(10));
  const waveOpacities = Array.from({ length: 5 }, () => useSharedValue(0.5));

  // Add new state for track duration
  const [duration, setDuration] = useState<number>(0);

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
        const status = await (recording as Audio.Recording).getStatusAsync();
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
      if (recording || !granted) return;

      await stopSoundPlay();
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

      recordingDispatch({ type: "START_RECORDING", payload: newRecording });
      Vibration.vibrate(100);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;
      const { durationMillis } = await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      if (!uri) throw new Error("Failed to get recording URI");

      recordingDispatch({
        type: "STOP_RECORDING",
        payload: { uri, duration: durationMillis || 0 },
      });
      recordingDispatch({ type: "SET_TITLE_MODAL_VISIBLE", payload: true });
      Vibration.vibrate(100);
    } catch (err) {
      console.error("Failed to stop recording", err);
      recordingDispatch({ type: "RESET_RECORDING" });
    }
  };

  const playSound = async (music?: AVPlaybackSource) => {
    if (!music) {
      if (soundRef.current && isPlaying) {
        await soundRef.current.stopAsync();
        playbackDispatch({ type: "PAUSE_PLAYBACK", payload: positionMillis });
        return;
      }

      if (soundRef.current && !isPlaying) {
        await soundRef.current.setStatusAsync({
          positionMillis: playbackPosition,
          shouldPlay: true,
        });
        playbackDispatch({
          type: "START_PLAYBACK",
          payload: { position: playbackPosition, duration: durationMillis },
        });
        return;
      }
    }

    if (soundRef.current) {
      await soundRef.current.unloadAsync();
    }

    try {
      const { sound } = await Audio.Sound.createAsync(
        music || { uri: recordedUri as string }
      );
      soundRef.current = sound;

      const status = (await sound.getStatusAsync()) as AVPlaybackStatusSuccess;
      if (status.isLoaded) {
        playbackDispatch({
          type: "START_PLAYBACK",
          payload: { position: 0, duration: status.durationMillis || 0 },
        });
        await sound.playAsync();

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && !isSeeking) {
            if (status.isPlaying) {
              playbackDispatch({
                type: "UPDATE_PLAYBACK_STATUS",
                payload: {
                  position: status.positionMillis,
                  duration: status.durationMillis as number,
                },
              });
            }
            if (status.didJustFinish) {
              playbackDispatch({ type: "STOP_PLAYBACK" });
              sound.unloadAsync();
              soundRef.current = null;
            }
          }
        });
      }
    } catch (error) {
      console.error("Error playing sound:", error);
      alert(
        "No audio available, Please select the sample music or record an audio"
      );
    }
  };

  const stopSoundPlay = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        playbackDispatch({ type: "STOP_PLAYBACK" });
      } catch (error) {
        console.error("Error stopping sound:", error);
      }
    }
  };

  const handleSpeedChange = async (speed: number) => {
    playbackDispatch({ type: "SET_PLAYBACK_SPEED", payload: speed });
    if (!isPlaying || !soundRef.current) return;
    try {
      await soundRef.current.setRateAsync(speed, true);
    } catch (error) {
      console.error("Error changing playback speed:", error);
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
      playbackDispatch({ type: "SET_SEEKING", payload: true });
    }
  };

  const handleSeekComplete = async (value: number) => {
    if (soundRef.current) {
      try {
        await soundRef.current.setPositionAsync(value);
        playbackDispatch({ type: "SET_SEEKING", payload: false });
        // Update playback status
        playbackDispatch({
          type: "UPDATE_PLAYBACK_STATUS",
          payload: { position: value, duration: durationMillis },
        });
        // Update position without affecting playing state
        playbackDispatch({ type: "UPDATE_POSITION", payload: value });
      } catch (error) {
        console.error("Error seeking:", error);
        playbackDispatch({ type: "SET_SEEKING", payload: false });
      }
    }
  };

  const handleSaveRecording = async () => {
    if (!recordedUri || !recordingTitle.trim()) {
      Alert.alert("Error", "Please enter a title for your recording");
      return;
    }

    const newRecording: Recording = {
      id: Date.now().toString(),
      title: recordingTitle.trim(),
      uri: recordedUri,
      duration: recordingDuration,
      createdAt: Date.now(),
    };

    await saveRecording(newRecording);
    recordingDispatch({ type: "RESET_RECORDING" });
  };

  // Add cleanup function for recording
  const cleanupRecording = () => {
    if (recording) {
      recording.stopAndUnloadAsync().catch(console.error);
    }
    recordingDispatch({ type: "RESET_RECORDING" });
  };

  // Update TitleInputModal cancel handler
  const handleCancelRecording = () => {
    cleanupRecording();
    recordingDispatch({ type: "SET_TITLE_MODAL_VISIBLE", payload: false });
  };

  return (
    <View className="flex-1 mt-2">
      <SampleMusicPlayer
        isPlaying={isPlaying}
        onPlay={() => playSound(music)}
        onStop={stopSoundPlay}
      />
      <RecordingsList
        recordings={recordings}
        onPlay={(uri) => playSound({ uri })}
        onDelete={deleteRecording}
      />

      <RecordingButton
        isRecording={!!recording}
        waveStyle={waveStyle}
        onPress={recording ? stopRecording : startRecording}
      />

      <PlaybackControls
        isPlaying={isPlaying}
        playbackStatus={{ positionMillis, durationMillis }}
        playbackOpacity={playbackOpacity}
        onPlayPause={() => playSound()}
        onStop={stopSoundPlay}
        onSeek={handleSeek}
        onSeekComplete={handleSeekComplete}
        onSpeedChange={handleSpeedChange}
        currentSpeed={playbackSpeed}
      />

      <TitleInputModal
        visible={isTitleModalVisible}
        title={recordingTitle}
        onTitleChange={(title) =>
          recordingDispatch({ type: "SET_RECORDING_TITLE", payload: title })
        }
        onSave={handleSaveRecording}
        onCancel={handleCancelRecording}
      />
    </View>
  );
}
