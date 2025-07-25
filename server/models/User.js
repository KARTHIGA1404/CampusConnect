const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (email) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(edu|ac\.in)$/.test(email);
      },
      message: 'Please use a valid college email address (.edu or .ac.in)'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  department: {
    type: String,
    required: true,
    enum: [
      'Computer Science', 'Information Technology', 'Electronics', 'Mechanical',
      'Civil', 'Electrical', 'Chemical', 'Biotechnology', 'Mathematics', 'Physics'
    ]
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  reputation: {
    type: Number,
    default: 0
  },
  avatar: {
    type: String,
    default: null
  },
  badges: [{
    name: String,
    description: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  questionsAsked: {
    type: Number,
    default: 0
  },
  questionsAnswered: {
    type: Number,
    default: 0
  },
  bestAnswers: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update reputation method
userSchema.methods.updateReputation = function (points) {
  this.reputation += points;
  return this.save();
};


module.exports = mongoose.model('User', userSchema);
