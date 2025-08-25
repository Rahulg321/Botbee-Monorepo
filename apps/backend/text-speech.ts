import { ElevenLabsClient, play } from "@elevenlabs/elevenlabs-js";
import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config();

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVEN_LABS_API_KEY, // or rely on ELEVENLABS_API_KEY
});

const audio = await elevenlabs.textToSpeech.convert("SPPe8nFCcnXp4aqbzIPF", {
  text: "The first move is what sets everything in motion.",
  modelId: "eleven_multilingual_v2",
  outputFormat: "mp3_44100_128",
});
await play(audio);
