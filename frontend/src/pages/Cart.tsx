import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, removeFromCart, clearCart, updateCartInBackend, clearCartInBackend } from '../store';
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Card,
  CardBody,
  Stack,
  Divider,
  useToast,
  Alert,
  AlertIcon,
  Spinner,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/cartUtils';

const Cart: React.FC = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const products = useSelector((state: RootState) => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Find product details for each cart item (for category, image, etc.)
  const getProductDetails = (id: string) => products.find((p: any) => p.id === id);

  const handleRemove = async (id: string) => {
    try {
      dispatch(removeFromCart(id));
      await dispatch(updateCartInBackend(cart.filter(i => i.id !== id)) as any);
      toast({ title: 'Item removed from cart', status: 'success', duration: 1500, isClosable: true });
    } catch (error) {
      toast({ title: 'Failed to remove item', status: 'error', duration: 2000, isClosable: true });
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated()) {
      toast({ 
        title: 'Please log in', 
        description: 'You need to log in before checkout',
        status: 'warning', 
        duration: 3000, 
        isClosable: true 
      });
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({}), // No need to send products, backend uses cart
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || 'Order failed');
      }
      
      await dispatch(clearCart() as any);
      await dispatch(clearCartInBackend() as any);
      
      toast({ 
        title: 'Checkout successful!', 
        description: 'Your order has been placed',
        status: 'success', 
        duration: 2000, 
        isClosable: true 
      });
      
      navigate('/order-history');
    } catch (err: any) {
      setError(err.message || 'Checkout failed');
      toast({ 
        title: 'Checkout failed', 
        description: err.message || 'There was an error placing your order',
        status: 'error', 
        duration: 3000, 
        isClosable: true 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="container.md" mx="auto" mt={4}>
      <Heading as="h2" size="lg" mb={4}>Cart</Heading>
      
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {cart.length === 0 ? (
          <Box>
            <Text color="gray.500" mb={4}>Your cart is empty.</Text>
            <Button 
              colorScheme="blue" 
              variant="outline" 
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </Button>
          </Box>
        ) : (
          <Stack spacing={4}>
            {cart.map(item => {
              const product = getProductDetails(item.id);
              return (
                <Card key={item.id}>
                  <CardBody>
                    <Flex align="center" gap={4}>
                      {product && product.image ? (
                        <Box boxSize="80px" bg="gray.100" borderRadius="md" overflow="hidden">
                          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                      ) : (
                        <Box boxSize="80px" bg="gray.100" borderRadius="md" />
                      )}
                      <Box flex={1}>
                        <Text fontWeight="bold">{item.name}</Text>
                        {product && product.categoryName && (
                          <Text color="gray.400" fontSize="sm">{product.categoryName}</Text>
                        )}
                        <Text color="gray.500">${item.price} x {item.quantity}</Text>
                      </Box>
                      <Button 
                        colorScheme="red" 
                        variant="outline" 
                        onClick={() => handleRemove(item.id)}
                        isDisabled={isLoading}
                      >
                        Remove
                      </Button>
                    </Flex>
                  </CardBody>
                </Card>
              );
            })}
            <Divider />
            <Flex justify="flex-end" align="center" gap={4}>
              <Text fontWeight="bold">Total: ${total.toFixed(2)}</Text>
              <Button 
                colorScheme="blue" 
                onClick={handleCheckout}
                isLoading={isLoading}
                loadingText="Processing"
                disabled={isLoading || cart.length === 0}
              >
                Checkout
              </Button>
            </Flex>
          </Stack>
        )}
      </motion.div>
    </Box>
  );
};

export default Cart; 