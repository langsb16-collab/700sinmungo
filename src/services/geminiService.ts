import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const translateText = async (text: string, targetLang: string) => {
  if (!process.env.GEMINI_API_KEY) return text;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate the following text to ${targetLang}. Only return the translated text: "${text}"`,
    });
    return response.text || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
};

export const getAIFAQResponse = async (question: string, lang: string) => {
  if (!process.env.GEMINI_API_KEY) return "AI service unavailable. Please check API key.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: question,
      config: {
        systemInstruction: `You are an AI assistant for Global Korean Voice (GKV). Answer in ${lang}. GKV is a platform for overseas Koreans to report complaints and discuss policies.`,
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI FAQ error:", error);
    return "Error generating response.";
  }
};
