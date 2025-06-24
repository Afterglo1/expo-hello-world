import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Recording } from "@/types/recording";

interface RecordingsState {
  recordings: Recording[];
  loadRecordings: () => Promise<void>;
  saveRecording: (newRecording: Recording) => Promise<void>;
  deleteRecording: (id: string) => Promise<void>;
  updateRecording: (updatedRecording: Recording) => Promise<void>;
}

export const useRecordingsStore = create<RecordingsState>((set, get) => ({
  recordings: [],
  loadRecordings: async () => {
    try {
      const savedRecordings = await AsyncStorage.getItem("recordings");
      if (savedRecordings) {
        set({ recordings: JSON.parse(savedRecordings) });
      }
    } catch (error) {
      console.error("Error loading recordings:", error);
    }
  },
  saveRecording: async (newRecording: Recording) => {
    try {
      const updatedRecordings = [newRecording, ...get().recordings];
      await AsyncStorage.setItem("recordings", JSON.stringify(updatedRecordings));
      set({ recordings: updatedRecordings });
    } catch (error) {
      console.error("Error saving recording:", error);
    }
  },
  deleteRecording: async (id: string) => {
    try {
      const updatedRecordings = get().recordings.filter((rec: Recording) => rec.id !== id);
      await AsyncStorage.setItem("recordings", JSON.stringify(updatedRecordings));
      set({ recordings: updatedRecordings });
    } catch (error) {
      console.error("Error deleting recording:", error);
    }
  },
  updateRecording: async (updatedRecording: Recording) => {
    try {
      const updatedRecordings = get().recordings.map((rec: Recording) =>
        rec.id === updatedRecording.id ? updatedRecording : rec
      );
      await AsyncStorage.setItem("recordings", JSON.stringify(updatedRecordings));
      set({ recordings: updatedRecordings });
    } catch (error) {
      console.error("Error updating recording:", error);
    }
  },
}));
