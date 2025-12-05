import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_MODEL_FLASH } from "../constants";
import { BriefingResponse } from "../types";

export const generateMorningBriefing = async (): Promise<BriefingResponse> => {
  try {
    // Check if API key exists. In a real environment, this is injected.
    // If not present, return a generic fallback to prevent crash.
    if (!process.env.API_KEY) {
      return {
        greeting: "Good Morning!",
        quote: "The best way to predict the future is to create it.",
        weatherTip: "Check your local forecast before heading out!"
      };
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_FLASH,
      contents: "Generate a short, positive morning briefing for an alarm clock app user. Include a greeting, a short motivational quote, and a generic weather/preparedness tip.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            greeting: { type: Type.STRING },
            quote: { type: Type.STRING },
            weatherTip: { type: Type.STRING }
          },
          required: ["greeting", "quote", "weatherTip"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as BriefingResponse;
    }
    
    throw new Error("Empty response from Gemini");

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
        greeting: "Good Morning!",
        quote: "Every day is a fresh start.",
        weatherTip: "Make today count!"
    };
  }
};
