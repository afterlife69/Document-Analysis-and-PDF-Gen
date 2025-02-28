import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './viewpdf.css';
import Navbar from '../components/Navbar';

const ViewPDF = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const url = searchParams.get('url');

  if (!url) {
    navigate('/pdf');
    return null;
  }

  return (
    <div className="view-container">
      <Navbar />
      <div className="pdf-viewer">
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