import { tool } from "ai";
import { z } from "zod";

export const weatherTool = tool({
  description:
    "Get the weather in a location. if no unit is provided, default to celsius",
  inputSchema: z.object({
    location: z.string().describe("The location to get the weather for"),
    units: z.enum(["celsius", "fahrenheit"]).default("celsius"),
  }),
  execute: async ({ location, units }) => {
    console.log("inside toolcall", location, units);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const temp =
      units === "celsius"
        ? Math.floor(Math.random() * 35) + 5
        : Math.floor(Math.random() * 63) + 41;

    return {
      location,
      temperature: `${temp}°${units === "celsius" ? "C" : "F"}`,
      conditions: "Sunny",
      humidity: `12%`,
      windSpeed: `35 ${units === "celsius" ? "km/h" : "mph"}`,
      lastUpdated: new Date().toLocaleString(),
    };
  },
});
