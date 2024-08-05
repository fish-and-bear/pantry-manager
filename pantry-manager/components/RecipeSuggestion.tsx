import React, { useState } from 'react';
import { Button, TextField, CircularProgress, Typography, Box } from '@mui/material';

interface RecipeSuggestionProps {
  pantryItems: string[];
}

const RecipeSuggestion: React.FC<RecipeSuggestionProps> = ({ pantryItems }) => {
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);

  const getRecipeSuggestion = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/suggest-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: pantryItems }),
      });
      const data = await response.json();
      setRecipe(data.recipe);
    } catch (error) {
      console.error('Error getting recipe suggestion:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Recipe Suggestion
      </Typography>
      <Button 
        onClick={getRecipeSuggestion} 
        disabled={loading}
        variant="contained"
        sx={{ mb: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Get Recipe Suggestion'}
      </Button>
      {recipe && (
        <TextField
          multiline
          fullWidth
          value={recipe}
          variant="outlined"
          InputProps={{ readOnly: true }}
        />
      )}
    </Box>
  );
};

export default RecipeSuggestion;