
import React from 'react';
import { SkinTone } from '../types';
import { SKIN_TONES } from '../constants';

interface SkinToneSelectorProps {
  selectedTone?: SkinTone;
  onSelect: (tone: SkinTone) => void;
}

const SkinToneSelector: React.FC<SkinToneSelectorProps> = ({ selectedTone, onSelect }) => {
  return (
    <div className="w-full text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Select Your Skin Tone</h2>
      <p className="text-indigo-200 mb-8">Choose the one that most closely matches your skin.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {SKIN_TONES.map((tone) => (
          <button
            key={tone.name}
            onClick={() => onSelect(tone)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 ${
              selectedTone?.name === tone.name ? 'border-indigo-400 scale-105 shadow-lg' : 'border-transparent'
            }`}
          >
            <div
              className="w-full h-24 rounded-md mb-3"
              style={{ backgroundColor: tone.hex }}
            />
            <h3 className="font-semibold text-white">{tone.name}</h3>
            <p className="text-sm text-gray-400">{tone.undertone} Undertone</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SkinToneSelector;
