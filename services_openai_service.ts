// services/openaiService.ts
// ---------------------------------------------------------------------------
//  OpenAI service wrapper for Suno Songwriter – supports o-series reasoning
//  models (`o3-mini`, `o4-mini`, …). These models DO NOT allow custom
//  `temperature` values – the parameter must be omitted or left at the default
//  (1). Passing any other value results in a **400 BadRequestError** as seen in
//  the console logs.  This file now removes the `temperature` field whenever
//  the selected model matches the o‑series pattern.
// ---------------------------------------------------------------------------

import { OpenAI } from "openai";
import type { FormInput, SunoSong, AutogenField } from "../types";
import {
  MASTER_SONG_PROMPT,
  FIELD_SUGGESTION_PROMPT,
  LYRICS_REROLL_PROMPT,
} from "../constants";

// Initialise client – will throw if key missing.
const openai = new OpenAI({
  apiKey:
    (import.meta as any).env?.OPENAI_API_KEY ?? process.env.OPENAI_API_KEY,
});

// Model selection: default to o3-mini unless overridden via env.
export const MODEL =
  (import.meta as any).env?.VITE_OPENAI_MODEL ?? process.env.VITE_OPENAI_MODEL ??
  "o3-mini";

// Helper: o‑series reasoning models do **not** support custom temperature.
const IS_O_SERIES = /^o[0-9]+-mini/i.test(MODEL);

function maybeTemp(value: number) {
  return IS_O_SERIES ? {} : { temperature: value };
}

// ---------------------------------------------------------------------------
// 1. Full Song Generation
// ---------------------------------------------------------------------------
export async function generateSongPrompt(formData: FormInput): Promise<SunoSong> {
  const response = await openai.chat.completions.create({
    model: MODEL,
    ...maybeTemp(0.9),
    messages: [
      { role: "system", content: MASTER_SONG_PROMPT.trim() },
      { role: "user", content: JSON.stringify(formData) },
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content!) as SunoSong;
}

// ---------------------------------------------------------------------------
// 2. Lyric Re‑roll
// ---------------------------------------------------------------------------
export async function regenerateLyrics(
  songData: SunoSong,
  notes: string,
  excludeWords: string,
): Promise<SunoSong> {
  const response = await openai.chat.completions.create({
    model: MODEL,
    ...maybeTemp(0.95),
    messages: [
      { role: "system", content: LYRICS_REROLL_PROMPT.trim() },
      { role: "user", content: JSON.stringify({ songData, notes, excludeWords }) },
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content!) as SunoSong;
}

// ---------------------------------------------------------------------------
// 3. Single‑field autogen (🎲 dice button)
// ---------------------------------------------------------------------------
export async function generateFieldSuggestion(
  formData: FormInput,
  field: AutogenField,
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: MODEL,
    ...maybeTemp(0.8),
    messages: [
      { role: "system", content: FIELD_SUGGESTION_PROMPT.trim() },
      { role: "user", content: JSON.stringify({ formData, field }) },
    ],
  });

  return response.choices[0].message.content?.trim() ?? "";
}
