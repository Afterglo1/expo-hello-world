import { api } from "./config";

const file = "file:///path/to/audio.wav";

const formData = new FormData();
formData.append("file", file);

const transcribeAudio = async (fileURI: string) => {
  const formData = new FormData();
  const file = { uri: fileURI } as unknown as Blob;
  formData.append("file", file);

  try {
    await api
      .post("/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Transcription Result:", response.data);
      });
  } catch (error: any) {
    console.error(
      "Error uploading audio:",
      error.response?.data || error.message
    );
  }
};
export { transcribeAudio };
