import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiService = {
  async generateText(prompt: string, systemInstruction?: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        systemInstruction,
      },
    });
    return response.text;
  },

  async grammarCheck(text: string) {
    const prompt = `Check the grammar and spelling of the following text. Provide the corrected version and a brief explanation of the changes: "${text}"`;
    return this.generateText(prompt, "You are an expert English and Bengali grammar teacher.");
  },

  async summarize(text: string) {
    const prompt = `Summarize the following text into a concise paragraph: "${text}"`;
    return this.generateText(prompt, "You are a professional summarizer.");
  },

  async solveMath(problem: string) {
    const prompt = `Solve this math problem step-by-step: "${problem}"`;
    return this.generateText(prompt, "You are a math expert. Provide clear, step-by-step solutions.");
  },

  async generateImage(prompt: string) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: { parts: [{ text: prompt }] },
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  }
};
