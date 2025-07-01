
import { GoogleGenAI } from "@google/genai";
import { FormInput, SunoSong, AutogenField } from '../types';
import { MASTER_PROMPT, LYRIC_REROLL_PROMPT, FIELD_SUGGESTION_PROMPT } from '../constants';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getLyricStyleDescription = (styleValue: number): string => {
  if (styleValue <= 20) return "Very Structured (clear narrative, direct language, conventional rhyme/meter)";
  if (styleValue <= 40) return "Mostly Structured (clear story with some metaphorical language)";
  if (styleValue <= 60) return "Balanced (a mix of narrative and abstract imagery)";
  if (styleValue <= 80) return "Mostly Abstract (impressionistic, heavily metaphorical, less focus on a linear story)";
  return "Very Abstract (dreamlike, non-linear, focused on evoking feeling over telling a story)";
};

const constructPrompt = (input: FormInput): string => {
  return MASTER_PROMPT
    .replace('{{GENRE}}', input.genre)
    .replace('{{MOOD}}', input.mood)
    .replace('{{THEME}}', input.theme)
    .replace('{{LYRIC_PROMPT}}', input.lyricPrompt)
    .replace('{{INSTRUMENT}}', input.instrument)
    .replace('{{LYRIC_STYLE_DESCRIPTION}}', getLyricStyleDescription(input.lyricStyle))
    .replace('{{EXCLUDE_LYRICS}}', input.excludeLyrics || 'none');
}

const parseJsonResponse = (jsonStr: string): SunoSong => {
    let cleanJsonStr = jsonStr.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = cleanJsonStr.match(fenceRegex);
    if (match && match[2]) {
      cleanJsonStr = match[2].trim();
    }
    
    const parsedData: SunoSong = JSON.parse(cleanJsonStr);
    
    if (!parsedData.metadata || !parsedData.sections) {
        throw new Error("Invalid JSON structure received from API.");
    }

    return parsedData;
}


export const generateSongPrompt = async (input: FormInput): Promise<SunoSong> => {
  const prompt = constructPrompt(input);
  let jsonStr = '';

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.8,
      },
    });
    
    jsonStr = response.text;
    return parseJsonResponse(jsonStr);

  } catch (error) {
    console.error("Error generating song prompt:", error);
    if (error instanceof SyntaxError) {
        console.error("Raw AI response causing parse error:", jsonStr);
        throw new Error("Failed to parse the song data from the AI. The response was not valid JSON. Please try generating again.");
    }
    throw new Error("An error occurred while communicating with the AI. Please try again.");
  }
};

export const regenerateLyrics = async (currentSong: SunoSong, notes: string, excludeLyrics: string): Promise<SunoSong> => {
    const prompt = LYRIC_REROLL_PROMPT
      .replace('{{REROLL_NOTES}}', notes)
      .replace('{{EXCLUDE_LYRICS}}', excludeLyrics || 'none')
      .replace('{{SONG_JSON}}', JSON.stringify(currentSong, null, 2));
    
    let jsonStr = '';

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                temperature: 0.7,
            },
        });

        jsonStr = response.text;
        return parseJsonResponse(jsonStr);

    } catch (error) {
        console.error("Error re-rolling lyrics:", error);
        if (error instanceof SyntaxError) {
            console.error("Raw AI response causing parse error:", jsonStr);
            throw new Error("Failed to parse the re-rolled song data from the AI. The response was not valid JSON. Please try again.");
        }
        throw new Error("An error occurred while communicating with the AI during lyric re-roll. Please try again.");
    }
};

export const generateFieldSuggestion = async (currentInput: FormInput, fieldToGenerate: AutogenField): Promise<string> => {
    const prompt = FIELD_SUGGESTION_PROMPT
        .replace('{{FIELD_TO_GENERATE}}', fieldToGenerate)
        .replace('{{GENRE}}', currentInput.genre)
        .replace('{{MOOD}}', currentInput.mood)
        .replace('{{THEME}}', currentInput.theme)
        .replace('{{LYRIC_PROMPT}}', currentInput.lyricPrompt)
        .replace('{{INSTRUMENT}}', currentInput.instrument);
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
            config: {
                temperature: 0.9,
                topK: 40
            },
        });

        return response.text.trim();
    } catch (error) {
        console.error(`Error generating suggestion for ${fieldToGenerate}:`, error);
        throw new Error(`Failed to generate suggestion for ${fieldToGenerate}.`);
    }
}