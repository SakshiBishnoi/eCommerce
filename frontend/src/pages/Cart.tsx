import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import { motion } from 'framer-motion';

const Cart: React.FC = () => (
  <Container maxWidth="md" sx={{ mt: 4 }}>
    <Typography variant="h4" gutterBottom>
      Cart
    </Typography>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Box display="flex" flexDirection="column" gap={2}>
        {[1, 2].map((id) => (
          <Card key={id}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Skeleton variant="rectangular" width={80} height={60} />
                <Box flex={1}>
                  <Typography variant="h6">Product {id}</Typography>
                  <Typography color="text.secondary">$49.99</Typography>
                </Box>
                <Button variant="outlined" color="secondary">Remove</Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
      <Box mt={4} textAlign="right">
        <Typography variant="h6">Total: $99.98</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>Checkout</Button>
      </Box>
    </motion.div>
  </Container>
);

export default Cart; 