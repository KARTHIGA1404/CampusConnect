const express = require('express');
const Question = require('../models/Question');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all questions with filters
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      tags,
      priority,
      department,
      semester,
      resolved,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$text = { $search: search };
    }
    
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',');
      filter.tags = { $in: tagArray };
    }
    
    if (priority) {
      filter.priority = priority;
    }
    
    if (department) {
      filter.department = department;
    }
    
    if (semester) {
      filter.semester = parseInt(semester);
    }
    
    if (resolved !== undefined) {
      filter.isResolved = resolved === 'true';
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const questions = await Question.find(filter)
      .populate('author', 'name reputation avatar')
      .populate('answers.author', 'name reputation avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Question.countDocuments(filter);

    // Transform questions to include computed fields
    const transformedQuestions = questions.map(question => ({
      ...question.toObject(),
      upvoteCount: question.upvotes.length,
      answerCount: question.answers.length,
      author: question.isAnonymous ? { name: 'Anonymous', isAnonymous: true, reputation: 0 } : question.author
    }));

    res.json({
      questions: transformedQuestions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single question by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'name reputation avatar')
      .populate('answers.author', 'name reputation avatar');

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Increment view count
    await question.incrementViews();

    // Transform question to include computed fields
    const transformedQuestion = {
      ...question.toObject(),
      upvoteCount: question.upvotes.length,
      answerCount: question.answers.length,
      author: question.isAnonymous ? { name: 'Anonymous', isAnonymous: true, reputation: 0 } : question.author,
      answers: question.answers.map(answer => ({
        ...answer.toObject(),
        upvoteCount: answer.upvotes.length,
        author: answer.isAnonymous ? { name: 'Anonymous', isAnonymous: true, reputation: 0 } : answer.author
      }))
    };

    res.json(transformedQuestion);
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new question
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, tags, priority, isAnonymous } = req.body;

    const question = new Question({
      title,
      content,
      author: req.user._id,
      isAnonymous: isAnonymous || false,
      tags: tags || [],
      priority: priority || 'Medium',
      department: req.user.department,
      semester: req.user.semester
    });

    await question.save();

    // Update user's question count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { questionsAsked: 1 }
    });

    // Populate author info
    await question.populate('author', 'name reputation avatar');

    // Transform question
    const transformedQuestion = {
      ...question.toObject(),
      upvoteCount: 0,
      answerCount: 0,
      author: question.isAnonymous ? { name: 'Anonymous', isAnonymous: true, reputation: 0 } : question.author
    };

    res.status(201).json(transformedQuestion);
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upvote/downvote question
router.post('/:id/upvote', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const existingUpvote = question.upvotes.find(upvote => 
      upvote.user.toString() === req.user._id.toString()
    );

    if (existingUpvote) {
      // Remove upvote
      await question.removeUpvote(req.user._id);
    } else {
      // Add upvote
      await question.addUpvote(req.user._id);
      
      // Award reputation to question author (if not anonymous and not self-upvote)
      if (!question.isAnonymous && question.author.toString() !== req.user._id.toString()) {
        await User.findByIdAndUpdate(question.author, {
          $inc: { reputation: 5 }
        });
      }
    }

    res.json({ 
      upvoteCount: question.upvotes.length,
      hasUpvoted: !existingUpvote
    });
  } catch (error) {
    console.error('Upvote question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add answer to question
router.post('/:id/answers', auth, async (req, res) => {
  try {
    const { content, isAnonymous } = req.body;
    
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answerData = {
      content,
      author: req.user._id,
      isAnonymous: isAnonymous || false
    };

    await question.addAnswer(answerData);

    // Update user's answer count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { questionsAnswered: 1, reputation: 2 }
    });

    // Populate the new answer
    await question.populate('answers.author', 'name reputation avatar');
    
    const newAnswer = question.answers[question.answers.length - 1];
    
    // Transform answer
    const transformedAnswer = {
      ...newAnswer.toObject(),
      upvoteCount: 0,
      author: newAnswer.isAnonymous ? { name: 'Anonymous', isAnonymous: true, reputation: 0 } : newAnswer.author
    };

    res.status(201).json(transformedAnswer);
  } catch (error) {
    console.error('Add answer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upvote answer
router.post('/:questionId/answers/:answerId/upvote', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answer = question.answers.id(req.params.answerId);
    
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    const existingUpvote = answer.upvotes.find(upvote => 
      upvote.user.toString() === req.user._id.toString()
    );

    if (existingUpvote) {
      // Remove upvote
      answer.upvotes = answer.upvotes.filter(upvote => 
        upvote.user.toString() !== req.user._id.toString()
      );
    } else {
      // Add upvote
      answer.upvotes.push({ user: req.user._id });
      
      // Award reputation to answer author (if not anonymous and not self-upvote)
      if (!answer.isAnonymous && answer.author.toString() !== req.user._id.toString()) {
        await User.findByIdAndUpdate(answer.author, {
          $inc: { reputation: 3 }
        });
      }
    }

    await question.save();

    res.json({ 
      upvoteCount: answer.upvotes.length,
      hasUpvoted: !existingUpvote
    });
  } catch (error) {
    console.error('Upvote answer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept answer
router.post('/:questionId/answers/:answerId/accept', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user is the question author
    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the question author can accept answers' });
    }

    const answer = question.answers.id(req.params.answerId);
    
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Unaccept all other answers
    question.answers.forEach(ans => {
      ans.isAccepted = false;
    });

    // Accept this answer
    answer.isAccepted = true;
    
    // Mark question as resolved
    question.isResolved = true;
    question.resolvedAt = new Date();

    await question.save();

    // Award reputation to answer author (if not anonymous)
    if (!answer.isAnonymous) {
      await User.findByIdAndUpdate(answer.author, {
        $inc: { reputation: 15, bestAnswers: 1 }
      });
    }

    res.json({ message: 'Answer accepted successfully' });
  } catch (error) {
    console.error('Accept answer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ PATCH /api/questions/:id/resolve
router.patch('/:id/resolve', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { isResolved } = req.body;

    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { isResolved },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating resolved status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Get trending tags
router.get('/tags/trending', auth, async (req, res) => {
  try {
    const tags = await Question.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json(tags.map(tag => ({ name: tag._id, count: tag.count })));
  } catch (error) {
    console.error('Get trending tags error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// DELETE /api/questions/:id - Delete a question
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('🔍 Delete request for question ID:', req.params.id);
    const question = await Question.findById(req.params.id);

    if (!question) {
      console.log('❌ Question not found');
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check permission
    if (
      question.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      console.log('⛔ Unauthorized delete attempt by user:', req.user._id);
      return res.status(403).json({ message: 'Unauthorized to delete this question' });
    }

    console.log('✅ Authorized. Proceeding to delete...');
    await question.remove();

    console.log('🧹 Decreasing question count for author:', question.author);
    await User.findByIdAndUpdate(question.author, {
      $inc: { questionsAsked: -1 }
    });

    console.log('✅ Question deleted successfully');
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('❌ Delete question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;