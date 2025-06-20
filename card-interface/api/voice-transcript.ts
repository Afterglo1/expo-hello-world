import { api } from "./config";

interface TranscribeAudioProps {
  uri: string;
  type: string;
  name: string;
}

const transcribeAudio = async (fileDetails: TranscribeAudioProps): Promise<string | void> => {
  try {
    const formData = new FormData();
    formData.append("audio_file", fileDetails as any);

    const res = await api.post("/transcription/", formData, {
      headers: {
        accept: "application/json",
      },
    });
    const data = res?.data?.transcript;
    return data;
  } catch (error: any) {
    console.error("Error uploading audio:", error.response?.data || error.message);
  }
};
export { transcribeAudio };
