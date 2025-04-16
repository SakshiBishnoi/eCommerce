import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link as LinkRouter } from 'react-router-dom';
import { Box, Flex, Heading, Button, Container } from '@chakra-ui/react';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import LoginRegister from './pages/LoginRegister';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  return (
    <Router>
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
          <LinkRouter to="/cart" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" colorScheme="whiteAlpha" mr={2} _hover={{ bg: 'blue.700' }}>
              Cart
            </Button>
          </LinkRouter>
          <LinkRouter to="/login" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" colorScheme="whiteAlpha" _hover={{ bg: 'blue.700' }}>
              Login/Register
            </Button>
          </LinkRouter>
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
          </Routes>
        </AnimatePresence>
      </Container>
    </Router>
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
