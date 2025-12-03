import { GoogleGenAI } from "@google/genai";
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
1. Analyze the structure, tone, and hook strategy. Provide at least 3-5 structural analysis points.
2. Suggest 4 NEW, VIRAL topics that would work perfectly with this specific formula/structure.
   - The topics should be diverse but relevant to a general audience or similar niche.
   - Output everything in Korean.

IMPORTANT: Return ONLY valid JSON in this exact format:
{
  "analysis": {
    "structuralAnalysis": ["분석 포인트 1", "분석 포인트 2", "분석 포인트 3"],
    "tone": "톤 설명",
    "hookStrategy": "후킹 전략 설명"
  },
  "suggestedTopics": ["주제 1", "주제 2", "주제 3", "주제 4"]
}

Original Viral Script:
"""
${originalScript}
"""`;

    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.8,
        maxOutputTokens: 2048,
      },
    });

    console.log("API Result:", result);
    
    let text = '';
    if (result.response && result.response.text) {
      text = result.response.text();
    } else if (result.text) {
      text = typeof result.text === 'function' ? result.text() : result.text;
    } else if (result.response && result.response.candidates && result.response.candidates[0]) {
      const candidate = result.response.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
        text = candidate.content.parts[0].text;
      }
    }
    
    if (!text) {
      console.error("No text in response:", result);
      throw new Error("AI로부터 응답을 받지 못했습니다.");
    }

    // Clean up response - remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsedData = JSON.parse(text);
    console.log("Analysis Response:", parsedData);
    return parsedData as AnalysisResponse;
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    
    if (error.message?.includes('API key') || error.message?.includes('API_KEY') || error.message?.includes('API Key') || error.status === 400) {
      throw new Error("API 키가 유효하지 않습니다. 올바른 API 키를 입력했는지 확인해주세요.");
    }
    
    if (error.message?.includes('quota') || error.status === 429) {
      throw new Error("API 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요.");
    }
    
    if (error instanceof SyntaxError) {
      throw new Error("AI 응답을 파싱하는 중 오류가 발생했습니다. 다시 시도해주세요.");
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

IMPORTANT: Return ONLY valid JSON in this exact format:
{
  "title": "클릭을 유도하는 제목",
  "script": "# 제목\\n\\n전체 스크립트 내용..."
}

Original Viral Script:
"""
${originalScript}
"""

Target Topic:
"""
${newTopic}
"""`;

    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.8,
        maxOutputTokens: 4096,
      },
    });

    console.log("API Result:", result);
    
    let text = '';
    if (result.response && result.response.text) {
      text = result.response.text();
    } else if (result.text) {
      text = typeof result.text === 'function' ? result.text() : result.text;
    } else if (result.response && result.response.candidates && result.response.candidates[0]) {
      const candidate = result.response.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
        text = candidate.content.parts[0].text;
      }
    }
    
    if (!text) {
      console.error("No text in response:", result);
      throw new Error("AI로부터 응답을 받지 못했습니다.");
    }

    // Clean up response - remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsedData = JSON.parse(text);
    console.log("Generated Script:", parsedData);
    return parsedData as GeneratedContent;
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    
    if (error.message?.includes('API key') || error.message?.includes('API_KEY') || error.message?.includes('API Key') || error.status === 400) {
      throw new Error("API 키가 유효하지 않습니다. 올바른 API 키를 입력했는지 확인해주세요.");
    }
    
    if (error.message?.includes('quota') || error.status === 429) {
      throw new Error("API 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요.");
    }
    
    if (error instanceof SyntaxError) {
      throw new Error("AI 응답을 파싱하는 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
    
    throw new Error(`스크립트 생성 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
  }
};