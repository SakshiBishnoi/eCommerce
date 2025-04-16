import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const ProductList: React.FC = () => {
  const products = useSelector((state: RootState) => state.products);
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Product List
      </Typography>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Box display="flex" flexWrap="wrap" gap={3}>
          {products.map((product: any) => (
            <Card key={product.id} sx={{ width: 300, flex: '1 1 300px' }}>
              <CardContent>
                <Skeleton variant="rectangular" width={210} height={118} />
                <Typography variant="h6" mt={2}>{product.name}</Typography>
                <Typography color="text.secondary">${product.price}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </motion.div>
    </Container>
  );
};

export default ProductList; 