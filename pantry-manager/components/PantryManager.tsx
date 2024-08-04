'use client';

import React, { useState, useEffect } from 'react';
import { Box, ThemeProvider, CssBaseline, Button, Menu, MenuItem } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import PantryItemList from './PantryItemList';
import AddEditItemModal from './AddEditItemModal';
import { PantryItem } from '../lib/types';
import darkTheme from '../lib/theme';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const PantryManager: React.FC = () => {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PantryItem | null>(null);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState<'name' | 'expirationDate' | 'quantity'>('name');
  useEffect(() => {
    const q = query(collection(db, 'pantryItems'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const pantryItems: PantryItem[] = [];
      querySnapshot.forEach((doc) => {
        pantryItems.push({ id: doc.id, ...doc.data() } as PantryItem);
      });
      setItems(pantryItems);
    });
    return () => unsubscribe();
  }, []);

  const handleSaveItem = async (item: Omit<PantryItem, 'id'> & { id?: string }) => {
    if (item.id) {
      await updateDoc(doc(db, 'pantryItems', item.id), item);
    } else {
      await addDoc(collection(db, 'pantryItems'), item);
    }
    setIsAddEditModalOpen(false);
    setSelectedItem(null);
  };

  const handleDeleteItem = async (id: string) => {
    await deleteDoc(doc(db, 'pantryItems', id));
    setSelectedItem(null);
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSortAnchor(event.currentTarget);
  };
  const handleSortClose = (sort?: 'name' | 'expirationDate' | 'quantity') => {
    setSortAnchor(null);
    if (sort) setSortBy(sort);
  };

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'expirationDate':
        return (a.expirationDate || '').localeCompare(b.expirationDate || '');
      case 'quantity':
        return a.quantity - b.quantity;
      default:
        return 0;
    }
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <TopBar 
          onAddItem={() => setIsAddEditModalOpen(true)}
          onSearch={setSearchTerm}
        />
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button startIcon={<SortIcon />} onClick={handleSortClick}>
              Sort
            </Button>
            <Menu
              anchorEl={sortAnchor}
              open={Boolean(sortAnchor)}
              onClose={() => handleSortClose()}
            >
              <MenuItem onClick={() => handleSortClose('name')}>Name</MenuItem>
              <MenuItem onClick={() => handleSortClose('expirationDate')}>Expiration Date</MenuItem>
              <MenuItem onClick={() => handleSortClose('quantity')}>Quantity</MenuItem>
            </Menu>
          </Box>
          <PantryItemList 
            items={sortedItems} 
            onItemSelect={setSelectedItem}
            onDeleteItem={handleDeleteItem}
          />
        </Box>
        <AddEditItemModal 
          open={isAddEditModalOpen || !!selectedItem}
          onClose={() => {
            setIsAddEditModalOpen(false);
            setSelectedItem(null);
          }}
          onSave={handleSaveItem}
          item={selectedItem}
        />
      </Box>
    </ThemeProvider>
  );
};

export default PantryManager;