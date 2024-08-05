import React, { useState } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Category } from '../lib/types';

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onAddCategory, onDeleteCategory }) => {
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  return (
    <Box>
      <TextField
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
        placeholder="New category name"
      />
      <Button onClick={handleAddCategory}>Add Category</Button>
      <List>
        {categories.map((category) => (
          <ListItem key={category.id} secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => onDeleteCategory(category.id)}>
              <DeleteIcon />
            </IconButton>
          }>
            <ListItemText primary={category.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CategoryManager;