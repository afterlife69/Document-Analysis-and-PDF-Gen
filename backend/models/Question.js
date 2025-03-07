import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  embedding: {
    type: [Number],
    required: true,
    index: true  // This isn't a true vector index but helps with schema clarity
  },
  questionPaperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuestionPaper',
    required: true
  },
  questionNumber: {
    type: Number,
    required: true
  },
  // New field to track how many times this question has appeared
  occurrenceCount: {
    type: Number,
    default: 1
  },
  marks: {
    type: Number
  },
  difficulty: {
    type: String,
    enum: ['EASY', 'MEDIUM', 'HARD', 'UNKNOWN'],
    default: 'UNKNOWN'
  },
  similarQuestions: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    similarity: {
      type: Number  // Cosine similarity score
    },
    paperYear: Number,
    paperTerm: String
  }],
  metadata: {
    wordCount: Number,
    extractedFrom: {
      pageNumber: Number,
      position: String  // Could be "top", "middle", "bottom"
    },
    hasImage: {
      type: Boolean,
      default: false
    }
  }
}, { timestamps: true });

// Create a text index for searching question content
QuestionSchema.index({ content: 'text' });

const Question = mongoose.model('Question', QuestionSchema);
export default Question;
