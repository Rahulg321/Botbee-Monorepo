import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { createWriteStream, writeFileSync, mkdirSync } from "fs";
import { v4 as uuid } from "uuid";
import * as dotenv from "dotenv";
import * as path from "path";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVEN_LABS_API_KEY, // Defaults to process.env.ELEVENLABS_API_KEY
});

const audio = await elevenlabs.textToSpeech.convert("eVItLK1UvXctxuaRV2Oq", {
  text: "I can't believe I got Eleven Labs API working, prasanjeet we are good to go",
  modelId: "eleven_multilingual_v2",
  outputFormat: "mp3_44100_128", // output_format
});

// Save audio to a local file
const fileName = `audio-${uuid()}.mp3`;
const outputPath = path.join(__dirname, "generated-audio", fileName);

// Create directory if it doesn't exist
mkdirSync(path.dirname(outputPath), { recursive: true });

// Convert ReadableStream to buffer and write to file
const chunks: Uint8Array[] = [];
const reader = audio.getReader();
let done = false;

while (!done) {
  const { value, done: doneReading } = await reader.read();
  done = doneReading;
  if (value) {
    chunks.push(value);
  }
}

// Combine all chunks into a single buffer
const audioBuffer = Buffer.concat(chunks);
writeFileSync(outputPath, audioBuffer);

console.log(`Audio saved to: ${outputPath}`);
