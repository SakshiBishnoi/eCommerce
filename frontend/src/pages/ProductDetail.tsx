import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductDetail: React.FC = () => (
  <Container maxWidth="md" sx={{ mt: 4 }}>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Button component={Link} to="/products" variant="outlined" sx={{ mb: 2 }}>
        Back to Products
      </Button>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
        <Skeleton variant="rectangular" width={300} height={200} />
        <Box>
          <Typography variant="h4" gutterBottom>Product Title</Typography>
          <Typography color="text.secondary" gutterBottom>Product description goes here...</Typography>
          <Typography variant="h6" color="primary">$99.99</Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }}>Add to Cart</Button>
        </Box>
      </Box>
    </motion.div>
  </Container>
);

export default ProductDetail; 