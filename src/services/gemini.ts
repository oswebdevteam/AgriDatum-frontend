import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { Source } from '../types';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert AI agricultural advisor specifically for farmers in West Africa (Nigeria, Ghana, Ivory Coast, Senegal, etc.). 
Your goal is to provide accurate, actionable, and localized farming advice.

Your Capabilities:
1.  **Market Price Updates:** Provide recent market trends for crops like Cassava, Yams, Cocoa, Maize, Rice, Sorghum, and Plantains.
2.  **Planting & Harvesting:** Offer tips based on the West African seasons (Harmattan, Rainy Season).
3.  **Irrigation & Drainage:** Analyze weather patterns to recommend watering schedules or drainage systems.
4.  **Pest & Disease Prevention:** Identify common local threats (e.g., Fall Armyworm, Cocoa Swollen Shoot) and suggest remedies.

Guidelines:
-   **Contextualize:** Always consider the local climate (Tropical, Savannah) and common farming practices in West Africa.
-   **Use Grounding:** When asked about *current* prices or *specific* weather forecasts, you MUST use the provided Google Search tool to find the latest information. Do not hallucinate prices or weather.
-   **Tone:** Helpful, encouraging, and professional yet accessible.
-   **Formatting:** Use clean Markdown formatting for readability.
`;

let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });
  }
  return chatSession;
};

export const parseGroundingSources = (response: GenerateContentResponse): Source[] => {
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  const sources: Source[] = [];

  if (chunks) {
    chunks.forEach((chunk) => {
      if (chunk.web?.uri && chunk.web?.title) {
        sources.push({
          title: chunk.web.title,
          uri: chunk.web.uri,
        });
      }
    });
  }
  return sources;
};

export const sendMessageStream = async (
  message: string,
  onChunk: (text: string, sources?: Source[]) => void
): Promise<void> => {
  const chat = getChatSession();
  
  try {
    const stream = await chat.sendMessageStream({ message });
    
    let fullText = "";
    
    for await (const chunk of stream) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        fullText += c.text;
        const sources = parseGroundingSources(c);
        onChunk(fullText, sources.length > 0 ? sources : undefined);
      }
    }
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    onChunk("I'm having trouble connecting to the network. Please try again later.");
  }
};