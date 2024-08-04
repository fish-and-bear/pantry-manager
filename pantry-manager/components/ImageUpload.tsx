'use client';

import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import Image from 'next/image';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  currentImage: string;
}

export default function ImageUpload({ onImageUpload, currentImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!storage) {
      setError("Firebase storage is not initialized");
      return;
    }
  
    const file = event.target.files?.[0];
    if (!file) {
      setError("No file selected");
      return;
    }
  
    const storageRef = ref(storage, `pantry_items/${Date.now()}_${file.name}`);

    setUploading(true);
    setError(null);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      onImageUpload(downloadURL);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      {currentImage && (
        <Image 
          src={currentImage} 
          alt="Pantry item" 
          width={200} 
          height={200} 
          layout="responsive"
        />
      )}
    </div>
  );
}