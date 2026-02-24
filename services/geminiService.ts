
import { GoogleGenAI, Type } from "@google/genai";
import { Language, EstimationResult } from "../types";
import { PRODUCTS } from "../constants";

export const consultGemini = async (prompt: string, history: {role: 'user' | 'model', parts: {text: string}[]}[], lang: Language) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const langNames = { en: 'English', kg: 'Kyrgyz', ru: 'Russian' };
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: `You are TamSal AI, a senior construction consultant for a specialized interior material store in Bishkek, Kyrgyzstan. 
        Your goal is to help customers select the right flooring (laminate, linoleum) and wall panels (PVC). 
        Current language preference: ${langNames[lang]}. Please respond primarily in this language.
        Prices are in Kyrgyz Som (KGS). 
        Focus on technical advice regarding underlayment, adhesive choice, and finishing trims (skirting).
        Be professional, concise, and helpful.`,
        tools: [{ googleSearch: {} }, { googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: 42.8746, 
              longitude: 74.5698
            }
          }
        }
      }
    });

    return {
      text: response.text || "I'm sorry, I couldn't process that request.",
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Gemini Consultant Error:", error);
    return { text: "The consultant is currently busy. Please try again later.", grounding: [] };
  }
};

export const calculateMaterials = async (projectType: string, dimensions: string, lang: Language): Promise<EstimationResult | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const langNames = { en: 'English', kg: 'Kyrgyz', ru: 'Russian' };
    
    // Provide catalog context for ID matching
    const catalogContext = PRODUCTS.map(p => ({
      id: p.id,
      name: p.name.en,
      unit: p.unit.en
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Calculate estimated materials needed for a ${projectType} with these dimensions: ${dimensions}. 
      Use the following product catalog to suggest items: ${JSON.stringify(catalogContext)}.
      Respond in ${langNames[lang]}.`,
      config: {
        systemInstruction: "You are a construction estimation expert. Return a JSON object with 'text' (human readable explanation) and 'suggestedItems' (array of {id: string, quantity: number}). Use integers for quantities. Round up for safety.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            suggestedItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  quantity: { type: Type.NUMBER }
                },
                required: ["id", "quantity"]
              }
            }
          },
          required: ["text", "suggestedItems"]
        }
      }
    });
    
    const result = JSON.parse(response.text || '{}');
    return result as EstimationResult;
  } catch (error) {
    console.error("Gemini Calculation Error:", error);
    return null;
  }
};
