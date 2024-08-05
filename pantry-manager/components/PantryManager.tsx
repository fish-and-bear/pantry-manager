"use client";

import React, { useState, useEffect } from "react";
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Grid,
  Paper,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import PantryItemList from "./PantryItemList";
import AddEditItemModal from "./AddEditItemModal";
import ConfirmDialog from "./ConfirmDialog";
import RecipeSuggestion from "./RecipeSuggestion";
import ImageCapture from "./ImageCapture";
import { PantryItem, Category } from "../lib/types";
import darkTheme from "../lib/theme";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { differenceInDays } from "date-fns";

const PantryManager: React.FC = () => {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedItem, setSelectedItem] = useState<PantryItem | null>(null);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof PantryItem>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const itemsQuery = query(collection(db, "pantryItems"));
    const unsubscribeItems = onSnapshot(itemsQuery, (snapshot) => {
      const newItems = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as PantryItem)
      );
      setItems(newItems);
    });

    const categoriesQuery = query(collection(db, "categories"));
    const unsubscribeCategories = onSnapshot(categoriesQuery, (snapshot) => {
      const newCategories = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Category)
      );
      setCategories(newCategories);
    });

    return () => {
      unsubscribeItems();
      unsubscribeCategories();
    };
  }, []);

  const handleSaveItem = async (
    item: Omit<PantryItem, "id"> & { id?: string }
  ) => {
    try {
      if (item.id) {
        await updateDoc(doc(db, "pantryItems", item.id), item);
        setSnackbar({
          open: true,
          message: "Item updated successfully",
          severity: "success",
        });
      } else {
        await addDoc(collection(db, "pantryItems"), item);
        setSnackbar({
          open: true,
          message: "Item added successfully",
          severity: "success",
        });
      }
      setIsAddEditModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Error saving item:", error);
      setSnackbar({
        open: true,
        message: "Error saving item",
        severity: "error",
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, "pantryItems", id));
      setSnackbar({
        open: true,
        message: "Item deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      setSnackbar({
        open: true,
        message: "Error deleting item",
        severity: "error",
      });
    }
    setDeleteItemId(null);
  };

  const handleAddCategory = async (categoryName: string) => {
    try {
      await addDoc(collection(db, "categories"), { name: categoryName });
      setSnackbar({
        open: true,
        message: "Category added successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error adding category:", error);
      setSnackbar({
        open: true,
        message: "Error adding category",
        severity: "error",
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteDoc(doc(db, "categories", categoryId));
      setSnackbar({
        open: true,
        message: "Category deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      setSnackbar({
        open: true,
        message: "Error deleting category",
        severity: "error",
      });
    }
  };

  const filteredAndSortedItems = items
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterCategory ? item.category === filterCategory : true)
    )
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (aValue === undefined || bValue === undefined) return 0;
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const expiringSoonItems = filteredAndSortedItems.filter((item) => {
    if (!item.expirationDate) return false;
    const daysUntilExpiration = differenceInDays(
      new Date(item.expirationDate),
      new Date()
    );
    return daysUntilExpiration <= 7 && daysUntilExpiration > 0;
  });

  const handleAddItem = () => {
    setSelectedItem(null);
    setIsAddEditModalOpen(true);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSort = (newSortBy: keyof PantryItem) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  const handleFilter = (category: string) => {
    setFilterCategory(category);
  };

  const handleImageUpload = async (imageUrl: string, itemId: string) => {
    try {
      // GPT Vision API classification
      const gptResponse = await fetch('/api/classify-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      });
      const gptData = await gptResponse.json();
  
      // Vertex AI classification
      const vertexResponse = await fetch('/api/classify-image-vertex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      });
      const vertexData = await vertexResponse.json();
  
      // Combine the classifications
      const classification = {
        gptVision: gptData.classification,
        vertexAI: vertexData.classification.predictions[0].displayNames[0], // Adjust based on actual response structure
      };
  
      // Update Firebase
      await updateDoc(doc(db, 'pantryItems', itemId), { 
        imageUrl, 
        classification 
      });
  
      setSnackbar({ open: true, message: 'Image uploaded and classified', severity: 'success' });
    } catch (error) {
      console.error('Error uploading and classifying image:', error);
      setSnackbar({ open: true, message: 'Error uploading image', severity: 'error' });
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <TopBar onSearch={handleSearch} onAddItem={handleAddItem} />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Sidebar
              categories={categories}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
              onFilter={handleFilter}
            />
          </Grid>
          <Grid item xs={12} md={9}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <Typography variant="h4" gutterBottom>
                Pantry Items
              </Typography>
              <PantryItemList
                items={filteredAndSortedItems}
                expiringSoonItems={expiringSoonItems}
                onItemSelect={setSelectedItem}
                onDeleteItem={setDeleteItemId}
                onQuickEdit={handleSaveItem}
                onSort={handleSort}
                categories={categories}
              />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mt: 2 }}>
              <RecipeSuggestion pantryItems={items.map((item) => item.name)} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <AddEditItemModal
        open={isAddEditModalOpen || !!selectedItem}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleSaveItem}
        item={selectedItem}
        categories={categories}
      >
        <ImageCapture
          onImageUpload={(url) =>
            selectedItem && handleImageUpload(url, selectedItem.id)
          }
        />
      </AddEditItemModal>
      <ConfirmDialog
        open={!!deleteItemId}
        onClose={() => setDeleteItemId(null)}
        onConfirm={() => deleteItemId && handleDeleteItem(deleteItemId)}
        title="Confirm Delete"
        content="Are you sure you want to delete this item?"
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default PantryManager;
