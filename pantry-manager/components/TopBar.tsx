import React from 'react';
import { AppBar, Toolbar, Typography, Button, InputBase, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

interface TopBarProps {
  onAddItem: () => void;
  onSearch: (term: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ onAddItem, onSearch }) => (
  <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'background.paper', boxShadow: 'none' }}>
    <Toolbar>
      <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
        Pantry Manager
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'background.default', borderRadius: 2, p: 1, mr: 2 }}>
        <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
        <InputBase
          placeholder="Search items..."
          onChange={(e) => onSearch(e.target.value)}
          sx={{ color: 'text.primary' }}
        />
      </Box>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddItem}
        sx={{ bgcolor: 'primary.main', color: 'background.paper' }}
      >
        Add Item
      </Button>
    </Toolbar>
  </AppBar>
);

export default TopBar;