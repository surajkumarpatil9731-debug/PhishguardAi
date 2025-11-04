
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    riskLevel: {
      type: Type.STRING,
      description: "Classification of risk. Must be 'Safe', 'Suspicious', or 'Malicious'.",
    },
    score: {
      type: Type.INTEGER,
      description: "Numerical risk score from 0 (safest) to 100 (most malicious).",
    },
    reason: {
      type: Type.STRING,
      description: "A brief, user-friendly explanation for the classification and score.",
    },
  },
  required: ["riskLevel", "score", "reason"],
};

export const analyzeContent = async (text: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following content for phishing risks. Consider elements like suspicious links, urgent language, grammatical errors, sender identity, and unusual requests. Based on your analysis, provide a risk classification, a numerical risk score, and a brief reason. The user submitted content is: "${text}"`,
      config: {
        systemInstruction: "You are a cybersecurity expert specializing in phishing detection. Your goal is to analyze user-submitted content (URLs, emails, messages) and provide a clear, concise, and accurate risk assessment. Respond ONLY with the JSON object defined in the schema.",
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const responseText = response.text.trim();
    const resultJson = JSON.parse(responseText);

    return resultJson as AnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes('SAFETY')) {
       throw new Error("The analysis was blocked due to safety settings. The content may be harmful.");
    }
    throw new Error("Failed to get a valid analysis from the AI. Please try again.");
  }
};
