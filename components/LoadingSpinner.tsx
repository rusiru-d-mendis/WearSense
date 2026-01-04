
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="text-center flex flex-col items-center justify-center p-8 min-h-[400px]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
      <h2 className="text-2xl font-bold text-gray-800 mt-6">Analyzing Your Style...</h2>
      <p className="text-gray-500 mt-2">Our AI is analyzing your photo to find your perfect palette.</p>
    </div>
  );
};

export default LoadingSpinner;
