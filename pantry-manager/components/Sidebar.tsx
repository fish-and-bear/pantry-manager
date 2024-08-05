import React, { useState } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, Button, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Category } from '../lib/types';

interface SidebarProps {
  categories: Category[];
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
  onFilter: (category: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ categories, onAddCategory, onDeleteCategory, onFilter }) => {
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        placeholder="New category"
        sx={{ mb: 2 }}
      />
      <Button fullWidth variant="contained" onClick={handleAddCategory} sx={{ mb: 2 }}>
        Add Category
      </Button>
      <List>
        <ListItem button onClick={() => onFilter('')}>
          <ListItemText primary="All Items" />
        </ListItem>
        {categories.map((category) => (
          <ListItem button key={category.id} onClick={() => onFilter(category.id)}>
            <ListItemText primary={category.name} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => onDeleteCategory(category.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Sidebar;