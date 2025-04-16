import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Spinner, Stack, Card, CardBody } from '@chakra-ui/react';

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) setError(data.message || 'Failed to fetch orders');
        else setOrders(data);
      } catch (err) {
        setError('Failed to fetch orders');
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  return (
    <Box maxW="container.md" mx="auto" mt={4}>
      <Heading as="h2" size="lg" mb={4}>Order History</Heading>
      {loading ? (
        <Spinner />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : orders.length === 0 ? (
        <Text>No orders found.</Text>
      ) : (
        <Stack spacing={4}>
          {orders.map(order => (
            <Card key={order._id}>
              <CardBody>
                <Text fontWeight="bold">Order #{order._id}</Text>
                <Text>Status: {order.status}</Text>
                <Text>Total: ${order.total}</Text>
                <Text>Date: {new Date(order.createdAt).toLocaleString()}</Text>
                <Text>Items:</Text>
                <ul>
                  {order.products.map((item: any, idx: number) => (
                    <li key={idx}>Product: {item.product} | Qty: {item.quantity}</li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};
export default OrderHistory; 