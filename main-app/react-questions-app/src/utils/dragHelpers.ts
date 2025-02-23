const dragHelpers = {
    // Function to handle the start of dragging
    handleDragStart: (event: React.DragEvent<HTMLDivElement>, index: number) => {
        event.dataTransfer.setData("text/plain", index.toString());
        event.currentTarget.classList.add("dragging");
    },

    // Function to handle the dragging over an element
    handleDragOver: (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    },

    // Function to handle the drop event
    handleDrop: (event: React.DragEvent<HTMLDivElement>, index: number, questions: string[], setQuestions: React.Dispatch<React.SetStateAction<string[]>>) => {
        const draggedIndex = Number(event.dataTransfer.getData("text/plain"));
        const updatedQuestions = [...questions];
        const [movedQuestion] = updatedQuestions.splice(draggedIndex, 1);
        updatedQuestions.splice(index, 0, movedQuestion);
        setQuestions(updatedQuestions);
    },

    // Function to handle the end of dragging
    handleDragEnd: (event: React.DragEvent<HTMLDivElement>) => {
        event.currentTarget.classList.remove("dragging");
    }
};

export default dragHelpers;