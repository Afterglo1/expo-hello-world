import { useEffect } from "react";
import { Audio } from "expo-av";
import { useSharedValue, withRepeat, withTiming, withSequence } from "react-native-reanimated";

export const useRecordingAnimation = (recording: Audio.Recording | null) => {
  const waveScale = useSharedValue(1);
  const waveOpacity = useSharedValue(0.5);

  useEffect(() => {
    let interval: number;
    if (recording) {
      // Start the wave animation
      waveScale.value = withRepeat(
        withSequence(withTiming(1.2, { duration: 1000 }), withTiming(1, { duration: 1000 })),
        -1,
        true
      );
      waveOpacity.value = withRepeat(
        withSequence(withTiming(0.8, { duration: 1000 }), withTiming(0.3, { duration: 1000 })),
        -1,
        true
      );

      interval = setInterval(async () => {
        const status = await recording.getStatusAsync();
        if (status.isRecording) {
          const meteringValue = Math.abs(status.metering || 0);
          const scaleValue = 1 + meteringValue / 80;
          waveScale.value = withTiming(scaleValue, { duration: 100 });
        }
      }, 100);
    } else {
      waveScale.value = withTiming(1);
      waveOpacity.value = withTiming(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [recording]);

  return { waveScale, waveOpacity };
};
