import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, addToCartAndSync } from '../store';
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Skeleton,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = useSelector((state: RootState) =>
    state.products.find((p: any) => p.id === id)
  );
  const dispatch = useDispatch();
  const toast = useToast();
  const { openCart } = useCart();

  if (!product) {
    return (
      <Box maxW="container.md" mx="auto" mt={4}>
        <Text>Product not found.</Text>
        <Button as={RouterLink} to="/products" mt={4} colorScheme="blue">
          Back to Products
        </Button>
      </Box>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCartAndSync({ id: product.id, name: product.name, price: product.price }) as any);
    toast({ title: 'Added to cart!', status: 'success', duration: 1500, isClosable: true });
    openCart();
  };

  return (
    <Box maxW="container.md" mx="auto" mt={4}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Button as={RouterLink} to="/products" variant="outline" mb={4} colorScheme="blue">
          Back to Products
        </Button>
        <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
          <Skeleton height="200px" width="300px" borderRadius="md" />
          <Box>
            <Heading as="h2" size="lg" mb={2}>{product.name}</Heading>
            <Text color="gray.500" mb={2}>{product.categoryName}</Text>
            <Text fontSize="xl" color="blue.500" fontWeight="bold" mb={2}>${product.price}</Text>
            <Button colorScheme="blue" mt={2} onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </Box>
        </Flex>
      </motion.div>
    </Box>
  );
};

export default ProductDetail; 