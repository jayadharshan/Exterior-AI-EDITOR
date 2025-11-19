import { GoogleGenAI, Modality } from "@google/genai";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateFlooringDesign = async (
  base64Image: string,
  userPrompt: string,
  mimeType: string = 'image/jpeg'
): Promise<string> => {
  const ai = getAiClient();
  
  // We define a system-like prompt wrapper to ensure the model focuses on the task.
  // Although gemini-2.5-flash-image is multimodal, explicit instruction helps.
  const augmentedPrompt = `Change the flooring or paving in the entrance area of this image to: ${userPrompt}. Keep the building facade, walls, and other architectural details exactly as they are. Make it look photorealistic and naturally lit matching the original scene.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: augmentedPrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Parse response
    const candidate = response.candidates?.[0];
    if (!candidate?.content?.parts) {
      throw new Error("No content generated");
    }

    for (const part of candidate.content.parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};