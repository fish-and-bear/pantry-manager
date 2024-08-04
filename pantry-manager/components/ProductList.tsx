import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Chip, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const products = [
  {
    id: 1,
    name: 'Adidas ORKETRO SHOES Blue 36',
    image: '/path-to-image.jpg',
    variants: 6,
    category: 'Man Shoes',
    stock: { type: 'Stocked Product', count: 10 },
    status: 'low',
    retailPrice: { min: 180, max: 220 },
    wholesalePrice: { min: 100, max: 170 },
  },
  // Add more product objects here
];

const ProductList = () => (
  <Box>
    <Typography variant="h6" sx={{ mb: 2 }}>Product</Typography>
    <Grid container spacing={2}>
      {products.map((product) => (
        <Grid item xs={12} key={product.id}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <CardMedia
              component="img"
              sx={{ width: 80, height: 80, borderRadius: 2, mr: 2 }}
              image={product.image}
              alt={product.name}
            />
            <CardContent sx={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '0 !important' }}>
              <Box>
                <Typography variant="subtitle1" component="div">
                  {product.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Chip label={`${product.variants} variants`} size="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {product.category} • {product.stock.type}: {product.stock.count} in stock
                  </Typography>
                  {product.status === 'low' && (
                    <Chip label="low" size="small" color="error" sx={{ ml: 1 }} />
                  )}
                </Box>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" color="text.secondary">
                  RETAIL PRICE
                </Typography>
                <Typography variant="body1">
                  ${product.retailPrice.min.toFixed(2)}-${product.retailPrice.max.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  WHOLESALE PRICE
                </Typography>
                <Typography variant="body1">
                  ${product.wholesalePrice.min.toFixed(2)}-${product.wholesalePrice.max.toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default ProductList;