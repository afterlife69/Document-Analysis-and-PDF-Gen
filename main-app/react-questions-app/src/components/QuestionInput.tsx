import React, { useState } from 'react';
import './QuestionInput.css';

interface QuestionInputProps {
    onAddQuestion: (question: string) => void;
}

const QuestionInput: React.FC<QuestionInputProps> = ({ onAddQuestion }) => {
    const [question, setQuestion] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuestion(event.target.value);
    };

    const handleAddQuestion = () => {
        if (question.trim()) {
            onAddQuestion(question);
            setQuestion('');
        }
    };

    return (
        <div className='question-input'>
            <input
                type='text'
                placeholder='Enter your question'
                value={question}
                onChange={handleInputChange}
                className='upload-input'
            />
            <button onClick={handleAddQuestion}>Add Question</button>
        </div>
    );
};

export default QuestionInput;