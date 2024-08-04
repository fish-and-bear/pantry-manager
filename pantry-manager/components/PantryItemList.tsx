import React from 'react';
import { Grid, Card, CardContent, Typography, CardMedia, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { PantryItem } from '../lib/types';

interface PantryItemListProps {
  items: PantryItem[];
  onItemSelect: (item: PantryItem) => void;
  onDeleteItem: (id: string) => void;
}

const PantryItemList: React.FC<PantryItemListProps> = ({ items, onItemSelect, onDeleteItem }) => (
  <Grid container spacing={2}>
    {items.map((item) => (
      <Grid item xs={12} sm={6} md={4} key={item.id}>
        <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          <CardMedia
            component="img"
            sx={{ width: 80, height: 80, borderRadius: 2, mr: 2 }}
            image={item.imageUrl || '/default-image.jpg'}
            alt={item.name}
          />
          <CardContent sx={{ flex: 1, p: '0 !important' }}>
            <Typography variant="subtitle1" component="div">
              {item.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quantity: {item.quantity} {item.unit}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Expires: {item.expirationDate}
            </Typography>
          </CardContent>
          <Box>
            <IconButton onClick={() => onItemSelect(item)} size="small">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDeleteItem(item.id)} size="small">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Card>
      </Grid>
    ))}
  </Grid>
);

export default PantryItemList;