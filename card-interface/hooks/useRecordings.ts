import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Recording } from "@/types/recording";

export const useRecordings = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);

  useEffect(() => {
    loadRecordings();
  }, []);

  const loadRecordings = async () => {
    try {
      const savedRecordings = await AsyncStorage.getItem("recordings");
      if (savedRecordings) {
        setRecordings(JSON.parse(savedRecordings));
      }
    } catch (error) {
      console.error("Error loading recordings:", error);
    }
  };

  const saveRecording = async (newRecording: Recording) => {
    try {
      const updatedRecordings = [...recordings, newRecording];
      await AsyncStorage.setItem(
        "recordings",
        JSON.stringify(updatedRecordings)
      );
      setRecordings(updatedRecordings);
    } catch (error) {
      console.error("Error saving recording:", error);
    }
  };

  const deleteRecording = async (id: string) => {
    try {
      const updatedRecordings = recordings.filter((rec) => rec.id !== id);
      await AsyncStorage.setItem(
        "recordings",
        JSON.stringify(updatedRecordings)
      );
      setRecordings(updatedRecordings);
    } catch (error) {
      console.error("Error deleting recording:", error);
    }
  };

  return {
    recordings,
    saveRecording,
    deleteRecording,
  };
};
