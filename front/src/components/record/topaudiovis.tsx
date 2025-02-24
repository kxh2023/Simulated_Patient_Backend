// components/TopAudioVisualizer.tsx
import React, { useEffect, useState } from "react";
import { UnifiedAudioVisualizer } from "./audiounified";
import { AudioPlayer } from "./audioplayer";
import { fetchAudioFromBackend, AudioResponse } from "@/services/audioservice";
import { VisualizerConfig } from "@/components/types";

type TopAudioVisualizerProps = {
  visualizerConfig: VisualizerConfig;
};

export function TopAudioVisualizer({
  visualizerConfig,
}: TopAudioVisualizerProps) {
  const [audioData, setAudioData] = useState<AudioResponse | null>(null);
  const [audioFile, setAudioFile] = useState<File>();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadAudio = async () => {
      try {
        const data = await fetchAudioFromBackend();
        setAudioData(data);

        // Convert URL to File object for visualizer
        const response = await fetch(data.url);
        const blob = await response.blob();
        setAudioFile(new File([blob], "audio", { type: blob.type }));
      } catch (err) {
        setError("Failed to load audio");
        console.error(err);
      }
    };

    loadAudio();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {audioData && (
        <AudioPlayer
          audioUrl={audioData.url}
          onPlay={() => console.log("Playing")}
          onPause={() => console.log("Paused")}
          onEnded={() => console.log("Ended")}
        />
      )}

      <UnifiedAudioVisualizer
        mode="file"
        audioFile={audioFile}
        {...visualizerConfig}
      />
    </div>
  );
}
