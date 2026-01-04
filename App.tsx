
import React, { useState, useMemo } from 'react';
import { UserData, StyleAnalysis } from './types';
import { getStyleAnalysis } from './services/geminiService';
import { OCCASIONS } from './constants';
import { PlusIcon, WearSenseIcon } from './components/Icons';

import PhotoUploader from './components/PhotoUploader';
import OccasionSelector from './components/OccasionSelector';
import RecommendationDisplay from './components/RecommendationDisplay';
import LoadingSpinner from './components/LoadingSpinner';

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });


export default function App() {
  const [userData, setUserData] = useState<Partial<UserData>>({ occasions: [] });
  const [otherOccasionText, setOtherOccasionText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<StyleAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOccasionSelect = (occasion: string) => {
    setUserData(prev => {
      const currentOccasions = prev.occasions || [];
      const newOccasions = currentOccasions.includes(occasion)
        ? currentOccasions.filter(o => o !== occasion)
        : [...currentOccasions, occasion];
      
      // If "Other" is deselected, clear the custom text
      if (occasion === 'Other' && !newOccasions.includes('Other')) {
        setOtherOccasionText('');
      }

      return { ...prev, occasions: newOccasions };
    });
  };

  const hasSufficientOccasionData = useMemo(() => {
    const selected = userData.occasions || [];
    const hasStandardOccasion = selected.some(o => o !== 'Other');
    const hasValidOtherOccasion = selected.includes('Other') && otherOccasionText.trim() !== '';
    return hasStandardOccasion || hasValidOtherOccasion;
  }, [userData.occasions, otherOccasionText]);

  const isSubmitDisabled = !imageFile || !hasSufficientOccasionData;

  const handleSubmit = async () => {
    if (isSubmitDisabled) {
        setError("Please upload a photo and select at least one occasion.");
        return;
    }

    if (!navigator.onLine) {
        setError("You're offline. Please check your connection and try again.");
        return;
    }

    setIsLoading(true);
    setError(null);

    try {
        const base64Data = await fileToBase64(imageFile!);
        const finalOccasions = [
            ...(userData.occasions?.filter(o => o !== 'Other') || []),
            otherOccasionText
        ].filter(Boolean); // .filter(Boolean) removes any empty strings

        const fullUserData: UserData = {
            image: {
                mimeType: imageFile!.type,
                data: base64Data,
            },
            occasions: finalOccasions,
        };
        const result = await getStyleAnalysis(fullUserData);
        setAnalysis(result);
    } catch (e) {
        setError('Sorry, we couldn\'t generate recommendations. Please try again.');
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUserData({ occasions: [] });
    setOtherOccasionText('');
    setImageFile(null);
    setAnalysis(null);
    setError(null);
    setIsLoading(false);
  };

  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    if (analysis) return <RecommendationDisplay analysis={analysis} onReset={handleReset} />;

    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-8">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Upload a Photo</h2>
          <p className="text-gray-500 mt-1">Upload a clear, well-lit photo of yourself for an accurate analysis.</p>
          <PhotoUploader onFileUpload={setImageFile} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">What's the occasion? <span className="text-gray-500 font-normal">(Select all that apply)</span></h2>
          <OccasionSelector
            occasions={OCCASIONS}
            selectedOccasions={userData.occasions || []}
            onSelect={handleOccasionSelect}
            otherOccasionText={otherOccasionText}
            onOtherOccasionChange={setOtherOccasionText}
          />
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          <PlusIcon className="w-5 h-5" />
          Get My Style Guide
        </button>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen w-full bg-slate-50 text-gray-800 flex flex-col items-center p-4 sm:p-6 lg:p-8"
      style={{
        backgroundImage: 'radial-gradient(at 20% 20%, hsla(262, 100%, 95%, 1) 0px, transparent 50%), radial-gradient(at 80% 80%, hsla(340, 100%, 95%, 1) 0px, transparent 50%)',
        backgroundAttachment: 'fixed'
      }}
    >
      <header className="flex flex-col items-center justify-center text-center py-12">
        <WearSenseIcon className="h-12 w-12 text-indigo-600" />
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2">WearSense</h1>
        <p className="text-lg text-gray-600 mt-2 max-w-xl">
          Discover your perfect palette. Get AI-powered style advice tailored to your unique features.
        </p>
      </header>
      <main className="w-full flex-grow flex items-start justify-center">
        {renderContent()}
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Powered by AI &mdash; WearSense</p>
      </footer>
    </div>
  );
}