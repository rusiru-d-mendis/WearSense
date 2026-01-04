
import { GoogleGenAI, Type } from "@google/genai";
import { UserData, StyleAnalysis } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        palette: {
            type: Type.ARRAY,
            description: "An array of 3 recommended color palettes. Each palette should have a name and a list of 4-5 colors.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Name of the color palette (e.g., 'Power Colors', 'Neutral Basics', 'Accent Hues')." },
                    colors: {
                        type: Type.ARRAY,
                        description: "An array of color objects in this palette.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING, description: "The name of the color (e.g., 'Emerald Green', 'Charcoal Gray')." },
                                hex: { type: Type.STRING, description: "The valid hexadecimal code for the color (e.g., '#50C878')." }
                            },
                            required: ["name", "hex"],
                        }
                    }
                },
                required: ["name", "colors"],
            }
        },
        recommendations: {
            type: Type.ARRAY,
            description: "An array of 3-5 specific clothing recommendations.",
            items: {
                type: Type.OBJECT,
                properties: {
                    item: { type: Type.STRING, description: "The clothing item (e.g., 'Blazer', 'Dress Shirt', 'T-Shirt')." },
                    color: { type: Type.STRING, description: "A recommended color or color combination for this item, drawn from the generated palette." },
                    notes: { type: Type.STRING, description: "Brief styling advice or why this works for the user. Keep it concise and encouraging." }
                },
                required: ["item", "color", "notes"],
            }
        },
        summary: {
            type: Type.STRING,
            description: "A brief, encouraging summary of the style advice (2-3 sentences)."
        }
    },
    required: ["palette", "recommendations", "summary"],
};

export const getStyleAnalysis = async (userData: UserData): Promise<StyleAnalysis> => {
    const prompt = `
        Analyze the person in this photo. First, identify their skin tone (including undertone), hair color, and eye color.
        
        Then, based on these identified features and the specified occasion(s), provide personalized clothing color and style recommendations.
        Occasion(s): ${userData.occasions.join(', ')}

        Generate a style analysis in the specified JSON format.
        The color palettes should be harmonious and flattering for the user's features.
        The clothing recommendations should be appropriate for the specified occasion(s) and suggest colors from the palettes you create.
        The summary should be positive and empowering.
    `;
    
    const imagePart = {
        inlineData: {
          mimeType: userData.image.mimeType,
          data: userData.image.data,
        },
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            // Fix: Updated contents to follow the recommended structure for multipart requests.
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.7,
            },
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as StyleAnalysis;

        if (!result.palette || !result.recommendations || !result.summary) {
            throw new Error("Parsed JSON is missing required fields.");
        }

        return result;

    } catch (error) {
        console.error("Error fetching style analysis from Gemini:", error);
        throw new Error("Failed to get style recommendations from the AI service.");
    }
};
