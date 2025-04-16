import React, { useState } from 'react';
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Container,
  useColorModeValue,
  Card,
  CardBody,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  VStack,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const API_URL = '/api/auth';

const LoginRegister: React.FC = () => {
  const cardBg = useColorModeValue('white', 'gray.700');
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.message || (data.errors && data.errors[0]?.msg) || 'Login failed');
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/'; // redirect to home
      }
    } catch (err) {
      setLoginError('Login failed');
    }
    setLoginLoading(false);
  };

  // Register handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');
    setRegLoading(true);
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRegError(data.message || (data.errors && data.errors[0]?.msg) || 'Registration failed');
      } else {
        setRegSuccess('Registration successful! You can now log in.');
      }
    } catch (err) {
      setRegError('Registration failed');
    }
    setRegLoading(false);
  };

  return (
    <Container maxW="xs" mt={12}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card bg={cardBg} boxShadow="md">
          <CardBody>
            <Tabs isFitted variant="enclosed">
              <TabList mb="1em">
                <Tab>Login</Tab>
                <Tab>Register</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <form onSubmit={handleLogin}>
                    <VStack spacing={4} align="stretch">
                      {loginError && <Alert status="error"><AlertIcon />{loginError}</Alert>}
                      <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                      </FormControl>
                      <Button colorScheme="blue" type="submit" isLoading={loginLoading}>Login</Button>
                    </VStack>
                  </form>
                </TabPanel>
                <TabPanel>
                  <form onSubmit={handleRegister}>
                    <VStack spacing={4} align="stretch">
                      {regError && <Alert status="error"><AlertIcon />{regError}</Alert>}
                      {regSuccess && <Alert status="success"><AlertIcon />{regSuccess}</Alert>}
                      <FormControl isRequired>
                        <FormLabel>Name</FormLabel>
                        <Input value={regName} onChange={e => setRegName(e.target.value)} />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
                        <FormErrorMessage>Password must be at least 6 characters</FormErrorMessage>
                      </FormControl>
                      <Button colorScheme="blue" type="submit" isLoading={regLoading}>Register</Button>
                    </VStack>
                  </form>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </motion.div>
    </Container>
  );
};

export default LoginRegister; 