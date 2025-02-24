// src/components/types.ts

export interface PatientCardData {
  id: number;
  title: string;
  description: string;
  tags: string[];
}

export type MicButtonProps = {
  onStateChange?: (isActive: boolean) => void;
};

export type VisualizerMode = "live" | "file";

export type LiveVisualizerProps = {
  isRecording: boolean;
  width?: number;
  height?: number;
  barWidth?: number;
  gap?: number;
  barColor?: string;
};

export type FileVisualizerProps = {
  audioFile?: File;
  width?: number;
  height?: number;
  barWidth?: number;
  gap?: number;
  barColor?: string;
};

export type UnifiedVisualizerProps = {
  mode: VisualizerMode;
  isRecording?: boolean;
  audioFile?: File;
  width?: number;
  height?: number;
  barWidth?: number;
  gap?: number;
  barColor?: string;
};

export type VisualizerConfig = {
  width: number;
  height: number;
  barWidth: number;
  gap: number;
  barColor: string;
};

export type AudioPlayerProps = {
  audioUrl: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
};