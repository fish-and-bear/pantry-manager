'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Tab, Tabs, Typography, CircularProgress } from '@mui/material';
import { PantryItem } from '../lib/types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

interface AddEditItemModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (item: Omit<PantryItem, 'id'> & { id?: string }) => void;
  item?: PantryItem | null;
}

const AddEditItemModal: React.FC<AddEditItemModalProps> = ({ open, onClose, onSave, item }) => {
  const [formData, setFormData] = useState<Omit<PantryItem, 'id'>>({
    name: '',
    quantity: 0,
    unit: '',
    expirationDate: '',
    imageUrl: '',
  });
  const [imageTab, setImageTab] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        expirationDate: item.expirationDate || '',
        imageUrl: item.imageUrl || '',
      });
    } else {
      setFormData({
        name: '',
        quantity: 0,
        unit: '',
        expirationDate: '',
        imageUrl: '',
      });
    }
    setImageTab(0);
    setFile(null);
  }, [item, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.name === 'quantity' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (imageTab === 1 && file) {
      setIsUploading(true);
      const storageRef = ref(storage, `pantry_images/${Date.now()}_${file.name}`);
      try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        formData.imageUrl = downloadURL;
      } catch (error) {
        console.error("Error uploading file:", error);
        // Optionally show an error message to the user
      } finally {
        setIsUploading(false);
      }
    }
    onSave(item ? { ...formData, id: item.id } : formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{item ? 'Edit Item' : 'Add New Item'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField label="Name" name="name" value={formData.name} onChange={handleChange} required />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} required sx={{ flex: 1 }} />
            <TextField label="Unit" name="unit" value={formData.unit} onChange={handleChange} required sx={{ flex: 1 }} />
          </Box>
          <TextField 
            label="Expiration Date" 
            name="expirationDate" 
            type="date" 
            value={formData.expirationDate} 
            onChange={handleChange} 
            InputLabelProps={{ shrink: true }} 
          />
          <Tabs value={imageTab} onChange={(_, newValue) => setImageTab(newValue)}>
            <Tab label="Image URL" />
            <Tab label="Upload Image" />
          </Tabs>
          {imageTab === 0 ? (
            <TextField label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
          ) : (
            <Box>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="raised-button-file">
                <Button variant="outlined" component="span">
                  Choose File
                </Button>
              </label>
              {file && <Typography variant="body2" sx={{ mt: 1 }}>{file.name}</Typography>}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={isUploading}>
          {isUploading ? <CircularProgress size={24} /> : (item ? 'Update' : 'Add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditItemModal;