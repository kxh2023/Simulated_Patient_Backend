// components/LiveAudioVisualizer.tsx
import React, { useState, useEffect } from "react";
import { LiveAudioVisualizer } from "react-audio-visualize";
import { LiveVisualizerProps } from "@/components/types";

export function LiveVisualizerComponent({
  isRecording,
  width = 800,
  height = 120,
  barWidth = 2,
  gap = 1,
  barColor = "#000000",
}: LiveVisualizerProps) {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let stream: MediaStream;

    const setupRecorder = async () => {
      if (isRecording) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const recorder = new MediaRecorder(stream);
          setMediaRecorder(recorder);
          recorder.start();
          setError("");
        } catch (err) {
          setError("Error accessing microphone");
          console.error("Error accessing microphone:", err);
        }
      } else {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
          mediaRecorder.stream.getTracks().forEach((track) => track.stop());
        }
      }
    };

    setupRecorder();

    // Cleanup
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isRecording]);

  return (
    <div className="relative">
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {mediaRecorder && (
        <LiveAudioVisualizer
          mediaRecorder={mediaRecorder}
          width={width}
          height={height}
          barWidth={barWidth}
          gap={gap}
          barColor={barColor}
        />
      )}
    </div>
  );
}
