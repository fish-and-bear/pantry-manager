import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { PantryItem, Category } from '../lib/types';

interface PantryItemListProps {
  items: PantryItem[];
  expiringSoonItems: PantryItem[];
  onItemSelect: (item: PantryItem) => void;
  onDeleteItem: (id: string) => void;
  onQuickEdit: (item: PantryItem) => void;
  onSort: (newSortBy: keyof PantryItem) => void;
  categories: Category[];
}

const PantryItemList: React.FC<PantryItemListProps> = ({
  items,
  expiringSoonItems,
  onItemSelect,
  onDeleteItem,
  onQuickEdit,
  onSort,
  categories
}) => {
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell onClick={() => onSort('name')}>Name</TableCell>
            <TableCell onClick={() => onSort('quantity')}>Quantity</TableCell>
            <TableCell onClick={() => onSort('category')}>Category</TableCell>
            <TableCell onClick={() => onSort('expirationDate')}>Expiration Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {item.imageUrl && (
                  <Avatar alt={item.name} src={item.imageUrl} sx={{ width: 50, height: 50 }} />
                )}
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{`${item.quantity} ${item.unit}`}</TableCell>
              <TableCell>{getCategoryName(item.category)}</TableCell>
              <TableCell>
                {item.expirationDate}
                {expiringSoonItems.includes(item) && (
                  <Chip label="Expiring Soon" color="warning" size="small" sx={{ ml: 1 }} />
                )}
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onItemSelect(item)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDeleteItem(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PantryItemList;