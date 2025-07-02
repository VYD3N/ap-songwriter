import React from 'react';
import { FormInput, AutogenField } from '../types';
import { SparkleIcon, DiceIcon, SpinnerIcon } from './Icon';

interface InputFormProps {
  formData: FormInput;
  setFormData: React.Dispatch<React.SetStateAction<FormInput>>;
  onSubmit: () => void;
  isLoading: boolean;
  onGenerateField: (field: AutogenField) => void;
  generatingField: AutogenField | null;
}

const AutogenInputField: React.FC<{
  id: AutogenField;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  isTextArea?: boolean;
  onAutogen: () => void;
  isAutogenLoading: boolean;
  isMainLoading: boolean;
}> = ({ id, label, value, onChange, placeholder, isTextArea = false, onAutogen, isAutogenLoading, isMainLoading }) => {
  const commonProps = {
    id,
    name: id,
    value,
    onChange,
    placeholder,
    className: "block w-full bg-acid-white border-2 border-acid-black p-2 focus:outline-none focus:ring-2 focus:ring-acid-pink text-acid-black placeholder-acid-gray text-xs",
    disabled: isMainLoading || isAutogenLoading,
  };
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-acid-black mb-1">
        {label}
      </label>
      <div className="relative">
        {isTextArea ? (
          <textarea {...commonProps} rows={3}></textarea>
        ) : (
          <input type="text" {...commonProps} />
        )}
        <button 
          onClick={onAutogen}
          disabled={isMainLoading || isAutogenLoading}
          className="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-acid-black disabled:opacity-50"
          aria-label={`Generate ${label}`}
        >
          {isAutogenLoading ? <SpinnerIcon className="w-4 h-4" /> : <DiceIcon className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

const InputField: React.FC<{
  id: keyof FormInput;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  isTextArea?: boolean;
}> = ({ id, label, value, onChange, placeholder, isTextArea = false }) => {
  const commonProps = {
    id,
    name: id,
    value,
    onChange,
    placeholder,
    className: "block w-full bg-acid-white border-2 border-acid-black p-2 focus:outline-none focus:ring-2 focus:ring-acid-pink text-acid-black placeholder-acid-gray text-xs",
  };
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-acid-black mb-1">
        {label}
      </label>
      {isTextArea ? (
        <textarea {...commonProps} rows={3}></textarea>
      ) : (
        <input type="text" {...commonProps} />
      )}
    </div>
  );
};


const SliderField: React.FC<{
  id: keyof FormInput;
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  minLabel: string;
  maxLabel: string;
}> = ({ id, label, value, onChange, minLabel, maxLabel }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-acid-black mb-1">
      {label}
    </label>
    <input
      type="range"
      id={id}
      name={id}
      min="0"
      max="100"
      value={value}
      onChange={onChange}
      className="w-full h-2 bg-acid-gray appearance-none cursor-pointer accent-acid-pink border-2 border-acid-black"
    />
    <div className="flex justify-between text-xs text-acid-black mt-1">
      <span>{minLabel}</span>
      <span>{maxLabel}</span>
    </div>
  </div>
);

const InputForm: React.FC<InputFormProps> = ({ formData, setFormData, onSubmit, isLoading, onGenerateField, generatingField }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isRange = (e.target as HTMLInputElement).type === 'range';
    setFormData(prev => ({ 
        ...prev, 
        [name]: isRange ? parseInt(value, 10) : value 
    }));
  };

  return (
    <div className="p-4 border-2 border-acid-black bg-acid-gray shadow-outset">
      <div className="space-y-4">
        <AutogenInputField
          id="genre"
          label="Genre"
          value={formData.genre}
          onChange={handleChange}
          placeholder="e.g., Indie Folk"
          onAutogen={() => onGenerateField('genre')}
          isAutogenLoading={generatingField === 'genre'}
          isMainLoading={isLoading}
        />
        <AutogenInputField
          id="mood"
          label="Mood"
          value={formData.mood}
          onChange={handleChange}
          placeholder="e.g., Melancholy"
          onAutogen={() => onGenerateField('mood')}
          isAutogenLoading={generatingField === 'mood'}
          isMainLoading={isLoading}
        />
        <AutogenInputField
          id="theme"
          label="Theme"
          value={formData.theme}
          onChange={handleChange}
          placeholder="e.g., Lost love"
          isTextArea
          onAutogen={() => onGenerateField('theme')}
          isAutogenLoading={generatingField === 'theme'}
          isMainLoading={isLoading}
        />
        <AutogenInputField
          id="lyricPrompt"
          label="Lyric Ideas"
          value={formData.lyricPrompt}
          onChange={handleChange}
          placeholder="e.g., Cosmic journey"
          isTextArea
          onAutogen={() => onGenerateField('lyricPrompt')}
          isAutogenLoading={generatingField === 'lyricPrompt'}
          isMainLoading={isLoading}
        />
        <InputField
          id="excludeLyrics"
          label="Exclude Words"
          value={formData.excludeLyrics}
          onChange={handleChange}
          placeholder="e.g., shadow, echo"
          isTextArea
        />
        <SliderField
          id="lyricStyle"
          label="Lyric Style"
          value={formData.lyricStyle}
          onChange={handleChange}
          minLabel="Structured"
          maxLabel="Abstract"
        />
        <SliderField
          id="rhymeStyle"
          label="Rhyme Style"
          value={formData.rhymeStyle}
          onChange={handleChange}
          minLabel="Rhyming"
          maxLabel="No Rhyming"
        />
        <AutogenInputField
          id="instrument"
          label="Instrument/Style"
          value={formData.instrument}
          onChange={handleChange}
          placeholder="e.g., Guitar riff"
          onAutogen={() => onGenerateField('instrument')}
          isAutogenLoading={generatingField === 'instrument'}
          isMainLoading={isLoading}
        />
        <button
          onClick={onSubmit}
          disabled={isLoading || generatingField !== null}
          className="w-full flex justify-center items-center p-3 text-sm font-bold border-2 border-acid-black text-acid-black bg-acid-pink active:shadow-inset shadow-outset-pink hover:shadow-outset-pink-hover disabled:bg-acid-gray disabled:text-gray-500 disabled:shadow-none transition-all"
        >
          {isLoading ? (
            <>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <SparkleIcon className="w-4 h-4 mr-2 -ml-1"/>
              Generate Song
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputForm;