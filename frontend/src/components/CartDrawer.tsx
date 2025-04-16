import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, removeFromCart, clearCart, updateCartInBackend } from '../store';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Box,
  Text,
  Button,
  Flex,
  Divider,
  Stack,
  useToast,
  Image,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const cart = useSelector((state: RootState) => state.cart);
  const products = useSelector((state: RootState) => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Find product details for each cart item
  const getProductDetails = (id: string) => products.find((p: any) => p.id === id);

  const handleRemove = async (id: string) => {
    dispatch(removeFromCart(id));
    await dispatch(updateCartInBackend(cart.filter(i => i.id !== id)) as any);
  };

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">Your Cart ({cart.length} items)</DrawerHeader>

        <DrawerBody>
          {cart.length === 0 ? (
            <Text color="gray.500" py={8} textAlign="center">Your cart is empty.</Text>
          ) : (
            <Stack spacing={4} mt={4}>
              {cart.map(item => {
                const product = getProductDetails(item.id);
                return (
                  <Flex key={item.id} alignItems="center" justifyContent="space-between" p={2}>
                    <Flex alignItems="center">
                      {product && product.image ? (
                        <Box boxSize="50px" bg="gray.100" borderRadius="md" overflow="hidden" mr={3}>
                          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                      ) : (
                        <Box boxSize="50px" bg="gray.100" borderRadius="md" mr={3} />
                      )}
                      <Box>
                        <Text fontWeight="bold">{item.name}</Text>
                        <Text color="gray.500" fontSize="sm">${item.price} x {item.quantity}</Text>
                      </Box>
                    </Flex>
                    <Button size="sm" colorScheme="red" variant="outline" onClick={() => handleRemove(item.id)}>
                      Remove
                    </Button>
                  </Flex>
                );
              })}
            </Stack>
          )}
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <Box w="100%">
            <Flex justify="space-between" mb={4}>
              <Text fontWeight="bold">Total:</Text>
              <Text fontWeight="bold">${total.toFixed(2)}</Text>
            </Flex>
            <Stack spacing={3}>
              <Button w="100%" colorScheme="blue" onClick={handleViewCart}>
                View Cart
              </Button>
              <Button 
                w="100%" 
                colorScheme="green" 
                isDisabled={cart.length === 0}
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </Stack>
          </Box>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer; 