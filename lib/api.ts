import axios from "axios";

export const MOCK_VIDEO_URL = "/demo-reel.mp4";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api",
  timeout: 30000,
});

export type GenerateVideoResponse = {
  id: string;
  videoUrl: string;
  prompt: string;
  sourceFileName: string;
  status: "completed";
};

export async function generateVideo(
  file: File,
  prompt: string,
): Promise<GenerateVideoResponse> {
  const payload = new FormData();
  payload.append("file", file);
  payload.append("prompt", prompt);

  if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") {
    const response = await apiClient.post<GenerateVideoResponse>(
      "/generate",
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  }

  await new Promise((resolve) => window.setTimeout(resolve, 3000));

  return {
    id: `mock-${Date.now()}`,
    videoUrl: MOCK_VIDEO_URL,
    prompt,
    sourceFileName: file.name,
    status: "completed",
  };
}
