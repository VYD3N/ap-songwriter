// services/openaiService.ts
// ---------------------------
// Drop‑in replacement for the old `geminiService.ts` but powered by OpenAI's SDK.
// It keeps the exact same public interface so no other part of your codebase
// needs to change except the import path.
//
// 👉  ENV REQUIREMENTS  👈
// - Add `OPENAI_API_KEY` to your .env (the SDK will pick up `import.meta.env` or
//   `process.env`).
// - Optionally add `VITE_OPENAI_MODEL` to override the default model (e.g., "o4-mini", "o3-mini")
// - Optionally add `OPENAI_BASE_URL` if you're routing through a proxy.
//
// 👉  INSTALL  👈
//   npm i openai@^4
//   # or, with the CDN setup you're using, add to importmap:
//   //   "openai": "https://esm.sh/openai@^4.25.0"
//
// The functions below mirror the Gemini versions:
//   • generateSongPrompt       – full song + metadata
//   • regenerateLyrics         – keep structure, new lyrics
//   • generateFieldSuggestion  – single‑field "dice" autogen
// Each function returns the same TypeScript types (`SunoSong | string`).
//
// If you want to switch the model later, just set `VITE_OPENAI_MODEL` in your .env file.

import { OpenAI } from "openai";
import { FormInput, SunoSong, AutogenField } from "../types";
import {
  MASTER_PROMPT,
  FIELD_SUGGESTION_PROMPT,
  LYRIC_REROLL_PROMPT,
} from "../constants";

// ---------------------------------------------------------------------------
// Initialise client once. The SDK will throw if the key is missing.
// ---------------------------------------------------------------------------
const openai = new OpenAI({
  apiKey: (import.meta as any).env?.OPENAI_API_KEY ?? process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Default to o4-mini unless overridden via environment variable
const MODEL = 
  (import.meta as any).env?.VITE_OPENAI_MODEL ?? 
  process.env.VITE_OPENAI_MODEL ?? 
  "o4-mini";

// Helper: o-series reasoning models do **not** support custom temperature.
const IS_O_SERIES = /^o[0-9]+-mini/i.test(MODEL);

function maybeTemp(value: number) {
  return IS_O_SERIES ? {} : { temperature: value };
}

// ---------------------------------------------------------------------------
// 1. Full Song Generation ----------------------------------------------------
// ---------------------------------------------------------------------------
export async function generateSongPrompt(formData: FormInput): Promise<SunoSong> {
  const response = await openai.chat.completions.create({
    model: MODEL,
    ...maybeTemp(0.9),
    messages: [
      { role: "system", content: MASTER_PROMPT.trim() },
      { role: "user",   content: JSON.stringify(formData) },
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content!) as SunoSong;
}

// ---------------------------------------------------------------------------
// 2. Lyric Re‑roll -----------------------------------------------------------
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
      { role: "system", content: LYRIC_REROLL_PROMPT.trim() },
      {
        role: "user",
        content: JSON.stringify({ songData, notes, excludeWords }),
      },
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content!) as SunoSong;
}

// ---------------------------------------------------------------------------
// 3. Single‑field autogen (the "🎲 dice" button) -----------------------------
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
      { role: "user",   content: JSON.stringify({ formData, field }) },
    ],
  });

  return response.choices[0].message.content?.trim() ?? "";
} 