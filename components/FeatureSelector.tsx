
import React from 'react';
import { ColorOption } from '../types';

interface FeatureSelectorProps {
  title: string;
  options: ColorOption[];
  selectedOption?: ColorOption;
  onSelect: (option: ColorOption) => void;
}

const FeatureSelector: React.FC<FeatureSelectorProps> = ({ title, options, selectedOption, onSelect }) => {
  return (
    <div className="w-full">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 text-center">{title}</h2>
      <div className="flex flex-wrap justify-center gap-3">
        {options.map((option) => (
          <button
            key={option.name}
            onClick={() => onSelect(option)}
            className={`flex items-center gap-3 px-4 py-2 rounded-full border-2 transition-all duration-200 transform hover:scale-105 ${
              selectedOption?.name === option.name
                ? 'bg-indigo-600 border-indigo-400'
                : 'bg-white/10 border-transparent hover:bg-white/20'
            }`}
          >
            <div
              className="w-6 h-6 rounded-full border border-white/20"
              style={{ backgroundColor: option.hex }}
            />
            <span className="font-medium">{option.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeatureSelector;
