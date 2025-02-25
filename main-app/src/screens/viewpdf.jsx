import React, { useState } from 'react';
import { useResponses } from '../context/ResponseContext';
import { CircularProgress, IconButton, Paper } from '@mui/material';
import { ZoomIn, ZoomOut, Download } from '@mui/icons-material';
import './viewpdf.css';

const ViewPDF = () => {
  const { responses } = useResponses();
  const [zoom, setZoom] = useState(100);
  const [loading, setLoading] = useState(true);

  if (!responses || !responses.pdfLink) {
    return (
      <div className="no-pdf-container">
        <h2>No PDF available</h2>
        <p>Please generate a PDF first</p>
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(responses.pdfLink);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'document.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));

  return (
    <div className="pdf-viewer-container">
      <Paper elevation={3} className="pdf-toolbar">
        <div className="zoom-controls">
          <IconButton onClick={handleZoomOut} color="primary">
            <ZoomOut />
          </IconButton>
          <span className="zoom-level">{zoom}%</span>
          <IconButton onClick={handleZoomIn} color="primary">
            <ZoomIn />
          </IconButton>
        </div>
        <IconButton 
          onClick={handleDownload} 
          color="primary"
          className="download-button"
        >
          <Download />
        </IconButton>
      </Paper>

      <div className="pdf-content">
        {loading && (
          <div className="loading-overlay">
            <CircularProgress />
          </div>
        )}
        <iframe
          src={`${responses.pdfLink}#zoom=${zoom}`}
          title="PDF Viewer"
          className="pdf-frame"
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  );
};

export default ViewPDF;