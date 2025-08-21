"use client";

import React, { useEffect, useState } from "react";
import { Response } from "@/components/ai-elements/response";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play, Square, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

const AudioMessage = ({
  messageText,
  characterName,
  characterImageUrl,
}: {
  messageText: string;
  characterName: string;
  characterImageUrl: string;
}) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const populateVoiceList = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        const defaultVoice =
          availableVoices.find((voice) => voice.default) || availableVoices[0];
        if (defaultVoice) {
          setSelectedVoice(defaultVoice.name);
        }
      }
    };

    // The 'voiceschanged' event fires when the voice list is ready
    speechSynthesis.onvoiceschanged = populateVoiceList;
    populateVoiceList(); // Initial call for browsers that might have them ready

    // Cleanup the event listener on component unmount
    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handleSpeak = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    if (messageText.trim() !== "") {
      const utterance = new SpeechSynthesisUtterance(messageText);
      const voice = voices.find((v) => v.name === selectedVoice);

      if (voice) {
        utterance.voice = voice;
      }
      utterance.pitch = pitch;
      utterance.rate = rate;

      utterance.onstart = () => {
        setIsPlaying(true);
      };

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = (event) => {
        console.error("SpeechSynthesisUtterance.onerror", event);
        setIsPlaying(false);
      };

      speechSynthesis.speak(utterance);
    }
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return (
    <div className="flex items-start gap-4 group">
      <Avatar className="h-12 w-12 flex-shrink-0">
        <AvatarImage src={characterImageUrl} alt={characterName} />
        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
          {characterName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="mb-3">
          <span className="text-base font-semibold text-foreground/90">
            {characterName}
          </span>
        </div>

        <div className="relative group/message">
          <Response className="pr-16 pb-4">{messageText}</Response>

          <div className="absolute top-3 right-3 opacity-0 group-hover/message:opacity-100 transition-opacity duration-200">
            <Button
              onClick={isPlaying ? handleStop : handleSpeak}
              size="sm"
              variant="ghost"
              className={cn(
                "h-9 w-9 p-0 rounded-full bg-background/90 backdrop-blur-sm border shadow-md",
                "hover:bg-background hover:scale-105 transition-all duration-200",
                isPlaying &&
                  "bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/20"
              )}
            >
              {isPlaying ? (
                <Square className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioMessage;
