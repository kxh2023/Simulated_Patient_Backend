// components/FileAudioVisualizer.tsx
import React, { useState, useEffect } from "react";
import { AudioVisualizer } from "react-audio-visualize";
import { FileVisualizerProps } from "@/components/types";

export function FileVisualizerComponent({
  audioFile,
  width = 800,
  height = 120,
  barWidth = 2,
  gap = 1,
  barColor = "#666666",
}: FileVisualizerProps) {
  const [audioBlob, setAudioBlob] = useState<Blob>();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (audioFile) {
      if (!audioFile.type.startsWith("audio/")) {
        setError("Not an audio file");
        setAudioBlob(undefined);
        return;
      }

      setAudioBlob(new Blob([audioFile], { type: audioFile.type }));
      setError("");
    } else {
      setAudioBlob(undefined);
    }
  }, [audioFile]);

  if (error) {
    return <div className="text-red-500 mb-2">{error}</div>;
  }

  return audioBlob ? (
    <div className="relative">
      <AudioVisualizer
        blob={audioBlob}
        width={width}
        height={height}
        barWidth={barWidth}
        gap={gap}
        barColor={barColor}
      />
      <div className="mt-2 text-sm text-gray-500">{audioFile?.name}</div>
    </div>
  ) : null;
}
