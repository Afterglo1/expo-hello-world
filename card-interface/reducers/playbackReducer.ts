import { PlaybackState, PlaybackAction } from "@/types/recorder";

export const initialPlaybackState: PlaybackState = {
  isPlaying: false,
  playbackPosition: 0,
  playbackSpeed: 1,
  isSeeking: false,
  playbackStatus: {
    positionMillis: 0,
    durationMillis: 0,
  },
};

export const playbackReducer = (
  state: PlaybackState,
  action: PlaybackAction
): PlaybackState => {
  switch (action.type) {
    case "START_PLAYBACK":
      return {
        ...state,
        isPlaying: true,
        playbackStatus: {
          positionMillis: action.payload.position,
          durationMillis: action.payload.duration,
        },
      };
    case "PAUSE_PLAYBACK":
      return {
        ...state,
        isPlaying: false,
        playbackPosition: action.payload,
      };
    case "STOP_PLAYBACK":
      return {
        ...initialPlaybackState,
      };
    case "UPDATE_PLAYBACK_STATUS":
      return {
        ...state,
        playbackStatus: {
          positionMillis: action.payload.position,
          durationMillis: action.payload.duration,
        },
      };
    case "SET_PLAYBACK_SPEED":
      return {
        ...state,
        playbackSpeed: action.payload,
      };
    case "SET_SEEKING":
      return {
        ...state,
        isSeeking: action.payload,
      };
    case "UPDATE_POSITION":
      return {
        ...state,
        playbackPosition: action.payload,
      };
    default:
      return state;
  }
};
