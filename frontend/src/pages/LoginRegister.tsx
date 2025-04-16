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
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const LoginRegister: React.FC = () => {
  const cardBg = useColorModeValue('white', 'gray.700');
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
                  <Text>Login form goes here</Text>
                </TabPanel>
                <TabPanel>
                  <Text>Register form goes here</Text>
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