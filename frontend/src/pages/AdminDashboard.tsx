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
  Icon,
  Skeleton,
  SkeletonText,
  Button
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
    ordersChange: 0,
    usersChange: 0,
    revenueChange: 0,
    productsChange: 0,
    recentOrders: [],
    salesByDay: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const summaryCache: { data: any, time: number } = { data: null, time: 0 };

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
    
    // Fetch dashboard summary
    const fetchSummary = async () => {
      setLoading(true);
      
      // Use cache if within 30s
      if (summaryCache.data && Date.now() - summaryCache.time < 30000) {
        setStats(summaryCache.data);
        setLoading(false);
        return;
      }
      
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/orders/summary', {
          headers: { Authorization: `Bearer ${token}` },
          // Add cache control header to prevent browser caching
          cache: 'no-cache', 
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: 'Failed to fetch dashboard summary' }));
          throw new Error(errorData.message || `Server responded with status: ${res.status}`);
        }
        
        const data = await res.json();
        setStats(data);
        summaryCache.data = data;
        summaryCache.time = Date.now();
        setError('');
      } catch (err) {
        console.error('Dashboard error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard summary';
        setError(errorMessage);
        
        // Retry logic (max 3 times, with exponential backoff)
        if (retryCount < maxRetries) {
          const backoffTime = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s
          console.log(`Retrying in ${backoffTime}ms (attempt ${retryCount + 1}/${maxRetries})`);
          
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            // This will trigger the effect again
          }, backoffTime);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchSummary();
  }, [navigate, retryCount]);
  
  // Function to refresh data manually
  const handleRefresh = () => {
    setRetryCount(0); // This will trigger a fresh fetch
  };

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
      <Box>
        <Heading as="h1" size="lg" mb={6}>Dashboard</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          {[...Array(4)].map((_, i) => (
            <Card key={i}><CardBody><Skeleton height="80px" /></CardBody></Card>
          ))}
        </SimpleGrid>
        <Box mb={8}>
          <Heading as="h2" size="md" mb={4}>Recent Orders</Heading>
          <Card><CardBody><SkeletonText mt="4" noOfLines={6} spacing="4" /></CardBody></Card>
        </Box>
        <Box mb={8}>
          <Heading as="h2" size="md" mb={4}>Sales by Day (Last 30 Days)</Heading>
          <Card><CardBody><SkeletonText mt="4" noOfLines={6} spacing="4" /></CardBody></Card>
        </Box>
        <Box mb={8}>
          <Heading as="h2" size="md" mb={4}>Top Products</Heading>
          <Card><CardBody><SkeletonText mt="4" noOfLines={6} spacing="4" /></CardBody></Card>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={5}>
        <Alert status="error" mb={4}>
          <AlertIcon />
          <Box flex="1">
            <Text fontWeight="bold">Error loading dashboard</Text>
            <Text>{error}</Text>
          </Box>
          <Button colorScheme="red" size="sm" onClick={handleRefresh}>
            Retry
          </Button>
        </Alert>
        
        {/* Show skeleton content even when error occurs */}
        <Heading as="h1" size="lg" mb={6}>Dashboard</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          {[...Array(4)].map((_, i) => (
            <Card key={i}><CardBody><Skeleton height="80px" /></CardBody></Card>
          ))}
        </SimpleGrid>
      </Box>
    );
  }

  return (
    <Box>
      <Heading as="h1" size="lg" mb={6}>Dashboard</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          helpText={`${stats.ordersChange >= 0 ? '+' : ''}${stats.ordersChange}% from last month`}
          icon={FiShoppingBag}
          accentColor="blue.500"
        />
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          helpText={`${stats.usersChange >= 0 ? '+' : ''}${stats.usersChange}% from last month`}
          icon={FiUsers}
          accentColor="green.500"
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.totalRevenue.toFixed(2)}`}
          helpText={`${stats.revenueChange >= 0 ? '+' : ''}${stats.revenueChange}% from last month`} 
          icon={FiDollarSign}
          accentColor="purple.500"
        />
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts}
          helpText={`${stats.productsChange >= 0 ? '+' : ''}${stats.productsChange}% from last month`} 
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
      {/* Sales by Day Chart */}
      <Box mb={8}>
        <Heading as="h2" size="md" mb={4}>Sales by Day (Last 30 Days)</Heading>
        <Card>
          <CardBody>
            <Box height="220px" position="relative">
              {stats.salesByDay.length === 0 ? (
                <Text color="gray.500" textAlign="center" position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
                  No sales data
                </Text>
              ) : (
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>Date</Th>
                      <Th isNumeric>Orders</Th>
                      <Th isNumeric>Sales</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {stats.salesByDay.map((d: any) => (
                      <Tr key={d._id}>
                        <Td>{d._id}</Td>
                        <Td isNumeric>{d.count}</Td>
                        <Td isNumeric>${d.totalSales.toFixed(2)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </Box>
          </CardBody>
        </Card>
      </Box>
      {/* Top Products */}
      <Box mb={8}>
        <Heading as="h2" size="md" mb={4}>Top Products</Heading>
        <Card>
          <CardBody>
            {stats.topProducts.length === 0 ? (
              <Text color="gray.500">No top products data</Text>
            ) : (
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Product</Th>
                    <Th isNumeric>Sold</Th>
                    <Th isNumeric>Revenue</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {stats.topProducts.map((p: any) => (
                    <Tr key={p._id}>
                      <Td>{p.name || p._id}</Td>
                      <Td isNumeric>{p.totalSold}</Td>
                      <Td isNumeric>${p.totalRevenue?.toFixed(2)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
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