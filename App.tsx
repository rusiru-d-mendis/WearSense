import React, { useState, useMemo, useEffect } from 'react';
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
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  // PWA Install Logic
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  const isApiKeyMissing = !process.env.API_KEY || process.env.API_KEY === 'undefined' || process.env.API_KEY === '';

  const handleOccasionSelect = (occasion: string) => {
    setUserData(prev => {
      const currentOccasions = prev.occasions || [];
      const newOccasions = currentOccasions.includes(occasion)
        ? currentOccasions.filter(o => o !== occasion)
        : [...currentOccasions, occasion];
      
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
    if (isApiKeyMissing) {
      setError("Gemini API Key is missing. Please add API_KEY to your Vercel Environment Variables.");
      return;
    }

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
        ].filter(Boolean);

        const fullUserData: UserData = {
            image: {
                mimeType: imageFile!.type,
                data: base64Data,
            },
            occasions: finalOccasions,
        };
        const result = await getStyleAnalysis(fullUserData);
        setAnalysis(result);
    } catch (e: any) {
        setError(e.message || 'Sorry, we couldn\'t generate recommendations. Please try again.');
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
    if (isApiKeyMissing) {
      return (
        <div className="w-full max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-red-800 mb-2">Configuration Required</h2>
          <p className="text-red-600 mb-4">
            The Gemini <b>API_KEY</b> is missing from your environment variables.
          </p>
          <div className="text-sm text-left bg-white p-4 rounded border border-red-100 font-mono">
            1. Go to Vercel Dashboard<br/>
            2. Settings &gt; Environment Variables<br/>
            3. Add name: <b>API_KEY</b><br/>
            4. Value: <i>[Your Gemini API Key]</i><br/>
            5. Redeploy your project
          </div>
        </div>
      );
    }

    if (isLoading) return <LoadingSpinner />;
    if (analysis) return <RecommendationDisplay analysis={analysis} onReset={handleReset} />;

    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-8 animate-fade-in">
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
        {error && <p className="text-red-500 text-center font-medium">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed shadow-md"
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
      <header className="flex flex-col items-center justify-center text-center py-12 relative w-full max-w-4xl">
        {showInstallBtn && (
          <button 
            onClick={handleInstallClick}
            className="absolute top-0 right-0 px-4 py-2 bg-white/80 backdrop-blur border border-indigo-100 text-indigo-600 rounded-full text-xs font-bold shadow-sm hover:bg-indigo-50 transition-all animate-bounce"
          >
            📱 Install App
          </button>
        )}
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
        <p>Powered by Gemini 3 &mdash; WearSense</p>
      </footer>
    </div>
  );
}