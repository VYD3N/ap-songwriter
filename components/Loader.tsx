import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center text-acid-black">
      <svg className="animate-spin h-10 w-10 text-acid-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path fill="#FF00FF" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
      </svg>
      <p className="mt-4 text-base font-bold">Crafting your song...</p>
      <p className="text-xs">AI is warming up...</p>
    </div>
  );
};

export default Loader;