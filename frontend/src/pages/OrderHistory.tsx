import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
const OrderHistory: React.FC = () => (
  <Box maxW="container.md" mx="auto" mt={4}>
    <Heading as="h2" size="lg" mb={4}>Order History</Heading>
    <Text>Your past orders will be shown here.</Text>
  </Box>
);
export default OrderHistory; 