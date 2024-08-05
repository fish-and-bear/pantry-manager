import React from 'react';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import SearchBar from './SearchBar';
import { Category, PantryItem } from '../lib/types';

interface LayoutProps {
  children: React.ReactNode;
  categories: Category[];
  onAddItem: () => void;
  onSearch: (term: string) => void;
  onSort: (newSortBy: keyof PantryItem) => void;
  onFilter: (category: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  categories, 
  onAddItem, 
  onSearch, 
  onSort, 
  onFilter 
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pantry Manager
          </Typography>
          <SearchBar onSearch={onSearch} />
          <Button color="inherit" onClick={onAddItem}>Add Item</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Box component="nav" sx={{ width: 240, flexShrink: 0 }}>
          {/* Add category filter buttons here */}
          {categories.map((category) => (
            <Button key={category.id} onClick={() => onFilter(category.id)}>
              {category.name}
            </Button>
          ))}
        </Box>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;