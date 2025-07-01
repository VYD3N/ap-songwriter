import React, { useState } from 'react';
import { SunoSong, SunoVersion } from '../types';
import Loader from './Loader';
import SunoFormattedView from './SunoFormattedView';
import { SparkleIcon, RefreshIcon } from './Icon';
import CopyableField from './CopyableField';
import SunoVersionToggle from './SunoVersionToggle';

interface OutputDisplayProps {
  songData: SunoSong | null;
  isLoading: boolean;
  error: string | null;
  onLyricReroll: (notes: string) => void;
  isRerolling: boolean;
  sunoVersion: SunoVersion;
  setSunoVersion: React.Dispatch<React.SetStateAction<SunoVersion>>;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ songData, isLoading, error, onLyricReroll, isRerolling, sunoVersion, setSunoVersion }) => {
  const [isRerollVisible, setRerollVisible] = useState(false);
  const [rerollNotes, setRerollNotes] = useState('');

  const handleRerollSubmit = () => {
    onLyricReroll(rerollNotes);
    setRerollVisible(false);
  };
  
  const renderContent = () => {
    if (isLoading) {
      return <div className="p-4 sm:p-6"><Loader /></div>;
    }
    if (error) {
      return <div className="p-4 sm:p-6"><div className="text-center p-8 bg-red-500 border-2 border-acid-black text-acid-white"><p>{error}</p></div></div>;
    }
    if (songData) {
      return (
        <div className="space-y-4">
          <SunoVersionToggle currentVersion={sunoVersion} onVersionChange={setSunoVersion} />
          <div>
            <h3 className="text-base font-bold text-acid-black mb-2">Suno Inputs</h3>
            <div className="space-y-2">
                <CopyableField 
                label="Style Description" 
                value={songData.metadata.style_description || "Not generated"} 
                />
                <CopyableField 
                label="Exclude from Style" 
                value={songData.metadata.exclude_style || "Not generated"} 
                />
            </div>
          </div>
          <div>
             <div className="border-t-2 border-acid-black pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="block text-sm font-bold text-acid-black">Suno Lyrics Field</h3>
                    <button 
                        onClick={() => setRerollVisible(!isRerollVisible)}
                        className="flex items-center text-sm text-acid-black hover:text-acid-pink transition-colors underline"
                    >
                       <RefreshIcon className="w-4 h-4 mr-1" />
                       Re-roll Lyrics
                    </button>
                </div>
                
                {isRerollVisible && (
                    <div className="my-4 p-4 bg-acid-gray border-2 border-acid-black shadow-inset space-y-3">
                        <label htmlFor="reroll-notes" className="block text-sm font-bold text-acid-black">Notes for Re-roll</label>
                        <textarea
                            id="reroll-notes"
                            value={rerollNotes}
                            onChange={(e) => setRerollNotes(e.target.value)}
                            placeholder="e.g., 'Make chorus more hopeful'"
                            className="block w-full bg-acid-white border-2 border-acid-black p-2 focus:outline-none focus:ring-2 focus:ring-acid-pink text-acid-black placeholder-acid-gray text-xs"
                            rows={3}
                        />
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setRerollVisible(false)} className="p-2 text-xs font-bold border-2 border-acid-black bg-acid-gray active:shadow-inset shadow-outset">Cancel</button>
                            <button onClick={handleRerollSubmit} disabled={isRerolling} className="p-2 text-xs font-bold border-2 border-acid-black text-acid-black bg-acid-pink active:shadow-inset shadow-outset-pink disabled:bg-acid-gray flex items-center">
                                {isRerolling ? 'Generating...' : 'Generate New Lyrics'}
                            </button>
                        </div>
                    </div>
                )}

                {isRerolling && !isLoading && <div className="py-8"><Loader/></div>}
                
                {(!isRerolling || isLoading) && <SunoFormattedView songData={songData} sunoVersion={sunoVersion} />}
             </div>
          </div>
        </div>
      );
    }
    return (
       <div className="p-4">
        <div className="text-center p-10 border-2 border-dashed border-acid-black">
          <SparkleIcon className="mx-auto h-12 w-12 text-acid-black" />
          <h3 className="mt-2 text-lg font-bold text-acid-black">Let's create a song</h3>
          <p className="mt-1 text-sm text-acid-black">Fill out the form to see the magic happen.</p>
        </div>
       </div>
    );
  };

  return (
    <div className="p-4 border-2 border-acid-black bg-acid-gray shadow-outset min-h-[60vh]">
      {renderContent()}
    </div>
  );
};

export default OutputDisplay;