'use client';

import React from 'react';
import { Box, AppBar, Toolbar, Typography, Button, IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import KitchenIcon from '@mui/icons-material/Kitchen';
import Sidebar from './Sidebar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ display: 'flex', minHeight: '100vh' }}>
    <AppBar position="fixed" sx={{ 
      zIndex: 1200,
      bgcolor: 'background.paper', 
      boxShadow: 'none' 
    }}>
      <Toolbar>
        <KitchenIcon sx={{ mr: 2 }} />
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
          Pantry Manager
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'background.default', borderRadius: 2, p: 1, mr: 2 }}>
          <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          <InputBase
            placeholder="Search pantry items..."
            sx={{ color: 'text.primary' }}
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: 'primary.main', color: 'background.paper', px: 2 }}
        >
          Add Item
        </Button>
      </Toolbar>
    </AppBar>
    <Sidebar />
    <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, bgcolor: 'background.default' }}>
      {children}
    </Box>
  </Box>
);

export default Layout;