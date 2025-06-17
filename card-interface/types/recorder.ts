import { Audio } from "expo-av";

// Action Types
export type RecordingAction =
  | { type: "START_RECORDING"; payload: Audio.Recording }
  | { type: "STOP_RECORDING"; payload: { uri: string; duration: number } }
  | { type: "SET_RECORDING_TITLE"; payload: string }
  | { type: "RESET_RECORDING" }
  | { type: "SET_TITLE_MODAL_VISIBLE"; payload: boolean };

export type PlaybackAction =
  | { type: "START_PLAYBACK"; payload: { position: number; duration: number } }
  | { type: "PAUSE_PLAYBACK"; payload: number }
  | { type: "STOP_PLAYBACK" }
  | {
      type: "UPDATE_PLAYBACK_STATUS";
      payload: { position: number; duration: number };
    }
  | { type: "SET_PLAYBACK_SPEED"; payload: number }
  | { type: "SET_SEEKING"; payload: boolean }
  | { type: "UPDATE_POSITION"; payload: number };

// State Interfaces
export interface RecordingState {
  recording: Audio.Recording | null;
  recordedUri: string | null;
  recordingTitle: string;
  isTitleModalVisible: boolean;
  recordingDuration: number;
}

export interface PlaybackState {
  isPlaying: boolean;
  playbackPosition: number;
  playbackSpeed: number;
  isSeeking: boolean;
  playbackStatus: {
    positionMillis: number;
    durationMillis: number;
  };
}
