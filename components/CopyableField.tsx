import React, { useState, useCallback } from 'react';
import { CopyIcon, CheckIcon } from './Icon';

interface CopyableFieldProps {
  label: string;
  value: string;
}

const CopyableField: React.FC<CopyableFieldProps> = ({ label, value }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (value) {
      navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [value]);

  return (
    <div>
      <label className="block text-sm font-bold text-acid-black mb-1">{label}</label>
      <div className="flex items-stretch space-x-2">
        <div className="flex-grow bg-acid-white border-2 border-acid-black p-2 text-xs font-mono">
          {value}
        </div>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 p-2 border-2 border-acid-black bg-acid-gray active:shadow-inset shadow-outset"
          aria-label={`Copy ${label}`}
        >
          {isCopied ? (
            <CheckIcon className="w-4 h-4 text-acid-black" />
          ) : (
            <CopyIcon className="w-4 h-4 text-acid-black" />
          )}
        </button>
      </div>
    </div>
  );
};

export default CopyableField;