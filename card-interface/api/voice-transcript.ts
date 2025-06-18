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

    return await api
      .post("transcription/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          accept: "application/json",
        },
      })
      .then((response) => {
        return response?.data?.transcription;
      });
  } catch (error: any) {
    console.error("Error uploading audio:", error.response?.data || error.message);
  }
};
export { transcribeAudio };
