const mongoose = require('mongoose');

// Embedded Answer Schema
const answerSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  upvotes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isAccepted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Main Question Schema
const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  priority: {
    type: String,
    enum: ['Critical', 'Hard', 'Medium'],
    default: 'Medium'
  },
  department: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  upvotes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  answers: [answerSchema],
  views: {
    type: Number,
    default: 0
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  resolvedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
questionSchema.index({ title: 'text', content: 'text', tags: 'text' });
questionSchema.index({ department: 1, semester: 1 });
questionSchema.index({ priority: 1 });
questionSchema.index({ createdAt: -1 });

// Virtuals
questionSchema.virtual('upvoteCount').get(function () {
  return this.upvotes.length;
});

questionSchema.virtual('answerCount').get(function () {
  return this.answers.length;
});

// Methods
questionSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

questionSchema.methods.addUpvote = function (userId) {
  const existingUpvote = this.upvotes.find(upvote => upvote.user.toString() === userId.toString());
  if (!existingUpvote) {
    this.upvotes.push({ user: userId });
    return this.save();
  }
  return Promise.resolve(this);
};

questionSchema.methods.removeUpvote = function (userId) {
  this.upvotes = this.upvotes.filter(upvote => upvote.user.toString() !== userId.toString());
  return this.save();
};

questionSchema.methods.addAnswer = function (answerData) {
  this.answers.push(answerData);
  return this.save();
};

module.exports = mongoose.model('Question', questionSchema);
