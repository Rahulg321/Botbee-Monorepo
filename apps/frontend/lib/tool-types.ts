import { ToolUIPart } from "ai";

export type WeatherToolInput = {
  location: string;
  units: "celsius" | "fahrenheit";
};

export type WeatherToolOutput = {
  location: string;
  temperature: string;
  conditions: string;
  humidity: string;
  windSpeed: string;
  lastUpdated: string;
};

export type WeatherToolUIPart = ToolUIPart<{
  weatherTool: {
    input: WeatherToolInput;
    output: WeatherToolOutput;
  };
}>;

export type GetInformationToolInput = {
  botId: string;
  question: string;
};

export type GetInformationToolOutput =
  | {
      success: boolean;
      reason: string;
      message: string;
      content: string;
      similarity: number;
    }
  | {
      success: false;
      reason: string;
    };

export type GetInformationToolUIPart = ToolUIPart<{
  getInformation: {
    input: GetInformationToolInput;
    output: GetInformationToolOutput;
  };
}>;
