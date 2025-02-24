// services/transcriptService.ts

interface TranscriptData {
  message: string;
}

const API_BASE_URL = "http://localhost:5001";

export async function handleTranscript(
  transcript: string
): Promise<{ file: File } | null> {
  try {
    // Send transcript to backend and get audio response
    const response = await fetch(`${API_BASE_URL}/send_message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: transcript }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const audioBlob = await response.blob();
    console.log("Received new audio blob:", {
      size: audioBlob.size,
      type: audioBlob.type,
      timestamp: new Date().toISOString(),
    });
    const uniqueId = `${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    const audioFile = new File([audioBlob], `speech_${uniqueId}.mp3`, {
      type: "audio/mpeg",
    });

    // Store in localStorage
    const savedTranscripts = JSON.parse(
      localStorage.getItem("transcripts") || "[]"
    );
    savedTranscripts.push({
      text: transcript,
      timestamp: new Date().toISOString(),
      audioUrl: audioFile,
    });
    localStorage.setItem("transcripts", JSON.stringify(savedTranscripts));

    const blobUrl = URL.createObjectURL(audioFile);

    return { file: audioFile };
  } catch (error) {
    console.error("Error handling transcript:", error);
    return null;
  }
}

// Cleanup function for blob URLs
export function releaseAudioUrl(url: string): void {
  URL.revokeObjectURL(url);
}
