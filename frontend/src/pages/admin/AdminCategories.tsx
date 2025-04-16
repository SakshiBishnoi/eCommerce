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
  Badge
} from '@chakra-ui/react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/categories', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Failed to fetch categories');
        } else {
          setCategories(data);
        }
      } catch (err) {
        setError('Failed to fetch categories');
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" size="lg">Categories</Heading>
        <Button leftIcon={<FiPlus />} colorScheme="blue">
          Add Category
        </Button>
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
                <Th>Name</Th>
                <Th>Products</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {categories.map(category => (
                <Tr key={category._id || category.id}>
                  <Td fontWeight="medium">{category.name}</Td>
                  <Td>
                    <Badge colorScheme="blue" borderRadius="full" px={2}>
                      {category.productCount || 0} products
                    </Badge>
                  </Td>
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
          {categories.length === 0 && (
            <Box textAlign="center" my={8} color="gray.500">
              No categories found.
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AdminCategories; 