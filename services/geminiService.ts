import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

// The API key is expected to be injected by the execution environment.
// Initializing the client directly without a blocking check allows the app to load.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const iocsSchema = {
  type: Type.OBJECT,
  properties: {
    urls: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Any URLs or domains found in the content."
    },
    emails: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Any email addresses found in the content."
    }
  },
  required: ["urls", "emails"]
};

const tacticsSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      tactic: {
        type: Type.STRING,
        description: "The name of the phishing tactic being analyzed (e.g., 'Urgency', 'Suspicious Link', 'Sender Impersonation', 'Unusual Request')."
      },
      description: {
        type: Type.STRING,
        description: "A very brief explanation of why this tactic was or was not detected."
      },
      detected: {
        type: Type.BOOLEAN,
        description: "A boolean indicating if this specific tactic was detected."
      }
    },
    required: ["tactic", "description", "detected"]
  }
};


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
      description: "A brief, user-friendly summary explanation for the overall classification and score.",
    },
    tactics: tacticsSchema,
    iocs: iocsSchema,
    recommendation: {
      type: Type.STRING,
      description: "A clear, actionable recommendation for the user (e.g., 'Delete this email immediately and do not click links.')."
    }
  },
  required: ["riskLevel", "score", "reason", "tactics", "iocs", "recommendation"],
};


export const analyzeContent = async (text: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Perform a detailed phishing analysis on the following content.
      1.  **Overall Assessment**: Provide a risk level ('Safe', 'Suspicious', 'Malicious'), a risk score (0-100), and a concise summary reason.
      2.  **Tactic Analysis**: Analyze for the presence of the following specific tactics: 'Urgency', 'Suspicious Link', 'Sender Impersonation', and 'Unusual Request'. For each tactic, indicate if it was detected (boolean) and provide a brief justification.
      3.  **IOC Extraction**: Extract all URLs and email addresses from the content. If none are present, return empty arrays.
      4.  **Recommendation**: Provide a single, clear, actionable recommendation for the user.

      The user submitted content is: "${text}"`,
      config: {
        systemInstruction: "You are a cybersecurity expert specializing in phishing detection. Your goal is to analyze user-submitted content and provide a structured, detailed risk assessment. Respond ONLY with the JSON object defined in the schema.",
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