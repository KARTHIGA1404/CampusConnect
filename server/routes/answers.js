const express = require('express');
const router = express.Router();
const Answer = require('../models/Answer'); // Mongoose Answer model
const User = require('../models/User');     // Mongoose User model

// GET all answers for a specific question
router.get('/:questionId', async (req, res) => {
  try {
    const answers = await Answer.find({ questionId: req.params.questionId });
    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST an answer to a specific question
router.post('/:questionId', async (req, res) => {
  try {
    const { content, author } = req.body;

    const newAnswer = new Answer({
      questionId: req.params.questionId,
      content,
      author,
    });

    const saved = await newAnswer.save();

    // Increment questionsAnswered count for the author
    await User.findByIdAndUpdate(author.id, {
      $inc: { questionsAnswered: 1 },
    });

    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET answer count for a specific question
router.get('/count/:questionId', async (req, res) => {
  const { questionId } = req.params;
  try {
    const count = await Answer.countDocuments({ questionId });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching count' });
  }
});

module.exports = router;
