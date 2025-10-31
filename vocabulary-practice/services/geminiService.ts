
import { GoogleGenAI, Type } from "@google/genai";
import type { GeminiEvaluationResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const evaluationSchema = {
  type: Type.OBJECT,
  properties: {
    score: {
      type: Type.NUMBER,
      description: 'A score from 0 to 100 based on spelling similarity. 100 is a perfect match.'
    },
    feedback: {
      type: Type.STRING,
      description: 'Short, encouraging feedback in Vietnamese for a 6th grade student.'
    }
  },
  required: ['score', 'feedback'],
};

export const evaluateAnswer = async (userAnswer: string, correctAnswer: string): Promise<GeminiEvaluationResponse> => {
  const prompt = `Correct Answer: "${correctAnswer}"\nStudent's Answer: "${userAnswer}"`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: evaluationSchema,
        temperature: 0.2,
      },
      systemInstruction: `You are an AI that grades English vocabulary answers from 6th-grade Vietnamese students. Your task is to assess the spelling accuracy of the student's answer compared to the correct answer. Provide a score from 0 to 100. A perfect match is 100. A one-letter mistake might be 95. Two mistakes might be 85. A completely different word is 0. Also, provide a short, encouraging, and friendly feedback message in Vietnamese. Your response must strictly be a JSON object with 'score' (number) and 'feedback' (string). Do not add any extra text, explanations, or markdown formatting.`
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as GeminiEvaluationResponse;
    
    if (typeof result.score !== 'number' || typeof result.feedback !== 'string') {
        throw new Error('Invalid JSON structure from API');
    }

    return result;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to get evaluation from AI.");
  }
};
