import React, { useState } from 'react';
import { CircularProgress, IconButton, Paper, Button, AppBar, Toolbar, Typography, Box } from '@mui/material';
import { ZoomIn, ZoomOut, Download, ArrowBack, Home, Logout, Upload } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './pixelcanvas';  // Import pixel canvas
import './viewpdf.css';

const ViewPDF = () => {
  const navigate = useNavigate();
  const { search } = window.location;
  const params = new URLSearchParams(search);
  const url = params.get('url') || '';

  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('token');
    navigate('/signin');
  };

  const navigateTo = (path) => {
    navigate(path);
  };
  
  return (
    <div className="view-body">
      <AppBar position="fixed" color="primary" sx={{ boxShadow: 2 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PDF Viewer
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              color="inherit" 
              startIcon={<Home />}
              onClick={() => navigateTo('/pdf')}
              sx={{ textTransform: 'none' }}
            >
              PDF Library
            </Button>
            
            <Button 
              color="inherit" 
              startIcon={<Upload />}
              onClick={() => navigateTo('/uploadQP')}
              sx={{ textTransform: 'none' }}
            >
              Upload Papers
            </Button>

            <Button 
              color="inherit" 
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{ textTransform: 'none' }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      
      <div className='frame-container'>
        <iframe
          src={url}
          title="PDF Viewer"
          className="pdf-frame"
        />
      </div>  
    </div>
  );
};

export default ViewPDF;