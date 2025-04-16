import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home: React.FC = () => (
  <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Typography variant="h2" gutterBottom>
        Welcome to the eCommerce Platform
      </Typography>
      <Typography variant="h5" color="text.secondary" gutterBottom>
        Discover amazing products and deals!
      </Typography>
      <Box mt={4}>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button component={Link} to="/products" variant="contained" size="large" color="primary">
            Shop Now
          </Button>
        </motion.div>
      </Box>
    </motion.div>
  </Container>
);

export default Home; 