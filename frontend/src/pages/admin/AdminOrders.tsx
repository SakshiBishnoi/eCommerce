import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Heading, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Button, 
  Flex, 
  Spinner, 
  Alert, 
  AlertIcon,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Select
} from '@chakra-ui/react';
import { FiMoreVertical, FiFilter } from 'react-icons/fi';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/orders/all?page=${page}&limit=20`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Failed to fetch orders');
        } else {
          setOrders(data.orders);
          setTotalPages(data.pages);
        }
      } catch (err) {
        setError('Failed to fetch orders');
      }
      setLoading(false);
    };

    fetchOrders();
  }, [page]);

  // Get all available status options from orders
  const statusOptions = ['all', ...new Set(orders.map(order => order.status))];

  // Filter orders by status
  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'yellow';
      case 'processing':
        return 'blue';
      case 'shipped':
        return 'purple';
      case 'delivered':
        return 'green';
      case 'cancelled':
        return 'red';
      case 'paid':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" size="lg">Orders</Heading>
        
        <Flex>
          <Select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            placeholder="Filter by status"
            mx={2}
            w="200px"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </Select>
        </Flex>
      </Flex>

      {loading ? (
        <Flex justify="center" my={8}>
          <Spinner />
        </Flex>
      ) : error ? (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Order ID</Th>
                <Th>Customer</Th>
                <Th>Status</Th>
                <Th isNumeric>Total</Th>
                <Th>Date</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredOrders.map(order => (
                <Tr key={order._id}>
                  <Td fontWeight="medium">{order._id}</Td>
                  <Td>{order.user?.email || order.user}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(order.status)} borderRadius="full" px={2}>
                      {order.status}
                    </Badge>
                  </Td>
                  <Td isNumeric>${order.total?.toFixed(2)}</Td>
                  <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label='Order actions'
                        icon={<FiMoreVertical />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem>View Details</MenuItem>
                        <MenuItem>Update Status</MenuItem>
                        <MenuItem color="red.500">Cancel Order</MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {filteredOrders.length === 0 && (
            <Box textAlign="center" my={8} color="gray.500">
              No orders found.
            </Box>
          )}
          {/* Pagination Controls */}
          <Flex justify="center" mt={4} gap={2}>
            <Button onClick={() => setPage(page - 1)} disabled={page === 1}>Prev</Button>
            <Box px={3} py={1} fontWeight="bold">Page {page} of {totalPages}</Box>
            <Button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default AdminOrders; 