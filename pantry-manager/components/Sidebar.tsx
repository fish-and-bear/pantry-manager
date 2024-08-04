'use client';

import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography, Toolbar } from '@mui/material';
import KitchenIcon from '@mui/icons-material/Kitchen';
import WarningIcon from '@mui/icons-material/Warning';

const drawerWidth = 240;

const Sidebar: React.FC = () => (
  <Drawer
    variant="permanent"
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', bgcolor: 'background.paper', border: 'none' },
    }}
  >
    <Toolbar /> {/* This ensures content starts below the AppBar */}
    <Box sx={{ overflow: 'auto', mt: 2 }}>
      <List>
        {['All Items', 'Expiring Soon'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon sx={{ color: 'text.secondary' }}>
              {index % 2 === 0 ? <KitchenIcon /> : <WarningIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Box>
  </Drawer>
);

export default Sidebar;