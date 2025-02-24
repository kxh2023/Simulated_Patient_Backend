import "regenerator-runtime/runtime";
import React, { useState, useRef, useEffect } from "react";
import { AudioVisualizer } from "react-audio-visualize";
import { MicButton } from "./micbutton";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { handleTranscript } from "@/services/transcriptservice";
import { VisualizerConfig } from "@/components/types";
import { LiveVisualizerComponent } from "./audiolive";
import { FileVisualizerComponent } from "./audiofile";
import { ReplayButton } from "./replaybutton";

export default function RecordingPage() {
  const [topBlob, setTopBlob] = useState<Blob>();
  const [bottomBlob, setBottomBlob] = useState<Blob>();
  const [audioFile, setAudioFile] = useState<File>();
  const [isRecording, setIsRecording] = useState(false);
  const [savedTranscripts, setSavedTranscripts] = useState<string[]>([]);
  const topVisualizerRef = useRef<HTMLCanvasElement>(null);
  const bottomVisualizerRef = useRef<HTMLCanvasElement>(null);

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBlobUrl, setCurrentBlobUrl] = useState<string | null>(null);

  const cleanupAudioResources = () => {
    if (currentBlobUrl) {
      URL.revokeObjectURL(currentBlobUrl);
      setCurrentBlobUrl(null);
    }
    if (audio) {
      audio.pause();
      audio.src = "";
      setAudio(null); // Make sure to null the audio
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => {
      cleanupAudioResources();
    };
  }, []);

  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  //need to fuck around with the order of shutting off different functions
  const handleMicToggle = async (isActive: boolean) => {
    setIsRecording(isActive);

    if (isActive) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const recorder = new MediaRecorder(stream);

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setBottomBlob(event.data);
          }
        };

        recorder.start(100); // Update visualization every 100ms
        setMediaRecorder(recorder);
        SpeechRecognition.startListening({ continuous: true });
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    } else {
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      }
      setIsRecording(false);
      SpeechRecognition.stopListening();

      // Give a little time for any final data to be available
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (transcript.trim()) {
        cleanupAudioResources();
        // Call handleTranscript just once
        const result = await handleTranscript(transcript);
        if (result?.file) {
          setAudioFile(result.file);
          await playAudioFromFile(result.file);
        }
        resetTranscript();
      }
    }
  };

  const playAudioFromFile = async (file: File) => {
    try {
      if (audio) {
        audio.pause();
      }
      const blobUrl = URL.createObjectURL(file);
      setCurrentBlobUrl(blobUrl); // Store the blob URL for cleanup

      const newAudio = new Audio(blobUrl);
      newAudio.onplay = () => setIsPlaying(true);
      newAudio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(blobUrl);
        setCurrentBlobUrl(null);
      };
      newAudio.onpause = () => setIsPlaying(false);

      setAudio(newAudio);
      await newAudio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <div>Browser does not support speech recognition</div>;
  }

  const topVisualizerConfig: VisualizerConfig = {
    width: 800,
    height: 120,
    barWidth: 2,
    gap: 1,
    barColor: "#000000",
  };

  const bottomVisualizerConfig: VisualizerConfig = {
    width: 500,
    height: 100,
    barWidth: 2,
    gap: 1,
    barColor: "#666666",
  };

  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaRecorder]);

  const handleReplay = async () => {
    if (audioFile && !isPlaying) {
      await playAudioFromFile(audioFile);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Visualizer - Larger */}
      <div className="w-full p-8">
        <div className="flex flex-col items-center gap-4">
          <FileVisualizerComponent
            audioFile={audioFile}
            {...topVisualizerConfig}
          />

          {audio && (
            <div className="flex items-center gap-2">
              <ReplayButton onReplay={handleReplay} disabled={isPlaying} />
            </div>
          )}
        </div>
      </div>

      {/* Middle Content - Transcript Display */}
      <div className="flex-grow p-8">
        <div className="bg-gray-50 rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
          <p className="text-gray-700">{transcript}</p>
        </div>
      </div>

      {/* Bottom Section with Mic and Visualizer */}
      <div className="w-full p-8 flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <MicButton onStateChange={handleMicToggle} />
          <span className="text-sm text-gray-500">
            {listening ? "Listening..." : "Not Listening..."}
          </span>
        </div>

        {mediaRecorder && (
          <LiveVisualizerComponent
            isRecording={isRecording}
            {...bottomVisualizerConfig}
          />
        )}
      </div>
    </div>
  );
}
