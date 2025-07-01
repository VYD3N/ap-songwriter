import React from 'react';
import { SunoVersion } from '../types';

interface SunoVersionToggleProps {
  currentVersion: SunoVersion;
  onVersionChange: (version: SunoVersion) => void;
}

const SunoVersionToggle: React.FC<SunoVersionToggleProps> = ({ currentVersion, onVersionChange }) => {
  const getButtonClass = (version: SunoVersion) => {
    const baseClass = 'p-2 text-xs font-bold border-2 border-acid-black flex-1 transition-all';
    if (currentVersion === version) {
      return `${baseClass} bg-acid-pink text-acid-black shadow-inset`;
    }
    return `${baseClass} bg-acid-gray text-acid-black shadow-outset`;
  };

  return (
    <div className="flex items-stretch border-2 border-acid-black shadow-outset mb-4">
      <button onClick={() => onVersionChange('v4.5')} className={getButtonClass('v4.5')}>
        Suno v4.5
      </button>
      <button onClick={() => onVersionChange('v3-4')} className={getButtonClass('v3-4')}>
        Suno v3-4
      </button>
    </div>
  );
};

export default SunoVersionToggle;