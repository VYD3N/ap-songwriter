import React, { useMemo, useState, useCallback } from 'react';
import { SunoSong, SunoVersion } from '../types';
import { CopyIcon, CheckIcon } from './Icon';

interface SunoFormattedViewProps {
  songData: SunoSong;
  sunoVersion: SunoVersion;
}

const SunoFormattedView: React.FC<SunoFormattedViewProps> = ({ songData, sunoVersion }) => {
  const [isCopied, setIsCopied] = useState(false);

  const formattedText = useMemo(() => {
    const { metadata, sections } = songData;
    if (!Array.isArray(sections) || sections.length === 0) {
      return '[No sections available. The AI response may have been malformed.]';
    }
    let output = '';
    
    if (sunoVersion === 'v3-4') {
        const formatKey = (key: string) => key.toUpperCase().replace(/_/g, ' ');
        const formatValue = (value: any) => Array.isArray(value) ? value.join(', ') : value;
        
        const keysToExclude = ['song_name', 'album_name', 'artist', 'style_description', 'exclude_style'];

        for (const [key, value] of Object.entries(metadata)) {
          if(value && !keysToExclude.includes(key)){
              output += `[${formatKey(key)}: ${formatValue(value)}]\n`;
          }
        }
        output += '\n';
    }

    for (const section of sections) {
      output += `[${section.title.toUpperCase()}]\n`;
      if (sunoVersion === 'v3-4') {
        output += `[${section.musicalCue}]\n`;
      } else {
        output += `(${section.musicalCue})\n`;
      }

      if (section.lyrics && section.lyrics.length > 0) {
        output += section.lyrics.join('\n') + '\n';
      }
      output += '\n';
    }

    output += '[END]';

    return output.trim();
  }, [songData, sunoVersion]);

  const handleCopy = useCallback(() => {
    if (formattedText) {
      navigator.clipboard.writeText(formattedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [formattedText]);

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 p-2 border-2 border-acid-black bg-acid-gray active:shadow-inset shadow-outset"
        aria-label="Copy Suno lyrics field"
      >
        {isCopied ? (
          <CheckIcon className="w-4 h-4 text-acid-black" />
        ) : (
          <CopyIcon className="w-4 h-4 text-acid-black" />
        )}
      </button>
      <div className="bg-acid-white p-4 border-2 border-acid-black text-xs text-acid-black whitespace-pre-wrap break-words leading-relaxed max-h-[55vh] overflow-y-auto pr-12">
        {formattedText}
      </div>
    </div>
  );
};

export default SunoFormattedView;