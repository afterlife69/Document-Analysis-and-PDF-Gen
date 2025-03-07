import Question from '../models/Question.js';

// Get questions sorted by occurrence count (descending)
export const getQuestionLeaderboard = async (req, res) => {
  try {
    console.log('Fetching question leaderboard...');
    
    const limit = parseInt(req.query.limit) || 50; // Default to top 50 questions
    
    const leaderboard = await Question.find({})
      .sort({ occurrenceCount: -1 }) // Sort by occurrence count (descending)
      .limit(limit)
      .select('content questionNumber occurrenceCount marks difficulty')
      .populate({
        path: 'questionPaperId',
        select: 'year term subject'
      });
    
    res.status(200).json({ 
      success: true, 
      count: leaderboard.length,
      data: leaderboard 
    });
  } catch (error) {
    console.error('Error fetching question leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching question leaderboard',
      error: error.message
    });
  }
};
