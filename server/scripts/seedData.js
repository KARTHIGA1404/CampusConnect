const mongoose = require('mongoose');
const User = require('../models/User');
const Question = require('../models/Question');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campusconnect');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Question.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const users = [
      {
        name: 'John Doe',
        email: 'john.doe@college.edu',
        password: 'password123',
        department: 'Computer Science',
        semester: 6,
        reputation: 120,
        isVerified: true,
        questionsAsked: 5,
        questionsAnswered: 23,
        bestAnswers: 15
      },
      {
        name: 'Sarah Chen',
        email: 'sarah.chen@college.edu',
        password: 'password123',
        department: 'Computer Science',
        semester: 7,
        reputation: 2450,
        isVerified: true,
        questionsAsked: 23,
        questionsAnswered: 87,
        bestAnswers: 45
      },
      {
        name: 'Mike Johnson',
        email: 'mike.johnson@college.edu',
        password: 'password123',
        department: 'Information Technology',
        semester: 6,
        reputation: 1890,
        isVerified: true,
        questionsAsked: 18,
        questionsAnswered: 65,
        bestAnswers: 32
      },
      {
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@college.edu',
        password: 'password123',
        department: 'Computer Science',
        semester: 5,
        reputation: 1675,
        isVerified: true,
        questionsAsked: 31,
        questionsAnswered: 58,
        bestAnswers: 28
      }
    ];

    const createdUsers = await User.create(users);
    console.log('Created sample users');

    // Create sample questions
    const questions = [
      {
        title: 'How to implement binary search tree in C++?',
        content: 'I am struggling with implementing a balanced binary search tree. Can someone help me understand the insertion and deletion algorithms?',
        author: createdUsers[0]._id,
        isAnonymous: true,
        tags: ['Data Structures', 'C++', 'Algorithms'],
        priority: 'Critical',
        department: 'Computer Science',
        semester: 4,
        views: 127,
        answers: [
          {
            content: 'You can implement a binary search tree in C++ using a class structure. Here\'s a basic implementation:\n\n```cpp\nclass TreeNode {\npublic:\n    int data;\n    TreeNode* left;\n    TreeNode* right;\n    \n    TreeNode(int val) : data(val), left(nullptr), right(nullptr) {}\n};\n```',
            author: createdUsers[1]._id,
            isAnonymous: false,
            upvotes: [{ user: createdUsers[0]._id }, { user: createdUsers[2]._id }],
            isAccepted: true
          }
        ],
        upvotes: [
          { user: createdUsers[1]._id },
          { user: createdUsers[2]._id },
          { user: createdUsers[3]._id }
        ]
      },
      {
        title: 'React useState vs useReducer - When to use what?',
        content: 'I am building a complex form and confused between useState and useReducer. What are the best practices?',
        author: createdUsers[1]._id,
        isAnonymous: false,
        tags: ['React', 'JavaScript', 'Web Development'],
        priority: 'Medium',
        department: 'Computer Science',
        semester: 6,
        views: 89,
        isResolved: true,
        resolvedAt: new Date(),
        answers: [
          {
            content: 'Use useState for simple state management and useReducer for complex state logic with multiple sub-values or when the next state depends on the previous one.',
            author: createdUsers[2]._id,
            isAnonymous: false,
            upvotes: [{ user: createdUsers[1]._id }],
            isAccepted: true
          }
        ],
        upvotes: [
          { user: createdUsers[0]._id },
          { user: createdUsers[2]._id }
        ]
      },
      {
        title: 'Database normalization - 3NF vs BCNF',
        content: 'Can someone explain the difference between 3NF and BCNF with practical examples? I have an exam tomorrow!',
        author: createdUsers[2]._id,
        isAnonymous: false,
        tags: ['Database', 'SQL', 'Theory'],
        priority: 'Critical',
        department: 'Computer Science',
        semester: 5,
        views: 156,
        upvotes: [
          { user: createdUsers[0]._id },
          { user: createdUsers[1]._id }
        ]
      }
    ];

    await Question.create(questions);
    console.log('Created sample questions');

    console.log('Seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
