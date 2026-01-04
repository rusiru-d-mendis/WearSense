import React, { useState, useCallback } from 'react';
import { CameraIcon } from './Icons';

interface PhotoUploaderProps {
  onFileUpload: (file: File | null) => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = useCallback((files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert("File is too large. Please upload an image under 10MB.");
        return;
      }
      onFileUpload(file);
      setPreview(URL.createObjectURL(file));
    }
  }, [onFileUpload]);

  // Fix: Corrected the event type to HTMLLabelElement for drag handlers.
  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  // Fix: Corrected the event type to HTMLLabelElement for drag handlers.
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  // Fix: Corrected the event type to HTMLLabelElement for drag handlers.
  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);

  return (
    <div className="mt-4">
      <label
        htmlFor="photo-upload"
        className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="object-contain w-full h-full rounded-lg" />
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <CameraIcon className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              Drag & Drop or <span className="font-semibold text-indigo-600">Browse</span>
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
          </div>
        )}
      </label>
      <input
        id="photo-upload"
        type="file"
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        onChange={(e) => handleFileChange(e.target.files)}
      />
    </div>
  );
};

export default PhotoUploader;
