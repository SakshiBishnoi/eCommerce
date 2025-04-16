import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Spinner, 
  Alert, 
  AlertIcon, 
  SimpleGrid, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatHelpText, 
  Card, 
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Flex,
  Icon
} from '@chakra-ui/react';
import { 
  FiShoppingBag, 
  FiUsers, 
  FiDollarSign, 
  FiPackage,
  FiTrendingUp,
  FiTrendingDown
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>({
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalProducts: 0,
    recentOrders: []
  });
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
        else {
          // Calculate stats from orders
          const revenue = data.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
          
          setStats({
            totalOrders: data.length,
            totalUsers: 25, // mock data
            totalRevenue: revenue,
            totalProducts: 48, // mock data
            recentOrders: data.slice(0, 5) // Last 5 orders
          });
        }
      } catch (err) {
        setError('Failed to fetch orders');
      }
      setLoading(false);
    };
    fetchOrders();
  }, [navigate]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100%" py={10}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error" mb={4}>
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Heading as="h1" size="lg" mb={6}>Dashboard</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          helpText="+12% from last month"
          icon={FiShoppingBag}
          accentColor="blue.500"
        />
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          helpText="+8% from last month"
          icon={FiUsers}
          accentColor="green.500"
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.totalRevenue.toFixed(2)}`}
          helpText="+23% from last month" 
          icon={FiDollarSign}
          accentColor="purple.500"
        />
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts}
          helpText="+5% from last month" 
          icon={FiPackage}
          accentColor="orange.500"
        />
      </SimpleGrid>
      
      <Box mb={8}>
        <Heading as="h2" size="md" mb={4}>Recent Orders</Heading>
        <Card>
          <CardBody overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Order ID</Th>
                  <Th>Customer</Th>
                  <Th>Status</Th>
                  <Th isNumeric>Total</Th>
                  <Th>Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {stats.recentOrders.map((order: any) => (
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
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {stats.recentOrders.length === 0 && (
              <Text textAlign="center" py={4} color="gray.500">No recent orders</Text>
            )}
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  helpText: string;
  icon: React.ElementType;
  accentColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, helpText, icon, accentColor }) => {
  const isPositive = helpText.includes('+');
  
  return (
    <Card>
      <CardBody>
        <Flex justify="space-between" align="center">
          <Stat>
            <StatLabel color="gray.500">{title}</StatLabel>
            <StatNumber fontSize="2xl" fontWeight="bold">{value}</StatNumber>
            <StatHelpText display="flex" alignItems="center" m={0}>
              <Icon 
                as={isPositive ? FiTrendingUp : FiTrendingDown} 
                color={isPositive ? "green.400" : "red.400"}
                mr={1}
              />
              {helpText}
            </StatHelpText>
          </Stat>
          <Box 
            p={3} 
            bg={`${accentColor}20`} 
            color={accentColor}
            borderRadius="full"
          >
            <Icon as={icon} boxSize={6} />
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default AdminDashboard; 