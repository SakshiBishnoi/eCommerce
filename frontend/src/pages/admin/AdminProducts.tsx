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
  useDisclosure,
  Input,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react';
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Failed to fetch products');
        } else {
          setProducts(data.products || data);
        }
      } catch (err) {
        setError('Failed to fetch products');
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" size="lg">Products</Heading>
        <Button leftIcon={<FiPlus />} colorScheme="blue">
          Add Product
        </Button>
      </Flex>

      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <FiSearch color="gray.300" />
        </InputLeftElement>
        <Input 
          placeholder="Search products..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

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
                <Th>Image</Th>
                <Th>Name</Th>
                <Th>Category</Th>
                <Th isNumeric>Price</Th>
                <Th isNumeric>Stock</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredProducts.map(product => (
                <Tr key={product._id || product.id}>
                  <Td>
                    <Box 
                      w="40px" 
                      h="40px" 
                      bg="gray.100" 
                      borderRadius="md" 
                      overflow="hidden"
                    >
                      {product.image && (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      )}
                    </Box>
                  </Td>
                  <Td fontWeight="medium">{product.name}</Td>
                  <Td>{product.categoryName || (product.category && product.category.name)}</Td>
                  <Td isNumeric>${product.price}</Td>
                  <Td isNumeric>{product.stock || 'N/A'}</Td>
                  <Td>
                    <Button 
                      size="sm" 
                      colorScheme="blue" 
                      variant="ghost" 
                      leftIcon={<FiEdit />}
                      mr={2}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      colorScheme="red" 
                      variant="ghost" 
                      leftIcon={<FiTrash2 />}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {filteredProducts.length === 0 && (
            <Box textAlign="center" my={8} color="gray.500">
              No products found.
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AdminProducts; 