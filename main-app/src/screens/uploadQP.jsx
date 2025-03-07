import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
  Grid,
  AppBar,
  Toolbar
} from '@mui/material';
import { 
  CloudUpload, 
  Send, 
  ArrowBack, 
  Home, 
  EmojiEvents, 
  Logout 
} from '@mui/icons-material';
import Loading from './loading';
import './uploadQP.css';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i);

const UploadQuestionPaper = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('No file selected');
  const [paperMetadata, setPaperMetadata] = useState({
    title: '',
    course: '',
    year: CURRENT_YEAR,
    term: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    
    if (!selectedFile) return;
    
    if (selectedFile.type !== 'application/pdf') {
      setSnackbar({
        open: true,
        message: 'Please select a PDF file.',
        severity: 'error'
      });
      return;
    }
    
    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      setSnackbar({
        open: true,
        message: 'File size exceeds 10MB limit.',
        severity: 'error'
      });
      return;
    }
    
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setPaperMetadata(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!file) {
      setSnackbar({
        open: true,
        message: 'Please select a PDF file.',
        severity: 'error'
      });
      return;
    }
    
    const { title, course, year, term } = paperMetadata;
    if (!title || !course || !year || !term) {
      setSnackbar({
        open: true,
        message: 'All fields are required.',
        severity: 'error'
      });
      return;
    }
    
    // Prepare form data - make sure field name matches what the server expects
    const formData = new FormData();
    formData.append('questionPaper', file); // This must match the field name in the route (upload.single('questionPaper'))
    formData.append('title', title);
    formData.append('course', course);
    formData.append('year', year);
    formData.append('term', term);
    
    console.log('Submitting form data:', file, title, course, year, term);
    
    setLoading(true);
    
    try {
      const response = await axios.post(
        'http://localhost:8080/api/upload/question-paper', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Important for file uploads
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setSnackbar({
        open: true,
        message: 'Question paper processed successfully!',
        severity: 'success'
      });
      
      // Navigate to a success or details page after short delay
      setTimeout(() => {
        navigate('/leaderboard');
      }, 1500);
      
    } catch (error) {
      console.error('Error uploading question paper:', error);
      
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to process question paper.',
        severity: 'error'
      });
      
      setLoading(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('token');
    navigate('/signin');
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="upload-body">
      <AppBar position="fixed" color="primary" sx={{ boxShadow: 2, backgroundColor: "#121212" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Upload Question Paper
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              color="inherit" 
              startIcon={<Home />}
              onClick={() => navigateTo('/pdf')}
              sx={{ textTransform: 'none' }}
            >
              Document Uploads
            </Button>
            
            <Button 
              color="inherit" 
              startIcon={<EmojiEvents />}
              onClick={() => navigateTo('/leaderboard')}
              sx={{ textTransform: 'none' }}
            >
              Question Rankings
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

      <Container maxWidth="md" className="upload-main">
        <Paper elevation={3} className="upload-paper">
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Upload Question Paper
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box className="file-upload-container">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    data-testid="pdf-upload"
                  />
                  
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CloudUpload />}
                    onClick={handleBrowseClick}
                    fullWidth
                    className="upload-button"
                  >
                    Select PDF File
                  </Button>
                  
                  <Box className="file-name-container">
                    <Typography variant="body1" noWrap>
                      {fileName}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Paper Title"
                  name="title"
                  value={paperMetadata.title}
                  onChange={handleMetadataChange}
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Course"
                  name="course"
                  value={paperMetadata.course}
                  onChange={handleMetadataChange}
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required variant="outlined">
                  <InputLabel id="year-label">Year</InputLabel>
                  <Select
                    labelId="year-label"
                    id="year"
                    name="year"
                    value={paperMetadata.year}
                    onChange={handleMetadataChange}
                    label="Year"
                  >
                    {YEARS.map(year => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required variant="outlined">
                  <InputLabel id="term-label">Term</InputLabel>
                  <Select
                    labelId="term-label"
                    id="term"
                    name="term"
                    value={paperMetadata.term}
                    onChange={handleMetadataChange}
                    label="Term"
                  >
                    <MenuItem value="FALL">Fall</MenuItem>
                    <MenuItem value="SPRING">Spring</MenuItem>
                    <MenuItem value="SUMMER">Summer</MenuItem>
                    <MenuItem value="WINTER">Winter</MenuItem>
                    <MenuItem value="MIDTERM">Midterm</MenuItem>
                    <MenuItem value="FINAL">Final</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} className="action-buttons">
                <Button 
                  onClick={() => navigateTo('/pdf')}
                  variant="outlined"
                  startIcon={<ArrowBack />}
                >
                  Back to Library
                </Button>
                
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  startIcon={<Send />}
                >
                  Upload and Process
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UploadQuestionPaper;
