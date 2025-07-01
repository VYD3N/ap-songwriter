
export type AutogenField = 'genre' | 'mood' | 'theme' | 'lyricPrompt' | 'instrument';
export type SunoVersion = 'v4.5' | 'v3-4';

export interface FormInput {
  genre: string;
  mood: string;
  theme: string;
  lyricPrompt: string;
  instrument: string;
  lyricStyle: number;
  excludeLyrics: string;
}

export interface SongMetadata {
  genres: string[];
  style: string[];
  mood: string[];
  vocals: string;
  arrangement: string;
  instrumentation: string[];
  tempo: string;
  production: string[];
  structure: string[];
  dynamics: string;
  emotions: string[];
  song_name: string;
  album_name?: string;
  artist?: string;
  style_description?: string;
  exclude_style?: string;
}

export interface SongSection {
  title: string;
  description: string;
  musicalCue: string;
  lyrics: string[];
}

export interface SunoSong {
  metadata: SongMetadata;
  sections: SongSection[];
}