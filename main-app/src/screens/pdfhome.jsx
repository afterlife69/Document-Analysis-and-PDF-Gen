import { useState, useRef, useEffect } from 'react';
import { Alert, Collapse } from '@mui/material';
import axios from 'axios';
import './pixelcanvas'
import "./pdfhome.css"
import { useNavigate } from 'react-router-dom';

export default function PdfHome() {
    const [warning, setWarning] = useState('');
    const [documentLinks, setDocumentLinks] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const res = await axios.get('http://localhost:8080/getDocuments', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'user-email': localStorage.getItem('email')
                    }
                });
                const urls = res.data.documents.map(doc => doc.downloadUrl);
                
                setDocumentLinks(urls.reverse());
            } catch (err) {
                console.error('Failed to fetch documents:', err);
            }
        };
        fetchDocuments();
    }, []); // Empty dependency array ensures the effect runs only once

    console.log(documentLinks);
    
    
    const fileInputRef = useRef(null);
    const nav = useNavigate()
    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files || []);
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        
        if (files.length === 0) return;

        if (documentLinks.length + files.length > 10) {
            setWarning('Total files would exceed the limit of 10. Please delete some files first.');
            setTimeout(() => setWarning(''), 3000);
            return;
        }

        // Check if all files are of allowed types
        const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
        if (invalidFiles.length > 0) {
            setWarning('Please upload only PDF or Word documents');
            setTimeout(() => setWarning(''), 3000);
            return;
        }

        setWarning('');

        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append('document', file);
                
                await axios.post('http://localhost:8080/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'user-email': localStorage.getItem('email')
                    }
                }).then((res) => {
                    localStorage.setItem('sessionId', res.data.sessionId);
                })
            }
            nav('/uploadquestions');
        } catch (error) {
            setWarning('Failed to upload one or more files. Please try again.');
            console.error('Upload error:', error);
        }
    };

    const openPreview = (url) => {
        setPreviewUrl(url);
    };

    const closePreview = () => {
        setPreviewUrl(null);
    };

    return (
        <div className='pdf-body'>
            <Collapse in={Boolean(warning)}>
                <Alert 
                    severity="error"
                    sx={{ 
                        position: 'fixed',
                        top: 20,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 9999,
                        backgroundColor: 'rgba(211, 47, 47, 0.9)',
                        color: 'white',
                        '& .MuiAlert-icon': {
                            color: 'white'
                        }
                    }}
                >
                    {warning}
                </Alert>
            </Collapse>
            <main className='pdf-main'>
                <div 
                    className="pdf-card" 
                    style={{ "--active-color": "rgb(100, 117, 173)" }}
                >
                    <pixel-canvas data-gap="15" data-speed="20" data-colors="#e0f2fe, #7dd3fc, #0ea5e9" data-no-focus></pixel-canvas>
                    <svg xmlns="http://www.w3.org/2000/svg" fill='white' viewBox="0 0 640 512"><path d="M522.7 220.8c3.4-8.9 5.3-18.6 5.3-28.8c0-44.2-35.8-80-80-80c-16.5 0-31.7 5-44.4 13.5c-3.7 2.5-8.2 3.3-12.5 2.3s-8-3.8-10.2-7.6C355.9 77 309.3 48 256 48c-79.5 0-144 64.5-144 144c0 2.5 .1 4.9 .2 7.3c.4 7.1-4 13.5-10.7 15.9C51.7 232.7 16 280.2 16 336c0 70.7 57.3 128 128 128l368 0c61.9 0 112-50.1 112-112c0-54.2-38.5-99.4-89.6-109.8c-4.6-.9-8.6-3.9-10.9-8s-2.6-9.1-.9-13.4zM256 32c53.6 0 101 26.3 130 66.7c3.1 4.3 6 8.8 8.7 13.4c3.5-2.4 7.2-4.5 11-6.4C418.5 99.5 432.8 96 448 96c53 0 96 43 96 96c0 6.6-.7 13-1.9 19.2c-1.1 5.3-2.6 10.5-4.5 15.4c5.3 1.1 10.5 2.5 15.5 4.2C603.6 247.9 640 295.7 640 352c0 70.7-57.3 128-128 128l-368 0C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160zM226.3 274.3l88-88c3.1-3.1 8.2-3.1 11.3 0l88 88c3.1 3.1 3.1 8.2 0 11.3s-8.2 3.1-11.3 0L328 211.3 328 408c0 4.4-3.6 8-8 8s-8-3.6-8-8l0-196.7-74.3 74.3c-3.1 3.1-8.2 3.1-11.3 0s-3.1-8.2 0-11.3z"/></svg>
                    <input 
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx"
                        className="file-input"
                        style={{ display: 'none' }}
                        multiple // Add this attribute
                    />
                    <button className="upload-button" onClick={() => fileInputRef.current.click()}></button>
                    <h3 className='pdf-title'>Upload</h3>
                </div>
                <div className="pdf-scroller">
                    <button className="scroll-btn" onClick={() => {
                        document.querySelector('.pdf-history').scrollBy({ left: -960, behavior: 'smooth' });
                    }}>{'<'}</button>
                    <div className="pdf-history">
                        {documentLinks.map((link, index) => (
                            <div key={index} className="pdf-item">
                                <iframe
                                    src={link}
                                    title={`Document ${index + 1}`}
                                    width="100%"
                                    height="100%"
                                    scrolling='no'
                                    style={{ border: 'none' }}
                                />
                                <div className="pdf-item-buttons">
                                    <button 
                                        className="pdf-button"
                                        onClick={() => openPreview(link)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                            <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" />
                                        </svg>
                                        Preview
                                    </button>
                                    <a 
                                        href={link}
                                        download
                                        className="pdf-button"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" />
                                        </svg>
                                        Download
                                    </a>
                                    
                                </div>
                                
                            </div>
                        ))}
                    </div>
                    <button className="scroll-btn" onClick={() => {
                        document.querySelector('.pdf-history').scrollBy({ left: 960, behavior: 'smooth' });
                    }}>{'>'}</button>
                </div>
            </main>
            {previewUrl && (
                <div className="preview-modal" onClick={closePreview}>
                    <div className="preview-content" onClick={e => e.stopPropagation()}>
                        <button className="close-preview" onClick={closePreview}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" />
                            </svg>
                        </button>
                        <iframe
                            src={previewUrl}
                            title="PDF Preview"
                            width="100%"
                            height="100%"
                            scrolling='no'
                        />
                    </div>
                </div>
            )}
        </div>
    )
}