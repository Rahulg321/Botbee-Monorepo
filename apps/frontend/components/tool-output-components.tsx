import { GetInformationToolOutput, WeatherToolOutput } from "@/lib/tool-types";

export function formatGetWeatherResult(result: WeatherToolOutput): string {
  console.log("inside formatWeatherResult", result);

  return `**Weather for ${result.location || "unknown"}**

**Temperature:** ${result.temperature || "unknown"}  
**Conditions:** ${result.conditions || "unknown"}  
**Humidity:** ${result.humidity || "unknown"}  
**Wind Speed:** ${result.windSpeed || "unknown"}  

*Last updated: ${result.lastUpdated || "unknown"}*`;
}

export function formatGetInformationResult(
  result: GetInformationToolOutput
): string {
  if (result.success) {
    const similarityPercentage =
      typeof result.similarity === "number"
        ? `${(result.similarity * 100).toFixed(2)}%`
        : "unknown";

    return `**Knowledge Base Content**

**Content:** ${result.content || "No content found"}  
**Similarity Score:** ${similarityPercentage}  
**Status:** ${result.message || "Content retrieved successfully"}

*Content retrieved from your knowledge base based on the query*`;
  }

  return `**⚠️ Error Retrieving Content**

  //@ts-ignore
**Error:** ${result.reason || "Unknown error occurred"}  
**Status:** Failed to retrieve relevant content

*Please try rephrasing your question or check if the knowledge base has relevant information*`;
}
