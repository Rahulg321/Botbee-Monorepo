import { ElevenLabsClient, play } from "@elevenlabs/elevenlabs-js";
import {
  createWriteStream,
  writeFileSync,
  mkdirSync,
  createReadStream,
} from "fs";
import { v4 as uuid } from "uuid";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config();

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVEN_LABS_API_KEY, // Defaults to process.env.ELEVENLABS_API_KEY
});

async function main() {
  const cwd = process.cwd();
  console.log(cwd);

  console.log("inside voice clone");
  const voice = await elevenlabs.voices.ivc.create({
    name: "Trump Voice Clone",
    files: [
      createReadStream(path.join(cwd, "voices", "trump-sample_audio.mp3")),
    ],
  });

  console.log("voice clone generated");
  console.log(voice);
}

main()
  .then()
  .catch((e) => console.log(e));
