'use client';

import React, { useState, useEffect } from 'react';
import { addDoc, updateDoc, doc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PantryItem } from '../lib/pantryData';
import ImageUpload from './ImageUpload';

interface PantryItemFormProps {
  item: PantryItem | null;
  onSubmit: () => void;
  setIsLoading: (isLoading: boolean) => void;
}

export default function PantryItemForm({ item, onSubmit, setIsLoading }: PantryItemFormProps) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setQuantity(item.quantity.toString());
      setUnit(item.unit);
      setExpirationDate(item.expirationDate || '');
      setImageUrl(item.imageUrl || '');
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    console.log("Submitting form with data:", { name, quantity, unit, expirationDate, imageUrl });
  
    if (!db) {
      console.error("Firestore is not initialized");
      setError("Firestore is not initialized");
      setIsLoading(false);
      return;
    }
  
    const itemData = { 
      name, 
      quantity: Number(quantity), 
      unit, 
      expirationDate,
      imageUrl 
    };
    
    try {
      console.log("Attempting to save item to Firestore");
      if (item) {
        await updateDoc(doc(db, 'pantryItems', item.id), itemData);
        console.log("Item updated successfully");
      } else {
        const docRef = await addDoc(collection(db, 'pantryItems'), itemData);
        console.log("Item added successfully with ID:", docRef.id);
      }
      
      setName('');
      setQuantity('');
      setUnit('');
      setExpirationDate('');
      setImageUrl('');
      onSubmit();
    } catch (error) {
      console.error('Error saving item:', error);
      setError(`Error saving item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Item Name"
        required
      />
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Quantity"
        required
      />
      <input
        type="text"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        placeholder="Unit"
      />
      <input
        type="date"
        value={expirationDate}
        onChange={(e) => setExpirationDate(e.target.value)}
      />
      <ImageUpload onImageUpload={setImageUrl} currentImage={imageUrl} />
      {error && <p style={{color: 'red'}}>{error}</p>}
      <button type="submit">{item ? 'Update' : 'Add'} Item</button>
    </form>
  );
}