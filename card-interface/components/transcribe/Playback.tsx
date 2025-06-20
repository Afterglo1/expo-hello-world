import React, { useEffect, useRef, useState } from "react";
import { View, Pressable, Text, GestureResponderEvent } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { formatDuration } from "@/utils/formatDuration";
import { Audio, AVPlaybackStatusSuccess } from "expo-av";

interface Playback {
  uri: string;
}

const Playback: React.FC<Playback> = ({ uri }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackStatus, setPlaybackstatus] = useState({ position: 0, duration: 0 });
  const audioRef = useRef<Audio.Sound | null>(null);

  const loadAudio = async () => {
    const { sound, status } = await Audio.Sound.createAsync({ uri });
    setPlaybackstatus({
      position: (status as AVPlaybackStatusSuccess).positionMillis,
      duration: (status as AVPlaybackStatusSuccess).durationMillis as number,
    });

    audioRef.current = sound;

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        if (status.isPlaying)
          setPlaybackstatus({ position: status.positionMillis, duration: status.durationMillis as number });
        if (status.didJustFinish) {
          setIsPlaying(false);
          setPlaybackstatus((prev) => ({ ...prev, position: 0 }));
        }
      }
    });
  };

  const handleSeek = (value: number) => {
    setPlaybackstatus({ ...playbackStatus, position: value });
  };

  const handleSeekComplete = async (value: number) => {
    if (isPlaying) {
      await audioRef.current?.setStatusAsync({ positionMillis: value, shouldPlay: true });
    } else {
      setPlaybackstatus({ ...playbackStatus, position: value });
    }
  };

  const handleTrackPress = (e: GestureResponderEvent) => {
    const { locationX } = e.nativeEvent;
    e.currentTarget.measure(async (x, y, width) => {
      const percentage = locationX / width;
      const newPosition = percentage * playbackStatus.duration;
      if (isPlaying) {
        await audioRef.current?.setStatusAsync({ positionMillis: newPosition, shouldPlay: true });
      } else {
        setPlaybackstatus({ ...playbackStatus, position: newPosition });
      }
    });
  };

  const playPauseAudio = async () => {
    if (isPlaying) {
      const { positionMillis } = (await audioRef.current?.getStatusAsync()) as AVPlaybackStatusSuccess;
      await audioRef.current?.stopAsync();
      setPlaybackstatus({ ...playbackStatus, position: positionMillis });
      setIsPlaying(false);
    } else {
      await audioRef.current?.setStatusAsync({ positionMillis: playbackStatus.position, shouldPlay: true });
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    loadAudio();
    return () => {
      if (audioRef.current) {
        audioRef.current.unloadAsync();
      }
    };
  }, [uri]);

  return (
    <View className="flex-row items-center px-2 border border-[#00607354] bg-slate-100 rounded-3xl gap-2 mt-4">
      <View className="flex-row justify-center gap-2">
        <Pressable
          className="p-2 rounded-full bg-[#005f73] justify-center items-center"
          onPress={playPauseAudio}
        >
          {isPlaying ? (
            <Ionicons
              name="pause"
              size={16}
              color="white"
            />
          ) : (
            <Ionicons
              name="play"
              size={16}
              color="white"
            />
          )}
        </Pressable>
      </View>
      <Slider
        style={{ width: "50%", height: 10 }}
        minimumValue={0}
        maximumValue={playbackStatus.duration || 1}
        value={playbackStatus.position}
        onValueChange={handleSeek}
        onSlidingComplete={handleSeekComplete}
        minimumTrackTintColor="#006073bf"
        maximumTrackTintColor="#e5e7eb"
        thumbTintColor="#006073f1"
        onTouchStart={handleTrackPress}
      />
      <View className="flex-row gap-1">
        <Text className="font-bold text-base">{formatDuration(playbackStatus.position)}</Text>
        <Text className="font-bold text-base">/</Text>
        <Text className="font-bold text-base">{formatDuration(playbackStatus.duration)}</Text>
      </View>
    </View>
  );
};

export default Playback;
