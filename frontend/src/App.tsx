import React from 'react';
import { Link as LinkRouter, useNavigate, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'; // Import useLocation
import { Box, Flex, Heading, Button, Container, Text, Badge } from '@chakra-ui/react';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import LoginRegister from './pages/LoginRegister';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
// import UserDashboard from './pages/UserDashboard'; // Removed unused import
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartDrawer, AdminLayout, AdminRoute } from './components'; // Import AdminLayout

// Admin pages - will be lazy loaded later
import AdminDashboard from './pages/AdminDashboard'; // Corrected path
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';

const AppContent: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const cart = useSelector((state: RootState) => state.cart);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();
  const { isCartOpen, openCart, closeCart } = useCart();
  const location = useLocation(); // Re-add useLocation to check path for Navbar

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Render Navbar only for non-admin routes */}
      {!location.pathname.startsWith('/admin') && (
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
            {isAuthenticated && (
              <LinkRouter to="/order-history" style={{ textDecoration: 'none' }}>
                <Button variant="ghost" colorScheme="whiteAlpha" mr={2} _hover={{ bg: 'blue.700' }}>
                  Order History
                </Button>
              </LinkRouter>
            )}
            {isAuthenticated && (
              <LinkRouter to="/checkout" style={{ textDecoration: 'none' }}>
                <Button variant="ghost" colorScheme="whiteAlpha" mr={2} _hover={{ bg: 'blue.700' }}>
                  Checkout
                </Button>
              </LinkRouter>
            )}
            {user && user.role === 'admin' && (
              <LinkRouter to="/admin" style={{ textDecoration: 'none' }}>
                <Button variant="ghost" colorScheme="yellow" mr={2} _hover={{ bg: 'yellow.400' }}>
                  Admin
                </Button>
              </LinkRouter>
            )}
            {user && (
              <Text mx={2} fontWeight="bold">{user.name || user.email}</Text>
            )}
            {isAuthenticated ? (
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
      )}

      <Routes>
        {/* Regular routes use Navbar and Container layout */}
        <Route
          path="/"
          element={
            <>
              {/* Navbar is rendered outside this Route element now */}
              <Container maxW="container.lg" mt={8}>
                <AnimatePresence mode="wait">
                  <Outlet />
                </AnimatePresence>
              </Container>
            </>
          }
        >
          {/* The Container and Outlet structure is defined in the element prop above */}
          {/* Child routes will render within the Outlet */}
          <Route index element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="products" element={<PageWrapper><ProductList /></PageWrapper>} />
          <Route path="products/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
          <Route path="cart" element={<PageWrapper><Cart /></PageWrapper>} />
          <Route path="login" element={<PageWrapper><LoginRegister /></PageWrapper>} />
          <Route 
            path="checkout" 
            element={
              isAuthenticated ? 
              <PageWrapper><Checkout /></PageWrapper> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="order-history" 
            element={
              isAuthenticated ? 
              <PageWrapper><OrderHistory /></PageWrapper> : 
              <Navigate to="/login" />
            } 
          />
        </Route>

        {/* Admin routes wrapped in AdminLayout and AdminRoute */}
        <Route 
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout>
                <Outlet /> 
              </AdminLayout>
            </AdminRoute>
          }
        >
          {/* Child routes render inside AdminLayout's {children} */}
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
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
