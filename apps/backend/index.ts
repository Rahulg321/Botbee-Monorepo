import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config();

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVEN_LABS_API_KEY, // or rely on ELEVENLABS_API_KEY
});

async function main() {
  const cwd = process.cwd();
  const filePath = path.join(cwd, "voices", "trump-sample_audio.mp3");

  const voice = await elevenlabs.voices.ivc.create({
    name: "Trump Voice Clone",
    files: [Bun.file(filePath)],
  });

  console.log("voice clone generated");
  console.log(voice);
}

main().catch(console.error);
