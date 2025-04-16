import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import { motion } from 'framer-motion';

const LoginRegister: React.FC = () => {
  const [tab, setTab] = useState(0);
  return (
    <Container maxWidth="xs" sx={{ mt: 6 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Tabs value={tab} onChange={(_e, v) => setTab(v)} centered>
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
          <Box mt={2}>
            {tab === 0 ? (
              <Typography>Login form goes here</Typography>
            ) : (
              <Typography>Register form goes here</Typography>
            )}
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default LoginRegister; 