// services/audioService.ts
export type AudioResponse = {
  url: string;
  transcript?: string;
  // Add other metadata as needed
};

const API_BASE_URL = "http://localhost:5000";

export async function fetchAudioFromBackend(): Promise<AudioResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/ttsfeedback`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching audio:", error);
    throw error;
  }
}
