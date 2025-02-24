// components/ReplayButton.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Repeat } from "lucide-react"; // We can use the Repeat icon from lucide

interface ReplayButtonProps {
  onReplay: () => void;
  disabled?: boolean;
}

export function ReplayButton({
  onReplay,
  disabled = false,
}: ReplayButtonProps) {
  return (
    <Button
      onClick={onReplay}
      disabled={disabled}
      variant="outline"
      size="icon"
      className="w-10 h-10"
    >
      <Repeat className="h-4 w-4" />
    </Button>
  );
}
