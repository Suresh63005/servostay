import React from 'react';
import { Typography, Box } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ p: 2, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
      <Typography variant="body2" color="textSecondary">
        Footer Content
      </Typography>
    </Box>
  );
};

export default Footer;
