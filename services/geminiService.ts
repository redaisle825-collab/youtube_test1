import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedContent, AnalysisResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    analysis: {
      type: Type.OBJECT,
      properties: {
        structuralAnalysis: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Key points explaining the structure of the original viral video.",
        },
        tone: {
          type: Type.STRING,
          description: "The identified tone of the original script.",
        },
        hookStrategy: {
          type: Type.STRING,
          description: "How the original script hooks the audience.",
        },
      },
      required: ["structuralAnalysis", "tone", "hookStrategy"],
    },
    suggestedTopics: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "4 creative, viral-worthy new topics that would fit this exact script structure perfectly. In Korean.",
    },
  },
  required: ["analysis", "suggestedTopics"],
};

const scriptSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A click-worthy, viral-style title for the new video.",
    },
    script: {
      type: Type.STRING,
      description: "The full generated script in Markdown format. Include visual cues in [brackets].",
    },
  },
  required: ["title", "script"],
};

export const analyzeScript = async (originalScript: string): Promise<AnalysisResponse> => {
  try {
    const prompt = `
      You are a YouTube Algorithm Strategist.
      Analyze the provided "Original Viral Script" to extract its "Viral DNA".
      
      Task:
      1. Analyze the structure, tone, and hook strategy.
      2. Suggest 4 NEW, VIRAL topics that would work perfectly with this specific formula/structure.
         - The topics should be diverse but relevant to a general audience or similar niche.
         - Output everything in Korean.

      Original Viral Script:
      """
      ${originalScript}
      """
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert script consultant. Analyze deep structural patterns.",
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No analysis generated");

    return JSON.parse(text) as AnalysisResponse;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const generateFinalScript = async (
  originalScript: string,
  newTopic: string
): Promise<GeneratedContent> => {
  try {
    const prompt = `
      You are an expert YouTube Scriptwriter.
      
      Task:
      Write a COMPLETELY NEW script about the "Target Topic" that strictly follows exactly the same successful structure, pacing, and style as the "Original Viral Script".
      
      Rules:
      - The new script must match the specific "New Topic".
      - Maintain the same energy level and sentence length patterns as the original.
      - If the original uses specific rhetorical questions or call-to-actions, adapt them for the new topic at the same relative timestamps.
      - Output in Korean (Hangul).
      
      Original Viral Script:
      """
      ${originalScript}
      """
      
      Target Topic:
      """
      ${newTopic}
      """
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a ghostwriter for top YouTubers. You replicate styles perfectly.",
        responseMimeType: "application/json",
        responseSchema: scriptSchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No script generated");

    return JSON.parse(text) as GeneratedContent;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};