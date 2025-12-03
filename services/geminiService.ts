import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedContent, AnalysisResponse } from "../types";

let API_KEY = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;

export const setApiKey = (key: string) => {
  API_KEY = key;
  if (typeof window !== 'undefined') {
    localStorage.setItem('gemini_api_key', key);
  }
};

export const getApiKey = (): string => {
  if (!API_KEY && typeof window !== 'undefined') {
    API_KEY = localStorage.getItem('gemini_api_key') || '';
  }
  return API_KEY || '';
};

if (!API_KEY && typeof window !== 'undefined') {
  const stored = localStorage.getItem('gemini_api_key');
  if (stored) API_KEY = stored;
}

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
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API 키가 설정되지 않았습니다. 오른쪽 상단의 키 아이콘을 클릭하여 API 키를 입력해주세요.");
  }

  try {
    const genAI = new GoogleGenAI({ apiKey });
    
    const prompt = `You are a YouTube Algorithm Strategist.
Analyze the provided "Original Viral Script" to extract its "Viral DNA".

Task:
1. Analyze the structure, tone, and hook strategy.
2. Suggest 4 NEW, VIRAL topics that would work perfectly with this specific formula/structure.
   - The topics should be diverse but relevant to a general audience or similar niche.
   - Output everything in Korean.

Original Viral Script:
"""
${originalScript}
"""`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are an expert script consultant. Analyze deep structural patterns. Always respond in Korean.",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.8,
      },
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error("AI로부터 응답을 받지 못했습니다.");
    }

    const parsedData = JSON.parse(text);
    console.log("Analysis Response:", parsedData);
    return parsedData as AnalysisResponse;
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    
    if (error.message?.includes('API key') || error.message?.includes('API_KEY')) {
      throw new Error("API 키가 유효하지 않습니다. 올바른 API 키를 입력했는지 확인해주세요.");
    }
    
    if (error.message?.includes('quota')) {
      throw new Error("API 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요.");
    }
    
    throw new Error(`분석 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
  }
};

export const generateFinalScript = async (
  originalScript: string,
  newTopic: string
): Promise<GeneratedContent> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API 키가 설정되지 않았습니다. 오른쪽 상단의 키 아이콘을 클릭하여 API 키를 입력해주세요.");
  }

  try {
    const genAI = new GoogleGenAI({ apiKey });
    
    const prompt = `You are an expert YouTube Scriptwriter.

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
"""`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are a ghostwriter for top YouTubers. You replicate styles perfectly. Always write in Korean.",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: scriptSchema,
        temperature: 0.8,
      },
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error("AI로부터 응답을 받지 못했습니다.");
    }

    const parsedData = JSON.parse(text);
    console.log("Generated Script:", parsedData);
    return parsedData as GeneratedContent;
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    
    if (error.message?.includes('API key') || error.message?.includes('API_KEY')) {
      throw new Error("API 키가 유효하지 않습니다. 올바른 API 키를 입력했는지 확인해주세요.");
    }
    
    if (error.message?.includes('quota')) {
      throw new Error("API 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요.");
    }
    
    throw new Error(`스크립트 생성 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
  }
};