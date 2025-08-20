"use client";

import React, { useEffect, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Play } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);

  useEffect(() => {
    const populateVoiceList = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        // Find a default voice or fallback to the first one
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
    }

    if (text.trim() !== "") {
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = voices.find((v) => v.name === selectedVoice);

      if (voice) {
        utterance.voice = voice;
      }
      utterance.pitch = pitch;
      utterance.rate = rate;

      utterance.onerror = (event) => {
        console.error("SpeechSynthesisUtterance.onerror", event);
      };

      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="block-space big-container">
      <div className="space-y-8">
        <h1>Text to Speech</h1>
        <Textarea
          id="text-input"
          placeholder="Enter text to speak..."
          aria-label="Text to speak"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="">
          <div className="">
            <Label htmlFor="">Voice</Label>
            <Select
              aria-label="Select voice"
              value={selectedVoice}
              onValueChange={(value) => setSelectedVoice(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((voice) => (
                  <SelectItem key={voice.name} value={voice.name}>
                    {`${voice.name} (${voice.lang})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="control">
            <Label htmlFor="rate">
              Rate: <span id="rate-value">{rate}</span>
            </Label>
            <Slider
              min={0.5}
              max={2}
              value={[rate]}
              step={0.1}
              aria-label="Speech rate"
              onValueChange={(value) => setRate(value[0] ?? 1)}
            />
          </div>
          <div className="control">
            <Label htmlFor="pitch">
              Pitch: <span id="pitch-value">{pitch}</span>
            </Label>
            <Slider
              min={0}
              max={2}
              value={[pitch]}
              step={0.1}
              aria-label="Speech pitch"
              onValueChange={(value) => setPitch(value[0] ?? 1)}
            />
          </div>
        </div>

        <Button onClick={handleSpeak}>
          <Play />
        </Button>
      </div>
    </div>
  );
};

export default TextToSpeech;
