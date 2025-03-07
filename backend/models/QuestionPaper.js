import mongoose from 'mongoose';

const QuestionPaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true
  },
  term: {
    type: String,
    enum: ['FALL', 'SPRING', 'SUMMER', 'WINTER', 'MIDTERM', 'FINAL'],
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileUrl: {
    type: String
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  // Track new questions created for this paper
  questionIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  // Track existing questions that were reused
  reusedQuestionIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  // Count of new questions
  newQuestionsCount: {
    type: Number,
    default: 0
  },
  // Count of reused questions
  reusedQuestionsCount: {
    type: Number,
    default: 0
  },
  metadata: {
    pageCount: Number,
    wordCount: Number,
    extractedAt: {
      type: Date,
      default: Date.now
    }
  }
}, { timestamps: true });

// Add text index for searching
QuestionPaperSchema.index({ title: 'text', course: 'text' });

const QuestionPaper = mongoose.model('QuestionPaper', QuestionPaperSchema);
export default QuestionPaper;
