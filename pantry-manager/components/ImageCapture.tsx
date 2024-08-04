'use client';
import React, { useRef, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface ImageCaptureProps {
  onImageUpload: (url: string) => void;
}

const ImageCapture: React.FC<ImageCaptureProps> = ({ onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && storage) {
      setLoading(true);
      const storageRef = ref(storage, `pantry_items/${Date.now()}_${file.name}`);
      uploadBytes(storageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          onImageUpload(url);
          setLoading(false);
        }).catch((error) => {
          console.error("Error getting download URL:", error);
          setLoading(false);
        });
      }).catch((error) => {
        console.error("Error uploading file:", error);
        setLoading(false);
      });
    } else if (!storage) {
      console.error("Firebase storage is not initialized");
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCapture}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <Button
        variant="contained"
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Capture Image'}
      </Button>
    </div>
  );
};

export default ImageCapture;