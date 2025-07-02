import React, { useState, useCallback } from 'react';
import { FormInput, SunoSong, AutogenField, SunoVersion } from './types';
import { generateSongPrompt, regenerateLyrics, generateFieldSuggestion } from './services/openaiService';
import Header from './components/Header';
import InputForm from './components/InputForm';
import OutputDisplay from './components/OutputDisplay';

// Helper to map slider value to description
function getLyricStyleDescription(value: number): string {
  if (value <= 20) return "Structured";
  if (value <= 40) return "Mostly Structured";
  if (value <= 60) return "Balanced";
  if (value <= 80) return "Mostly Abstract";
  return "Abstract";
}

// Helper to map rhyme slider value to description
function getRhymeStyleDescription(value: number): string {
  if (value <= 20) return "Rhyming";
  if (value <= 40) return "Mostly Rhyming";
  if (value <= 60) return "Balanced";
  if (value <= 80) return "Mostly No Rhyming";
  return "No Rhyming";
}

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormInput>({
    genre: 'Synthwave',
    mood: 'Nostalgic, hopeful',
    theme: 'A lone drive through a neon-lit city at night',
    lyricPrompt: 'City lights blurring, chasing ghosts of the past, finding a new path forward',
    instrument: 'Driving 80s synth bassline',
    lyricStyle: 50,
    rhymeStyle: 0, // default to fully rhyming
    excludeLyrics: 'shadow, shadows, echo, echoes, whisper, whispers, hum, cosmic, kaleidoscopic, tapestry, neon, fractal, ',
  });
  const [songData, setSongData] = useState<SunoSong | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRerolling, setIsRerolling] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingField, setGeneratingField] = useState<AutogenField | null>(null);
  const [sunoVersion, setSunoVersion] = useState<SunoVersion>('v3-4');


  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSongData(null);

    // Map lyricStyle and rhymeStyle to descriptions
    const formDataWithDescription = {
      ...formData,
      lyricStyle: getLyricStyleDescription(formData.lyricStyle),
      rhymeStyle: getRhymeStyleDescription(formData.rhymeStyle),
    };

    try {
      const generatedSong = await generateSongPrompt(formDataWithDescription);
      setSongData(generatedSong);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  const handleLyricReroll = useCallback(async (notes: string) => {
    if (!songData) return;
    setIsRerolling(true);
    setError(null);

    // Map lyricStyle and rhymeStyle to descriptions for reroll as well
    const formDataWithDescription = {
      ...formData,
      lyricStyle: getLyricStyleDescription(formData.lyricStyle),
      rhymeStyle: getRhymeStyleDescription(formData.rhymeStyle),
    };

    try {
        let regeneratedSong = await regenerateLyrics(songData, notes, formDataWithDescription.excludeLyrics);
        // Fallback: if metadata is missing, copy from previous songData
        if (!regeneratedSong.metadata && songData.metadata) {
          regeneratedSong.metadata = songData.metadata;
        }
        // Fallback: if sections is missing or not an array, copy from previous songData
        if ((!Array.isArray(regeneratedSong.sections) || !regeneratedSong.sections.length) && Array.isArray(songData.sections)) {
          regeneratedSong.sections = songData.sections;
        }
        setSongData(regeneratedSong);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred while re-rolling lyrics.');
        console.error(err);
    } finally {
        setIsRerolling(false);
    }
  }, [songData, formData]);

  const handleGenerateField = useCallback(async (field: AutogenField) => {
    setGeneratingField(field);
    setError(null);
    try {
        const suggestion = await generateFieldSuggestion(formData, field);
        setFormData(prev => ({ ...prev, [field]: suggestion }));
    } catch (err) {
        // Not setting a major error message for this, just logging it.
        console.error(`Error generating suggestion for ${field}:`, err);
    } finally {
        setGeneratingField(null);
    }
  }, [formData]);


  return (
    <div className="min-h-screen bg-acid-yellow flex items-center justify-center p-4">
        <div className="w-full max-w-7xl border-2 border-acid-black bg-acid-yellow shadow-[8px_8px_0px_#000000]">
            <Header />
            <main className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 items-start">
                <div className="lg:col-span-4 xl:col-span-3">
                <InputForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    onGenerateField={handleGenerateField}
                    generatingField={generatingField}
                />
                </div>
                <div className="lg:col-span-8 xl:col-span-9">
                <OutputDisplay
                    songData={songData}
                    isLoading={isLoading}
                    error={error}
                    onLyricReroll={handleLyricReroll}
                    isRerolling={isRerolling}
                    sunoVersion={sunoVersion}
                    setSunoVersion={setSunoVersion}
                />
                </div>
            </main>
        </div>
    </div>
  );
};

export default App;