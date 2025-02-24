// components/UnifiedAudioVisualizer.tsx
import React from "react";
import { LiveVisualizerComponent } from "./audiolive";
import { FileVisualizerComponent } from "./audiofile";
import { UnifiedVisualizerProps } from "@/components/types";

export function UnifiedAudioVisualizer({
  mode,
  isRecording = false,
  audioFile,
  width = 800,
  height = 120,
  barWidth = 2,
  gap = 1,
  barColor = "#000000",
}: UnifiedVisualizerProps) {
  const visualizerProps = {
    width,
    height,
    barWidth,
    gap,
    barColor,
  };

  return (
    <div className="audio-visualizer">
      {mode === "live" ? (
        <LiveVisualizerComponent
          isRecording={isRecording}
          {...visualizerProps}
        />
      ) : (
        <FileVisualizerComponent audioFile={audioFile} {...visualizerProps} />
      )}
    </div>
  );
}
