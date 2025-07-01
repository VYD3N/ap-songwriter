import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-acid-pink text-acid-white border-b-2 border-acid-black p-2 flex items-center justify-between">
        <h1 className="text-base font-bold">
            AP Songwriter
        </h1>
        <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-acid-black bg-acid-gray flex items-center justify-center font-mono text-xs text-acid-black font-bold">_</div>
            <div className="w-4 h-4 border-2 border-acid-black bg-acid-gray flex items-center justify-center font-mono text-xs text-acid-black font-bold">□</div>
            <div className="w-4 h-4 border-2 border-acid-black bg-acid-gray flex items-center justify-center font-mono text-xs text-acid-black font-bold">X</div>
        </div>
    </header>
  );
};

export default Header;