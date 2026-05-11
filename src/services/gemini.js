import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateDesignSuggestions = async (roomData, imageBase64) => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    You are an expert interior designer. Analyze this room and provide detailed design suggestions.
    Room Type: ${roomData.roomType}
    Style Preference: ${roomData.style}
    Description: ${roomData.description}
    Budget Level: ${roomData.budget}

    Please provide suggestions for:
    - Furniture
    - Wall colors (with hex codes)
    - Lighting
    - Curtains
    - Flooring
    - Decor items
    - Storage improvements
    - Space optimization
    - An explanation of why these choices work for the selected style.
  `;

  const contents = [
    { text: prompt }
  ];

  if (imageBase64) {
    contents.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64.split(',')[1]
      }
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents: { parts: contents },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          furniture: { type: Type.ARRAY, items: { type: Type.STRING } },
          wallColors: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                hex: { type: Type.STRING }
              }
            } 
          },
          lighting: { type: Type.ARRAY, items: { type: Type.STRING } },
          curtains: { type: Type.ARRAY, items: { type: Type.STRING } },
          flooring: { type: Type.ARRAY, items: { type: Type.STRING } },
          decor: { type: Type.ARRAY, items: { type: Type.STRING } },
          storage: { type: Type.ARRAY, items: { type: Type.STRING } },
          spaceOptimization: { type: Type.ARRAY, items: { type: Type.STRING } },
          explanation: { type: Type.STRING }
        },
        required: ["furniture", "wallColors", "lighting", "curtains", "flooring", "decor", "explanation"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const chatWithAssistant = async (history) => {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are InteriorVista AI, a helpful and professional interior design assistant. Give practical, stylish, and creative advice on home decor, furniture, and space planning."
    }
  });

  const lastMessage = history[history.length - 1].text;
  const result = await chat.sendMessage(lastMessage);
  return result.text;
};
