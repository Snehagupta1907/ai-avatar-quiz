/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import livepeerUtils from '@/utils/livepeer';

interface PhotoUploadProps {
  onPhotoValidated: (file: File) => void;
  onError: (error: string) => void;
  onCancel?: () => void;
}

export function PhotoUpload({ onPhotoValidated, onError, onCancel }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validatedFile, setValidatedFile] = useState<File | null>(null);
  const [isValid, setIsValid] = useState(false);

  const validatePhoto = async (file: File) => {
    try {
      setIsValidating(true);
      // Skip face detection for now - just validate it's an image
      if (file.type.startsWith('image/')) {
        setIsValid(true);
        setValidatedFile(file);
      } else {
        setIsValid(false);
        onError('Please upload a valid image file');
      }
    } catch (error) {
      setIsValid(false);
      onError('Error validating photo');
      console.error('Photo validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      await validatePhoto(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  const handleNext = () => {
    if (validatedFile && isValid) {
      onPhotoValidated(validatedFile);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setValidatedFile(null);
    setIsValid(false);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors mb-6
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <input {...getInputProps()} />
        {isValidating ? (
          <div className="text-gray-600">Validating photo...</div>
        ) : preview ? (
          <div className="relative w-full aspect-square max-w-sm mx-auto">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        ) : (
          <div className="text-gray-600">
            <p>Drag and drop your photo here, or click to select</p>
            <p className="text-sm mt-2">Supported formats: PNG, JPG, JPEG</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {preview && (
        <div className="flex gap-4">
          <button
            onClick={handleCancel}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleNext}
            disabled={!isValid || isValidating}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors
              ${isValid && !isValidating
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            {isValidating ? 'Validating...' : 'Next'}
          </button>
        </div>
      )}
    </div>
  );
} 