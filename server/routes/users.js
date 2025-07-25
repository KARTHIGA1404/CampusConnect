const express = require('express');
const User = require('../models/User');
const Question = require('../models/Question');
const auth = require('../middleware/auth');

const router = express.Router();

// Get leaderboard


// Get user profile
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -verificationToken');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's questions
    const questions = await Question.find({ author: req.params.id })
      .select('title upvotes answers views isResolved createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get user's answers
    const questionsWithAnswers = await Question.find({
      'answers.author': req.params.id
    }).select('title answers createdAt');

    const userAnswers = [];
    questionsWithAnswers.forEach(question => {
      question.answers.forEach(answer => {
        if (answer.author.toString() === req.params.id) {
          userAnswers.push({
            questionTitle: question.title,
            questionId: question._id,
            content: answer.content,
            upvotes: answer.upvotes.length,
            isAccepted: answer.isAccepted,
            createdAt: answer.createdAt
          });
        }
      });
    });

    userAnswers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      user,
      questions: questions.map(q => ({
        ...q.toObject(),
        upvoteCount: q.upvotes.length,
        answerCount: q.answers.length
      })),
      answers: userAnswers.slice(0, 10)
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile

module.exports = router;