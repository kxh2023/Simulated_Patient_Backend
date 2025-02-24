import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MicButtonProps } from "@/components/types";

export function MicButton({ onStateChange }: MicButtonProps) {
  const [isRecordingActive, setIsRecordingActive] = useState(false);

  const handleToggle = () => {
    const newState = !isRecordingActive;
    setIsRecordingActive(newState);
    onStateChange?.(newState);
  };

  return (
    <Button variant="outline" size="icon" onClick={handleToggle}>
      {isRecordingActive ? (
        <Mic className="h-4 w-4" />
      ) : (
        <MicOff className="h-4 w-4" />
      )}
    </Button>
  );
}
