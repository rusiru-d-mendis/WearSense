
import React from 'react';

interface OccasionSelectorProps {
  occasions: string[];
  selectedOccasions: string[];
  onSelect: (occasion: string) => void;
  otherOccasionText: string;
  onOtherOccasionChange: (text: string) => void;
}

const OccasionSelector: React.FC<OccasionSelectorProps> = ({ occasions, selectedOccasions, onSelect, otherOccasionText, onOtherOccasionChange }) => {
  const isOtherSelected = selectedOccasions.includes('Other');

  return (
    <>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {occasions.map((occasion) => {
          const isSelected = selectedOccasions.includes(occasion);
          return (
            <button
              key={occasion}
              onClick={() => onSelect(occasion)}
              className={`px-4 py-3 text-center rounded-lg border transition-all duration-200 font-medium ${
                isSelected
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
              } ${occasion === 'Other' && occasions.length % 2 !== 0 ? 'col-span-2' : ''}`}
            >
              {occasion}
            </button>
          );
        })}
      </div>
      {isOtherSelected && (
        <div className="mt-4 transition-all duration-300 ease-in-out">
          <input
            type="text"
            placeholder="Please specify your occasion"
            value={otherOccasionText}
            onChange={(e) => onOtherOccasionChange(e.target.value)}
            className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Specify other occasion"
          />
        </div>
      )}
    </>
  );
};

export default OccasionSelector;
