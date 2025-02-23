import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import './pixelcanvas';
import "./uploadquestions.css";
import { useNavigate } from 'react-router-dom';
import { Button, Stack, Snackbar, Alert } from '@mui/material';
import Sortable from 'sortablejs';
import { AddCircle, CloudUpload, Delete as DeleteIcon, Send, Edit as EditIcon } from '@mui/icons-material';
import Loading from './loading';


export default function PdfHome() {
    const [questions, setQuestions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const fileInputRef = useRef(null);
    const questionsListRef = useRef(null);
    const sortableInstanceRef = useRef(null);
    const nav = useNavigate();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');

    // A stable callback that always has the latest 'questions'
    const onEnd = useCallback((evt) => {
        if (
            evt.oldIndex == null ||
            evt.newIndex == null ||
            evt.oldIndex < 0 ||
            evt.newIndex < 0 ||
            evt.oldIndex >= questions.length ||
            evt.newIndex >= questions.length
        ) {
            return;
        }
        const newQuestions = [...questions];
        const [movedItem] = newQuestions.splice(evt.oldIndex, 1);
        newQuestions.splice(evt.newIndex, 0, movedItem);
        setQuestions(newQuestions);
    }, [questions]);

    useEffect(() => {
        if (!questionsListRef.current) return;

        // Create Sortable once
        if (!sortableInstanceRef.current) {
            sortableInstanceRef.current = Sortable.create(questionsListRef.current, {
                animation: 150,
                handle: '.drag-handle',
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                dragClass: 'sortable-drag',
                onEnd,
            });
        } else {
            // Update 'onEnd' after each render so it has the latest 'questions'
            sortableInstanceRef.current.option('onEnd', onEnd);
        }

        return () => {
            // Clean up on unmount
            if (sortableInstanceRef.current) {
                sortableInstanceRef.current.destroy();
                sortableInstanceRef.current = null;
            }
        };
    }, [onEnd]);

    const handleAddQuestion = () => {
        if (questions.length >= 20) {
            setSnackbarSeverity('warning');
            setSnackbarMessage('Maximum 20 questions allowed.');
            setSnackbarOpen(true);
            return;
        }
        if (inputValue.trim()) {
            setQuestions([...questions, {
                id: Date.now(),
                content: inputValue.trim()
            }]);
            setInputValue('');
            setSnackbarSeverity('success');
            setSnackbarMessage('Question added.');
            setSnackbarOpen(true);
        }
    };

    const handleFileUpload = () => {
        fileInputRef.current.click();
    };

    const handleDeleteQuestion = (id) => {
        setQuestions((prev) => {
            const newArr = prev.filter((q) => q.id !== id);
            setSnackbarSeverity('info');
            setSnackbarMessage('Question deleted.');
            setSnackbarOpen(true);
            return newArr;
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const text = reader.result;
            if (typeof text !== 'string') return;
            const lines = text.split('\n').map((ln) => ln.trim()).filter((ln) => ln);
            if (lines.length > 20) {
                setSnackbarSeverity('error');
                setSnackbarMessage('File has more than 20 questions.');
                setSnackbarOpen(true);
                return;
            }
            if (questions.length + lines.length > 20) {
                setSnackbarSeverity('error');
                setSnackbarMessage('Total questions exceed 20.');
                setSnackbarOpen(true);
                return;
            }
            const newQuestions = lines.map((q) => ({
                id: Date.now() + Math.random(),
                content: q
            }));
            setQuestions((prev) => [...prev, ...newQuestions]);
            setSnackbarSeverity('success');
            setSnackbarMessage('File uploaded successfully.');
            setSnackbarOpen(true);
        };
        reader.readAsText(file);
    };

    const handleSubmitAll = () => {
        if (!questions.length) {
            setSnackbarSeverity('warning');
            setSnackbarMessage('No questions to submit.');
            setSnackbarOpen(true);
            return;
        }
        setLoading(true);
        axios.post('http://localhost:8080/generatePDF', {
            questions,
            sessionId: localStorage.getItem('sessionId')
        }).then((res) => {
            const QnA = res.data.responses;
            
        })


        setSnackbarSeverity('success');
        setSnackbarMessage('All questions submitted successfully.');
        setSnackbarOpen(true);
    };

    const handleEditStart = (question) => {
        setEditingId(question.id);
        setEditValue(question.content);
    };

    const handleEditSave = (id) => {
        if (editValue.trim()) {
            setQuestions(questions.map(q => 
                q.id === id ? { ...q, content: editValue.trim() } : q
            ));
            setEditingId(null);
            setEditValue('');
            setSnackbarSeverity('success');
            setSnackbarMessage('Question updated.');
            setSnackbarOpen(true);
        }
    };

    return (
        loading ? <Loading /> :
        (<div className='upload-body'>
            <div className='upload-main'>
                <div className='input-container'>
                    <input 
                        type='text' 
                        placeholder='Enter the question' 
                        className='upload-input'
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddQuestion()}
                    />
                    <Stack direction="row" spacing={2} sx={{ ml: 2}}>
                        <Button 
                            variant="outlined"
                            startIcon={<AddCircle />} 
                            onClick={handleAddQuestion}
                            size="large"
                            sx={{ minWidth: '10px' }}
                        >
                            Add
                        </Button>
                        <Button 
                            variant="outlined"
                            startIcon={<CloudUpload />} 
                            onClick={handleFileUpload}
                            size="large"
                            sx={{ minWidth: '10px' }}
                        >
                            Upload
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <Button 
                            variant="outlined"
                            startIcon={<Send />} 
                            onClick={handleSubmitAll}
                            size="large"
                            sx={{ minWidth: '10px' }}
                        >
                            Submit
                        </Button>
                    </Stack>
                </div>
                <pixel-canvas data-gap="20" data-speed="100" data-colors="#e0f2fe, #7dd3fc, #0ea5e9" data-no-focus></pixel-canvas>
            </div>
            
            <div className="questions-container">
                <div ref={questionsListRef} className="questions-list">
                    {questions.map((question) => (
                        <div key={question.id} className="question-item" data-id={question.id}>
                            <span className="drag-handle">☰</span>
                            {editingId === question.id ? (
                                <input
                                    type="text"
                                    className="question-content editable"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onBlur={() => handleEditSave(question.id)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleEditSave(question.id)}
                                    autoFocus
                                />
                            ) : (
                                <span className="question-content">{question.content}</span>
                            )}
                            <div className="question-actions">
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    startIcon={<EditIcon />}
                                    onClick={() => handleEditStart(question)}
                                    sx={{ minWidth: '100px' }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => handleDeleteQuestion(question.id)}
                                    sx={{ minWidth: '100px' }}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>)
    );
}