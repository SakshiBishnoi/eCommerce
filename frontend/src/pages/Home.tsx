import React from 'react';
import { Container, Heading, Text, Button, Box } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home: React.FC = () => (
  <Container maxW="md" mt={8} textAlign="center">
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Heading as="h1" size="2xl" mb={4}>
        Welcome to the eCommerce Platform
      </Heading>
      <Text fontSize="xl" color="gray.500" mb={4}>
        Discover amazing products and deals!
      </Text>
      <Box mt={4}>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <RouterLink to="/products" style={{ textDecoration: 'none' }}>
            <Button colorScheme="blue" size="lg">
              Shop Now
            </Button>
          </RouterLink>
        </motion.div>
      </Box>
    </motion.div>
  </Container>
);

export default Home; 