
import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  const steps = ['Skin Tone', 'Features', 'Occasion'];
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        {steps.map((stepName, index) => (
          <div
            key={index}
            className={`text-sm ${currentStep > index + 1 ? 'text-indigo-300' : 'text-gray-400'} ${currentStep === index + 1 ? 'text-white font-semibold' : ''}`}
          >
            {stepName}
          </div>
        ))}
      </div>
      <div className="relative w-full h-1 bg-white/20 rounded-full">
        <div
          className="absolute top-0 left-0 h-1 bg-indigo-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default StepIndicator;
