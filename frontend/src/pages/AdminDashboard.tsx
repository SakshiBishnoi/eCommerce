import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Spinner, Stack, Card, CardBody, Table, Thead, Tbody, Tr, Th, Td, Alert, AlertIcon } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const userStr = localStorage.getItem('user');
    let user: any = null;
    try { user = userStr ? JSON.parse(userStr) : null; } catch { user = null; }
    if (!user || user.role !== 'admin') {
      setError('You are not authorized to view this page.');
      setLoading(false);
      setTimeout(() => navigate('/'), 2000);
      return;
    }
    // Fetch all orders
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/orders/all', {
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
  }, [navigate]);

  return (
    <Box maxW="container.xl" mx="auto" mt={4}>
      <Heading as="h2" size="lg" mb={4}>Admin Dashboard</Heading>
      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert status="error"><AlertIcon />{error}</Alert>
      ) : orders.length === 0 ? (
        <Text>No orders found.</Text>
      ) : (
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Order ID</Th>
              <Th>User</Th>
              <Th>Status</Th>
              <Th>Total</Th>
              <Th>Date</Th>
              <Th>Items</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map(order => (
              <Tr key={order._id}>
                <Td>{order._id}</Td>
                <Td>{order.user?.email || order.user}</Td>
                <Td>{order.status}</Td>
                <Td>${order.total}</Td>
                <Td>{new Date(order.createdAt).toLocaleString()}</Td>
                <Td>
                  <ul>
                    {order.products.map((item: any, idx: number) => (
                      <li key={idx}>Product: {item.product} | Qty: {item.quantity}</li>
                    ))}
                  </ul>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};
export default AdminDashboard; 