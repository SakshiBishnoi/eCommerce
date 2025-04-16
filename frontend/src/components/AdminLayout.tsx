import React, { ReactNode } from 'react';
import { Box, Flex, Stack, Text, Icon, Heading, Divider, useColorModeValue, IconButton } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiShoppingBag, 
  FiUsers, 
  FiList, 
  FiFileText, 
  FiMenu,
  FiChevronLeft,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
}

// Sidebar items configuration
const sidebarItems = [
  { name: 'Dashboard', icon: FiHome, path: '/admin' },
  { name: 'Products', icon: FiShoppingBag, path: '/admin/products' },
  { name: 'Categories', icon: FiList, path: '/admin/categories' },
  { name: 'Orders', icon: FiFileText, path: '/admin/orders' },
  { name: 'Users', icon: FiUsers, path: '/admin/users' },
  { name: 'Settings', icon: FiSettings, path: '/admin/settings' },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = React.useState(false);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const activeBgColor = useColorModeValue('blue.50', 'blue.900');
  const activeTextColor = useColorModeValue('blue.700', 'blue.200');

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <Flex h="100vh">
      {/* Sidebar */}
      <Box
        bg={bgColor}
        borderRight="1px"
        borderColor={borderColor}
        w={collapsed ? "80px" : "250px"}
        position="fixed"
        h="full"
        transition="width 0.3s"
        overflow="hidden"
      >
        <Flex 
          h="20" 
          alignItems="center" 
          justifyContent={collapsed ? "center" : "space-between"}
          px={collapsed ? 0 : 4}
        >
          {!collapsed && <Heading size="md">Admin Panel</Heading>}
          <IconButton
            aria-label="Toggle sidebar"
            icon={collapsed ? <FiMenu /> : <FiChevronLeft />}
            onClick={toggleSidebar}
            variant="ghost"
            size="sm"
          />
        </Flex>
        <Divider />
        <Stack spacing={1} pt={4}>
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Box
                as={RouterLink}
                to={item.path}
                key={item.name}
                px={collapsed ? 0 : 4}
                py={3}
                borderRadius={collapsed ? 0 : "md"}
                bg={isActive ? activeBgColor : "transparent"}
                color={isActive ? activeTextColor : "inherit"}
                _hover={{
                  bg: isActive ? activeBgColor : "gray.100",
                  color: isActive ? activeTextColor : "inherit",
                }}
                display="flex"
                alignItems="center"
                justifyContent={collapsed ? "center" : "flex-start"}
              >
                <Icon as={item.icon} mr={collapsed ? 0 : 3} fontSize="lg" />
                {!collapsed && <Text fontWeight={isActive ? "bold" : "normal"}>{item.name}</Text>}
              </Box>
            );
          })}
          
          <Divider my={2} />
          
          {/* Back to Store Link */}
          <Box
            as={RouterLink}
            to="/"
            px={collapsed ? 0 : 4}
            py={3}
            display="flex"
            alignItems="center"
            justifyContent={collapsed ? "center" : "flex-start"}
            _hover={{ color: "blue.500" }}
          >
            <Icon as={FiHome} mr={collapsed ? 0 : 3} fontSize="lg" />
            {!collapsed && <Text>Back to Store</Text>}
          </Box>
          
          {/* Logout */}
          <Box
            px={collapsed ? 0 : 4}
            py={3}
            display="flex"
            alignItems="center"
            justifyContent={collapsed ? "center" : "flex-start"}
            cursor="pointer"
            _hover={{ color: "red.500" }}
            onClick={logout}
          >
            <Icon as={FiLogOut} mr={collapsed ? 0 : 3} fontSize="lg" />
            {!collapsed && <Text>Logout</Text>}
          </Box>
        </Stack>
      </Box>

      {/* Main Content */}
      <Box 
        ml={collapsed ? "80px" : "250px"} 
        flex="1"
        p={5}
        transition="margin-left 0.3s"
        overflowY="auto"
      >
        {children}
      </Box>
    </Flex>
  );
};

export default AdminLayout; 