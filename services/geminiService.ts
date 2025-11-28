import { GoogleGenAI } from "@google/genai";

interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

// For Veo, we must ensure we have the selected key from the window context
const getClientForVeo = () => {
  const apiKey = process.env.API_KEY; 
  // Note: The API_KEY env var is automatically updated when the user selects a key via window.aistudio
  if (!apiKey) {
     throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const polishContent = async (text: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Rewrite the following social media post to be more engaging, professional yet friendly, and fix any grammar issues. Keep it concise. Return ONLY the rewritten text. Input: "${text}"`,
    });
    
    return response.text?.trim() || text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return text; // Return original on error
  }
};

export const generateImageDescription = async (base64Image: string): Promise<string> => {
    try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
                    { text: "Generate a short, engaging caption for this image for a social media post." }
                ]
            }
        });
        return response.text?.trim() || "";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "";
    }
}

export const askSearchAgent = async (query: string): Promise<{ text: string, sources: Array<{title: string, uri: string}> }> => {
    try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: query,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });

        const sources: Array<{title: string, uri: string}> = [];
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        
        if (groundingChunks) {
            groundingChunks.forEach((chunk: any) => {
                if (chunk.web) {
                    sources.push({ title: chunk.web.title, uri: chunk.web.uri });
                }
            });
        }

        return {
            text: response.text || "I couldn't find any information on that.",
            sources
        };
    } catch (error) {
        console.error("Search Agent Error:", error);
        return { text: "Sorry, I encountered an error while searching.", sources: [] };
    }
};

export const generateVideo = async (prompt: string, imageBase64?: string, skipKeyCheck: boolean = false): Promise<string> => {
    // Check if key is selected for Veo
    // Cast window to any to access aistudio safely without global declaration conflicts
    const aistudio = (window as any).aistudio as AIStudio;
    
    if (!skipKeyCheck) {
        const hasKey = await aistudio.hasSelectedApiKey();
        if (!hasKey) {
            throw new Error("API_KEY_REQUIRED");
        }
    }

    const ai = getClientForVeo();
    
    // We use fast-generate-preview for interactive usage as requested (Veo 3 context)
    const model = 'veo-3.1-fast-generate-preview';
    
    let operation;
    
    if (imageBase64) {
         operation = await ai.models.generateVideos({
            model,
            prompt,
            image: {
                imageBytes: imageBase64,
                mimeType: 'image/jpeg' 
            },
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });
    } else {
        // Text to video (not primary use case in this prompt but good fallback)
         operation = await ai.models.generateVideos({
            model,
            prompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });
    }

    // Polling loop
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation failed or returned no URI");
    }

    // Fetch the video bytes using the API key
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!response.ok) {
        throw new Error("Failed to download generated video");
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
};