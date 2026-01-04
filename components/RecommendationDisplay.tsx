import React from 'react';
import { StyleAnalysis } from '../types';

interface RecommendationDisplayProps {
  analysis: StyleAnalysis;
  onReset: () => void;
}

const RecommendationDisplay: React.FC<RecommendationDisplayProps> = ({ analysis, onReset }) => {
  const paletteAnimationDelay = 0.5;
  const recommendationsAnimationDelay = paletteAnimationDelay + (analysis.palette.length * 0.1) + 0.3;
  const buttonAnimationDelay = recommendationsAnimationDelay + (analysis.recommendations.length * 0.1) + 0.3;

  return (
    <div className="w-full max-w-3xl text-left bg-white rounded-2xl shadow-lg p-8 animate-fade-in-down">
      <div style={{ animation: 'fade-in 0.5s ease-out 0.2s forwards', opacity: 0 }}>
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">Your Style Guide</h2>
        <p className="text-gray-600 text-center mb-8">{analysis.summary}</p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800" style={{ animation: `fade-in 0.5s ease-out 0.4s forwards`, opacity: 0 }}>Your Recommended Color Palettes</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {analysis.palette.map((p, index) => (
            <div 
              key={index} 
              className="bg-slate-50 p-4 rounded-lg border"
              style={{ animation: `fade-in 0.4s ease-out ${paletteAnimationDelay + index * 0.1}s forwards`, opacity: 0 }}
            >
              <h4 className="font-bold mb-3 text-gray-700">{p.name}</h4>
              <div className="flex space-x-2">
                {p.colors.map((color, cIndex) => (
                  <div key={cIndex} className="flex-1 group relative">
                     <div
                      className="h-16 w-full rounded border"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="absolute bottom-full mb-2 w-max left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {color.name} <br /> {color.hex}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800" style={{ animation: `fade-in 0.5s ease-out ${recommendationsAnimationDelay - 0.1}s forwards`, opacity: 0 }}>Style Suggestions</h3>
        <ul className="space-y-4">
          {analysis.recommendations.map((rec, index) => (
            <li 
              key={index} 
              className="bg-slate-50 p-4 rounded-lg border"
              style={{ animation: `fade-in 0.4s ease-out ${recommendationsAnimationDelay + index * 0.1}s forwards`, opacity: 0 }}
            >
              <p className="font-bold text-indigo-600">{rec.item} - <span className="text-gray-800">{rec.color}</span></p>
              <p className="text-gray-600 text-sm mt-1">{rec.notes}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center mt-10" style={{ animation: `fade-in 0.5s ease-out ${buttonAnimationDelay}s forwards`, opacity: 0 }}>
        <button onClick={onReset} className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 transform hover:scale-105 transition-all">
          Start Over
        </button>
      </div>
    </div>
  );
};

export default RecommendationDisplay;