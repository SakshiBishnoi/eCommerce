import React, { useState } from 'react';
import { 
  Box, 
  Heading, 
  Button, 
  Flex, 
  Alert, 
  AlertIcon,
  FormControl,
  FormLabel,
  Input,
  Divider,
  Switch,
  Text,
  Stack,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  useToast
} from '@chakra-ui/react';
import { FiSave } from 'react-icons/fi';

const AdminSettings: React.FC = () => {
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Store settings
  const [storeName, setStoreName] = useState('My eCommerce Store');
  const [storeEmail, setStoreEmail] = useState('contact@example.com');
  const [storePhone, setStorePhone] = useState('555-123-4567');
  
  // Feature flags
  const [enableRegistration, setEnableRegistration] = useState(true);
  const [enableGuestCheckout, setEnableGuestCheckout] = useState(true);
  const [enableReviews, setEnableReviews] = useState(true);
  
  // Email notification settings
  const [notifyNewOrders, setNotifyNewOrders] = useState(true);
  const [notifyLowStock, setNotifyLowStock] = useState(true);
  const [notifyNewUsers, setNotifyNewUsers] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    
    try {
      // Mock API call to save settings
      // In a real app, this would call a backend endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Settings saved',
        status: 'success',
        duration: 3000
      });
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" size="lg">Admin Settings</Heading>
        <Button 
          leftIcon={<FiSave />} 
          colorScheme="blue"
          isLoading={saving}
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </Flex>

      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Card>
          <CardHeader>
            <Heading size="md">Store Information</Heading>
          </CardHeader>
          <CardBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Store Name</FormLabel>
                <Input 
                  value={storeName} 
                  onChange={(e) => setStoreName(e.target.value)} 
                />
              </FormControl>
              <FormControl>
                <FormLabel>Contact Email</FormLabel>
                <Input 
                  type="email"
                  value={storeEmail} 
                  onChange={(e) => setStoreEmail(e.target.value)} 
                />
              </FormControl>
              <FormControl>
                <FormLabel>Contact Phone</FormLabel>
                <Input 
                  value={storePhone} 
                  onChange={(e) => setStorePhone(e.target.value)} 
                />
              </FormControl>
            </Stack>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Feature Settings</Heading>
          </CardHeader>
          <CardBody>
            <Stack spacing={4}>
              <FormControl display="flex" alignItems="center">
                <Switch 
                  isChecked={enableRegistration}
                  onChange={() => setEnableRegistration(!enableRegistration)}
                  id="enable-registration"
                  mr={3}
                />
                <FormLabel htmlFor="enable-registration" mb={0}>
                  Enable User Registration
                </FormLabel>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <Switch 
                  isChecked={enableGuestCheckout}
                  onChange={() => setEnableGuestCheckout(!enableGuestCheckout)}
                  id="enable-guest-checkout"
                  mr={3}
                />
                <FormLabel htmlFor="enable-guest-checkout" mb={0}>
                  Enable Guest Checkout
                </FormLabel>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <Switch 
                  isChecked={enableReviews}
                  onChange={() => setEnableReviews(!enableReviews)}
                  id="enable-reviews"
                  mr={3}
                />
                <FormLabel htmlFor="enable-reviews" mb={0}>
                  Enable Product Reviews
                </FormLabel>
              </FormControl>
            </Stack>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Email Notifications</Heading>
          </CardHeader>
          <CardBody>
            <Stack spacing={4}>
              <FormControl display="flex" alignItems="center">
                <Switch 
                  isChecked={notifyNewOrders}
                  onChange={() => setNotifyNewOrders(!notifyNewOrders)}
                  id="notify-orders"
                  mr={3}
                />
                <FormLabel htmlFor="notify-orders" mb={0}>
                  New Order Notifications
                </FormLabel>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <Switch 
                  isChecked={notifyLowStock}
                  onChange={() => setNotifyLowStock(!notifyLowStock)}
                  id="notify-stock"
                  mr={3}
                />
                <FormLabel htmlFor="notify-stock" mb={0}>
                  Low Stock Alerts
                </FormLabel>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <Switch 
                  isChecked={notifyNewUsers}
                  onChange={() => setNotifyNewUsers(!notifyNewUsers)}
                  id="notify-users"
                  mr={3}
                />
                <FormLabel htmlFor="notify-users" mb={0}>
                  New User Registrations
                </FormLabel>
              </FormControl>
            </Stack>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default AdminSettings; 