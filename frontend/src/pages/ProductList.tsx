import React, { useState, useMemo } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, addToCart } from '../store';
import { Link } from 'react-router-dom';

const ProductList: React.FC = () => {
  const products = useSelector((state: RootState) => state.products);
  const dispatch = useDispatch();
  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p: any) => p.category)));
    return ['All', ...cats];
  }, [products]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  // Filter products by selected category and search
  const filteredProducts = useMemo(() => {
    let filtered = selectedCategory === 'All'
      ? products
      : products.filter((p: any) => p.category === selectedCategory);
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter((p: any) =>
        p.name.toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s)
      );
    }
    return filtered;
  }, [products, selectedCategory, search]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Product List
      </Typography>
      <TextField
        label="Search products..."
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <Tabs
        value={selectedCategory}
        onChange={(_e, v) => setSelectedCategory(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3, borderRadius: 2, boxShadow: 1, bgcolor: 'background.paper' }}
        TabIndicatorProps={{ style: { height: 4, borderRadius: 2 } }}
      >
        {categories.map((cat) => (
          <Tab key={cat} value={cat} label={cat} sx={{ fontWeight: 600, textTransform: 'none' }} />
        ))}
      </Tabs>
      <motion.div
        key={selectedCategory + search}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
      >
        <Box display="flex" flexWrap="wrap" gap={3} justifyContent={{ xs: 'center', md: 'flex-start' }}>
          <AnimatePresence>
            {filteredProducts.map((product: any) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  sx={{
                    width: 300,
                    flex: '1 1 300px',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s',
                    boxShadow: 3,
                    '&:hover': { boxShadow: 8, borderColor: 'primary.main' },
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'grey.200',
                    position: 'relative',
                  }}
                  component={Link}
                  to={`/products/${product.id}`}
                >
                  <CardContent>
                    <Skeleton variant="rectangular" width={210} height={118} sx={{ mb: 1, borderRadius: 2 }} />
                    <Typography variant="h6" mt={2}>{product.name}</Typography>
                    <Typography color="text.secondary">{product.category}</Typography>
                    <Typography color="primary" fontWeight={700} mb={1}>${product.price}</Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ position: 'absolute', bottom: 16, right: 16, zIndex: 2 }}
                      onClick={e => {
                        e.preventDefault();
                        dispatch(addToCart({ id: product.id, name: product.name, price: product.price }));
                      }}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>
      </motion.div>
    </Container>
  );
};

export default ProductList; 