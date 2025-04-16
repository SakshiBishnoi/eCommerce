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
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react';
import { FiMoreVertical, FiSearch } from 'react-icons/fi';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Failed to fetch users');
        } else {
          setUsers(data);
        }
      } catch (err) {
        setError('Failed to fetch users');
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" size="lg">Users</Heading>
      </Flex>

      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <FiSearch color="gray.300" />
        </InputLeftElement>
        <Input 
          placeholder="Search users..." 
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
                <Th>User</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Orders</Th>
                <Th>Joined</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredUsers.map(user => (
                <Tr key={user._id}>
                  <Td>
                    <Flex align="center">
                      <Avatar size="sm" name={user.name || user.email} mr={2} />
                      <Box>
                        <Box fontWeight="medium">{user.name || 'N/A'}</Box>
                      </Box>
                    </Flex>
                  </Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <Badge 
                      colorScheme={user.role === 'admin' ? 'red' : 'blue'} 
                      borderRadius="full" 
                      px={2}
                    >
                      {user.role}
                    </Badge>
                  </Td>
                  <Td>{user.orderCount || 0}</Td>
                  <Td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label='User actions'
                        icon={<FiMoreVertical />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem>View Details</MenuItem>
                        <MenuItem>View Orders</MenuItem>
                        {user.role !== 'admin' && <MenuItem>Make Admin</MenuItem>}
                        {user.role === 'admin' && <MenuItem>Remove Admin</MenuItem>}
                        <MenuItem color="red.500">Block User</MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {filteredUsers.length === 0 && (
            <Box textAlign="center" my={8} color="gray.500">
              No users found.
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AdminUsers; 