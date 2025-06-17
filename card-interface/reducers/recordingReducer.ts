import { RecordingState, RecordingAction } from "@/types/recorder";

export const initialRecordingState: RecordingState = {
  recording: null,
  recordedUri: null,
  recordingTitle: "",
  isTitleModalVisible: false,
  recordingDuration: 0,
};

export const recordingReducer = (
  state: RecordingState,
  action: RecordingAction
): RecordingState => {
  switch (action.type) {
    case "START_RECORDING":
      return {
        ...state,
        recording: action.payload,
      };
    case "STOP_RECORDING":
      return {
        ...state,
        recording: null,
        recordedUri: action.payload.uri,
        recordingDuration: action.payload.duration,
      };
    case "SET_RECORDING_TITLE":
      return {
        ...state,
        recordingTitle: action.payload,
      };
    case "RESET_RECORDING":
      return {
        ...initialRecordingState,
      };
    case "SET_TITLE_MODAL_VISIBLE":
      return {
        ...state,
        isTitleModalVisible: action.payload,
      };
    default:
      return state;
  }
};
