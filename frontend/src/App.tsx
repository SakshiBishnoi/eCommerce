import React from 'react';
import { Link as LinkRouter, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Flex, Heading, Button, Container, Text, Badge } from '@chakra-ui/react';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import LoginRegister from './pages/LoginRegister';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { CartProvider, useCart } from './context/CartContext';
import CartDrawer from './components/CartDrawer';

const getUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

const AppContent: React.FC = () => {
  const user = getUser();
  const cart = useSelector((state: RootState) => state.cart);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();
  const { isCartOpen, openCart, closeCart } = useCart();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };
  
  return (
    <>
      <Box as="nav" bg="blue.600" color="white" px={4} py={2} boxShadow="md">
        <Flex align="center" maxW="1200px" mx="auto">
          <LinkRouter to="/" style={{ flex: 1, textDecoration: 'none', color: 'white' }}>
            <Heading size="md">eCommerce</Heading>
          </LinkRouter>
          <LinkRouter to="/" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" colorScheme="whiteAlpha" mr={2} _hover={{ bg: 'blue.700' }}>
              Home
            </Button>
          </LinkRouter>
          <LinkRouter to="/products" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" colorScheme="whiteAlpha" mr={2} _hover={{ bg: 'blue.700' }}>
              Products
            </Button>
          </LinkRouter>
          <Button 
            variant="ghost" 
            colorScheme="whiteAlpha" 
            mr={2} 
            _hover={{ bg: 'blue.700' }} 
            position="relative"
            onClick={openCart}
          >
            Cart
            {cartItemCount > 0 && (
              <Badge
                colorScheme="red"
                borderRadius="full"
                position="absolute"
                top="-5px"
                right="-5px"
              >
                {cartItemCount}
              </Badge>
            )}
          </Button>
          <LinkRouter to="/order-history" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" colorScheme="whiteAlpha" mr={2} _hover={{ bg: 'blue.700' }}>
              Order History
            </Button>
          </LinkRouter>
          <LinkRouter to="/checkout" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" colorScheme="whiteAlpha" mr={2} _hover={{ bg: 'blue.700' }}>
              Checkout
            </Button>
          </LinkRouter>
          {user && user.role === 'admin' && (
            <LinkRouter to="/admin" style={{ textDecoration: 'none' }}>
              <Button variant="ghost" colorScheme="yellow" mr={2} _hover={{ bg: 'yellow.400' }}>
                Admin Dashboard
              </Button>
            </LinkRouter>
          )}
          {user && (
            <Text mx={2} fontWeight="bold">{user.name || user.email}</Text>
          )}
          {user ? (
            <Button colorScheme="red" variant="outline" size="sm" onClick={handleLogout} ml={2}>
              Logout
            </Button>
          ) : (
            <LinkRouter to="/login" style={{ textDecoration: 'none' }}>
              <Button variant="ghost" colorScheme="whiteAlpha" _hover={{ bg: 'blue.700' }}>
                Login/Register
              </Button>
            </LinkRouter>
          )}
        </Flex>
      </Box>
      <Container maxW="container.lg" mt={8}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/products" element={<PageWrapper><ProductList /></PageWrapper>} />
            <Route path="/products/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
            <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><LoginRegister /></PageWrapper>} />
            <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
            <Route path="/order-history" element={<PageWrapper><OrderHistory /></PageWrapper>} />
            <Route path="/admin" element={user && user.role === 'admin' ? <PageWrapper><AdminDashboard /></PageWrapper> : <Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </Container>
      
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};

const App: React.FC = () => {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
};

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export default App;
